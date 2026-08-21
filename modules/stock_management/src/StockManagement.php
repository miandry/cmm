<?php

/**
 * Created by PhpStorm.
 * User: admin
 * Date: 23/03/2018
 * Time: 14:49
 */

namespace Drupal\stock_management;

use Drupal\Core\Database\Database;



class StockManagement
{

   function calculatePrixDeVente($achat, $marge)
   {
      return  $achat + ($achat * $marge) / 100;
   }
   function addStockNumberOnInsertDefecteux($entity)
   {
      $node = \Drupal::service('entity_parser.manager')->node_parser($entity);
      $article =   $node["field_article"]["#object"];
      $nbrStock = 0;
      if (
         $article->field_quantite_stock
         && $article->field_quantite_stock->value
      ) {
         $nbrStock = $article->field_quantite_stock->value;
      }
      $article->field_quantite_stock->value = $nbrStock - $node["field_quantite"];
      $article->save();
   }
   function addStockNumberOnDeleteDefecteux($entity)
   {
      $node = \Drupal::service('entity_parser.manager')->node_parser($entity);
      $article =   $node["field_article"]["#object"];
      $nbrStock = 0;
      if (
         $article->field_quantite_stock
         && $article->field_quantite_stock->value
      ) {
         $nbrStock = $article->field_quantite_stock->value;
      }
      $article->field_quantite_stock->value = $nbrStock + $node["field_quantite"];
      $article->save();
   }
   function addStockNumberOnInsertCommande($entity)
   {
      $commande = \Drupal::service('entity_parser.manager')->node_parser($entity);
      if ($commande["field_status"] == "payed") {
         $articles = $commande["field_articles"];
         foreach ($articles as $article) {
            $para = \Drupal::service('entity_parser.manager')->paragraph_parser($article["id"]);
            $article = $para['field_article']["#object"];
            $nbrStock = 0;
            if (
               $article->field_quantite_stock
               && $article->field_quantite_stock->value
            ) {
               $nbrStock = $article->field_quantite_stock->value;
            }
            if ($article->hasField('field_quantite_stock')) {
               $article->field_quantite_stock->value = $nbrStock - $para["field_quantite"];
            }
            $article->save();
         }
      }
   }
   function decreaseStockNumberOnCancelCommande($entity)
   {
      $commande = \Drupal::service('entity_parser.manager')->node_parser($entity);
      $articles =   $commande["field_articles"];
      foreach ($articles as $article) {
         $para = \Drupal::service('entity_parser.manager')->paragraph_parser($article["id"]);
         $article = $para['field_article']["#object"];
         $nbrStock = 0;
         if (
            $article->field_quantite_stock
            && $article->field_quantite_stock->value
         ) {
            $nbrStock = $article->field_quantite_stock->value;
         }
         $article->field_quantite_stock->value = $nbrStock + $para["field_quantite"];
         $article->save();
      }
   }

   function increaseStockNumberOnFinishCommande($entity)
   {
      $commande = \Drupal::service('entity_parser.manager')->node_parser($entity);
      $articles =   $commande["field_articles"];
      foreach ($articles as $article) {
         $para = \Drupal::service('entity_parser.manager')->paragraph_parser($article["id"]);
         $article = $para['field_article']["#object"];
         $nbrStock = 0;
         if (
            $article->field_quantite_stock
            && $article->field_quantite_stock->value
         ) {
            $nbrStock = $article->field_quantite_stock->value;
         }
         $article->field_quantite_stock->value = $nbrStock - $para["field_quantite"];
         $article->save();
      }
   }

   public function updateRapportStockStatus($entity, $status)
   {
      try {
         $rapport_storage = \Drupal::entityTypeManager()
            ->getStorage('node');

         $query = $rapport_storage->getQuery()
            ->accessCheck(FALSE)
            ->condition('type', 'rapport_article_stock')
            ->condition('field_commande_nid.target_id', $entity->id());

         $rapport_ids = $query->execute();

         if (empty($rapport_ids)) {
            return;
         }

         $rapports = $rapport_storage->loadMultiple($rapport_ids);

         foreach ($rapports as $rapport) {
            $rapport->status->value = $status === 'payed' ? 1 : 0;
            $rapport->save();
         }
      } catch (\Exception $e) {
         \Drupal::logger('stock_management')->error('Error updating rapport stock status: ' . $e->getMessage());
      }
   }

