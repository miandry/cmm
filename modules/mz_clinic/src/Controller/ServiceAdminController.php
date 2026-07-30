<?php

namespace Drupal\mz_clinic\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;

/**
 * Admin listing for service nodes.
 */
class ServiceAdminController extends ControllerBase {

  /**
   * Lists all service nodes.
   */
  public function listServices(): array {
    $storage = $this->entityTypeManager()->getStorage('node');
    $nids = $storage->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'service')
      ->sort('title')
      ->execute();

    $rows = [];
    if ($nids) {
      /** @var \Drupal\node\NodeInterface[] $nodes */
      $nodes = $storage->loadMultiple($nids);
      foreach ($nodes as $node) {
        $prix = $node->hasField('field_prix') && !$node->get('field_prix')->isEmpty()
          ? number_format((float) $node->get('field_prix')->value, 0, ',', ' ') . ' Ar'
          : '-';
        $actif = $node->hasField('field_actif') && !$node->get('field_actif')->isEmpty()
          ? ($node->get('field_actif')->value ? $this->t('Oui') : $this->t('Non'))
          : '-';

        $rows[] = [
          Link::fromTextAndUrl($node->label(), $node->toUrl('edit-form')),
          $prix,
          $actif,
          $node->isPublished() ? $this->t('Publié') : $this->t('Non publié'),
        ];
      }
    }

    $build['add_link'] = [
      '#type' => 'link',
      '#title' => $this->t('Ajouter un service'),
      '#url' => \Drupal\Core\Url::fromRoute('service.add'),
      '#attributes' => ['class' => ['button', 'button--primary']],
    ];

    $build['table'] = [
      '#type' => 'table',
      '#header' => [
        $this->t('Service'),
        $this->t('Prix'),
        $this->t('Actif'),
        $this->t('Statut'),
      ],
      '#rows' => $rows,
      '#empty' => $this->t('Aucun service enregistré.'),
    ];

    return $build;
  }

}
