<?php

namespace Drupal\mz_clinic\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Drupal\taxonomy\TermInterface;

/**
 * Admin listing for praticien nodes.
 */
class PraticienAdminController extends ControllerBase {

  /**
   * Lists all praticien nodes.
   */
  public function listPraticiens(): array {
    $storage = $this->entityTypeManager()->getStorage('node');
    $nids = $storage->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'praticien')
      ->sort('title')
      ->execute();

    $rows = [];
    if ($nids) {
      /** @var \Drupal\node\NodeInterface[] $nodes */
      $nodes = $storage->loadMultiple($nids);
      foreach ($nodes as $node) {
        $type = '-';
        if ($node->hasField('field_type_praticien') && !$node->get('field_type_praticien')->isEmpty()) {
          $term = $node->get('field_type_praticien')->entity;
          $type = $term instanceof TermInterface ? $term->label() : '-';
        }

        $specialite = '-';
        if ($node->hasField('field_specialite') && !$node->get('field_specialite')->isEmpty()) {
          $specialite = $node->get('field_specialite')->entity?->label() ?? '-';
        }

        $actif = $node->hasField('field_actif') && !$node->get('field_actif')->isEmpty()
          ? ($node->get('field_actif')->value ? $this->t('Oui') : $this->t('Non'))
          : '-';

        $rows[] = [
          Link::fromTextAndUrl($node->label(), $node->toUrl('edit-form')),
          $type,
          $specialite,
          $actif,
          $node->isPublished() ? $this->t('Publié') : $this->t('Non publié'),
        ];
      }
    }

    $build['add_link'] = [
      '#type' => 'link',
      '#title' => $this->t('Ajouter un praticien'),
      '#url' => \Drupal\Core\Url::fromRoute('praticien.add'),
      '#attributes' => ['class' => ['button', 'button--primary']],
    ];

    $build['table'] = [
      '#type' => 'table',
      '#header' => [
        $this->t('Praticien'),
        $this->t('Type'),
        $this->t('Spécialité'),
        $this->t('Actif'),
        $this->t('Statut'),
      ],
      '#rows' => $rows,
      '#empty' => $this->t('Aucun praticien enregistré.'),
    ];

    return $build;
  }

}