   function updateStockNumberOnDeleteStock($entity)
   {
      $article = $entity->field_article->entity;
      $nombre_par_unite = $article->field_nombre_par_unite->value;
      $stock_par_unite = $entity->field_quantite->value * $nombre_par_unite;
      $nbrStock = 0;
      if (
         $article->field_quantite_stock
         && $article->field_quantite_stock->value
      ) {
         $nbrStock = $article->field_quantite_stock->value;
      }
      $article->field_quantite_stock->value = $nbrStock - $stock_par_unite;
      return $article->save();
   }
   function executeStockInsert($entity)
   {
      $article = $entity->field_article->entity;

      // stock update
      $nbrStock = 0;
      if (
         $article->field_quantite_stock
         && $article->field_quantite_stock->value
      ) {
         $nbrStock = $article->field_quantite_stock->value;
      }
      $nombre_par_unite = $article->field_nombre_par_unite->value;
      $qte_stock_par_boite  = $entity->field_quantite->value;

      $qte_stock_par_unite = floatval($qte_stock_par_boite) * $nombre_par_unite;;
      $article->field_quantite_stock->value = $nbrStock +  $qte_stock_par_unite;

      // prix achat par pieces

      $achat_but = $entity->field_prix_achat_brut->value;

      $achat =  (floatval($achat_but) / $qte_stock_par_boite) / $nombre_par_unite;
      $marge = $article->field_marge->value;
      $entity->field_prix_d_achat->value =  $achat;
      $entity->field_quantite_unitaire->value =   $qte_stock_par_unite;
      // prix vente
      $pv  =  $this->calculatePrixDeVente($achat, $marge);

      // update article

      $article->field_prix_d_achat->value =  $achat;
      $prix_v_actuelle = $article->field_prix_unitaire->value;
      if ($prix_v_actuelle < $pv) {
         \Drupal::messenger()->addMessage('Prix de vente actuelle : ' . $prix_v_actuelle . ' AR est plus petit que prix de votre stock ' . $pv . ' AR', 'warning');
      }
      // $article->field_prix_unitaire->value = $pv ;
      $entity->field_prix_unitaire->value = $pv;
      $article->save();
      return  $entity;
   }
   function executeComputedBenefice($entity)
   {
      //   $achat = $entity->field_prix_d_achat->value;
      //   $article = $entity->field_article->entity;
      //   $marge = $article->field_marge->value ;
      //   $pv  =   $this->calculatePrixDeVente($achat , $marge)  ;
      //   return $pv - $achat ; 
      return false;
   }
   function countArticleRuptureDeStock($start, $limit)
   {
      return   \Drupal::entityQuery('node')
         ->condition('type', 'article')
         ->condition('status', 1)
         ->condition('field_quantite_stock', $start, '>=')
         ->condition('field_quantite_stock', $limit, '<')
         ->accessCheck(TRUE)
         ->count()
         ->execute();
   }
   function countArticleExpirant($days)
   {
      $limit_date = (new \DateTime('+' . $days . ' days'))->format('Y-m-d');
      $count = \Drupal::entityQuery('node')
         ->condition('type', 'stock')
         ->condition('status', 1)
         ->condition('field_peremption', $limit_date, '<=')
         ->accessCheck(TRUE)
         ->count()
         ->execute();
   }
   function totalArticleStock()
   {
      $connection = Database::getConnection();

      $query = $connection->select('node__field_quantite_stock', 'qs');
      $query->join('node__field_prix_unitaire', 'pu', 'qs.entity_id = pu.entity_id');
      $query->join('node_field_data', 'n', 'n.nid = qs.entity_id');

      $query->condition('n.type', 'article');
      $query->condition('n.status', 1);

      // SUM(quantity * price)
      $query->addExpression(
         'SUM(qs.field_quantite_stock_value * pu.field_prix_unitaire_value)',
         'total_stock_price'
      );

      $total = $query->execute()->fetchField();

      $total = $total ?? 0;
      return $total;
   }

