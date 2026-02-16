<?php

namespace Drupal\mz_visitor\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\user\Entity\Role;

/**
 * Configure MZ Visitor settings for this site.
 */
class VisitorConfigForm extends ConfigFormBase
{

    /**
     * {@inheritdoc}
     */
    public function getFormId()
    {
        return 'mz_visitor_settings';
    }

    /**
     * {@inheritdoc}
     */
    protected function getEditableConfigNames()
    {
        return ['mz_visitor.settings'];
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(array $form, FormStateInterface $form_state)
    {
        $config = $this->config('mz_visitor.settings');

        // Get available roles (excluding anonymous and authenticated).
        $roles = Role::loadMultiple();
        $role_options = [];
        foreach ($roles as $role) {
            if (!in_array($role->id(), ['anonymous', 'authenticated'])) {
                $role_options[$role->id()] = $role->label();
            }
        }

        $form['default_role'] = [
            '#type' => 'select',
            '#title' => $this->t('Default Role'),
            '#options' => $role_options,
            '#default_value' => $config->get('default_role'),
            '#description' => $this->t('The role to assign to new visitor users.'),
            '#required' => TRUE,
        ];

        $form['expiration_duration'] = [
            '#type' => 'number',
            '#title' => $this->t('Expiration Duration (Days)'),
            '#default_value' => $config->get('expiration_duration') ?: 7,
            '#description' => $this->t('Number of days after which the visitor account will expire.'),
            '#min' => 1,
            '#required' => TRUE,
        ];

        return parent::buildForm($form, $form_state);
    }

    /**
     * {@inheritdoc}
     */
    public function submitForm(array &$form, FormStateInterface $form_state)
    {
        $this->config('mz_visitor.settings')
            ->set('default_role', $form_state->getValue('default_role'))
            ->set('expiration_duration', $form_state->getValue('expiration_duration'))
            ->save();

        parent::submitForm($form, $form_state);
    }

}