   function updateArticleQuantityOnInsertStock($entity)
   {
      // Parser comme dans les autres méthodes
      $stock = \Drupal::service('entity_parser.manager')->node_parser($entity);

      // Vérifier la référence article
      if (
         empty($stock['field_article']) ||
         empty($stock['field_article']['#object'])
      ) {
         return;
      }

      $article = $stock['field_article']['#object'];

      // Quantité saisie dans le stock
      if (empty($stock['field_quantite_unitaire'])) {
         return;
      }

      $stock_quantity = (int) $stock['field_quantite_unitaire'];
      if ($stock_quantity <= 0) {
         return;
      }

      // Quantité actuelle article
      $current_quantity = 0;
      if (
         isset($article->field_quantite_stock) &&
         isset($article->field_quantite_stock->value)
      ) {
         $current_quantity = (int) $article->field_quantite_stock->value;
      }

      // Nouvelle quantité = ancien + nouveau
      $new_quantity = $current_quantity + $stock_quantity;

      // Mise à jour quantité article
      $article->field_total_entree->value = $article->field_total_entree->value + $stock_quantity;
      $article->field_quantite_stock->value = $new_quantity;

      // Mise à jour prix de vente depuis le stock
      if (!empty($stock['field_prix_unitaire'])) {
         $article->field_prix_unitaire->value = (float) $stock['field_prix_unitaire'];
      }

      $article->save();
   }

   function updateArticleQuantityOnInsertRetourArticle($entity)
   {
      // Utiliser une transaction pour éviter les erreurs de coordination
      $transaction = \Drupal::database()->startTransaction();

      try {
         // Parser comme dans les autres méthodes
         $retour = \Drupal::service('entity_parser.manager')->node_parser($entity);

         // Vérifier la référence article
         if (
            empty($retour['field_article']) ||
            empty($retour['field_article']['#object'])
         ) {
            $transaction->rollBack();
            \Drupal::logger('stock_management')->error('Retour article: Article reference is missing');
            return;
         }

         $article = $retour['field_article']['#object'];

         // Quantité saisie dans le retour
         if (empty($retour['field_quantite'])) {
            $transaction->rollBack();
            \Drupal::logger('stock_management')->error('Retour article: Quantity is missing');
            return;
         }

         $retour_quantity = (int) $retour['field_quantite'];
         if ($retour_quantity <= 0) {
            $transaction->rollBack();
            \Drupal::logger('stock_management')->error('Retour article: Quantity must be greater than 0');
            return;
         }

         // Recharger l'article pour avoir les valeurs à jour
         $article = \Drupal\node\Entity\Node::load($article->id());
         if (!$article) {
            $transaction->rollBack();
            \Drupal::logger('stock_management')->error('Retour article: Failed to reload article');
            return;
         }

         // Quantité actuelle article
         $current_quantity = 0;
         if (
            isset($article->field_quantite_stock) &&
            isset($article->field_quantite_stock->value)
         ) {
            $current_quantity = (int) $article->field_quantite_stock->value;
         }

         // Total entrée actuel
         $current_total_entree = 0;
         // if (
         //    isset($article->field_total_entree) &&
         //    isset($article->field_total_entree->value)
         // ) {
         //    $current_total_entree = (int) $article->field_total_entree->value;
         // }

         // Nouvelle quantité = ancien + quantité retournée
         $new_quantity = $current_quantity + $retour_quantity;
         // $new_total_entree = $current_total_entree + $retour_quantity;

         // Mise à jour quantité article
         $article->field_quantite_stock->value = $new_quantity;
         // $article->field_total_entree->value = $new_total_entree;

         // Sauvegarder l'article
         $article->save();

         // Valider la transaction
         unset($transaction);

         \Drupal::logger('stock_management')->info('Retour article: Successfully updated article @article_id with quantity @quantity', [
            '@article_id' => $article->id(),
            '@quantity' => $retour_quantity
         ]);

      } catch (\Exception $e) {
         if (isset($transaction)) {
            $transaction->rollBack();
         }
         \Drupal::logger('stock_management')->error('Retour article: Error updating article quantity - ' . $e->getMessage());
         throw $e;
      }
   }
}
