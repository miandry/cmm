<?php

namespace Drupal\bird_mail\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Site\Settings;

/**
 * Configuration form for the Bird Mail module.
 */
class BirdMailSettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['bird_mail.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'bird_mail_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('bird_mail.settings');

    if (Settings::get('bird_mail_api_key')) {
      $form['api_key_notice'] = [
        '#type' => 'markup',
        '#markup' => '<div class="messages messages--status">' .
        $this->t('An API key is currently set via $settings[\'bird_mail_api_key\'] in settings.php and will override the value below.') .
        '</div>',
      ];
    }

    $form['api_key'] = [
      '#type' => 'password',
      '#title' => $this->t('Bird API key'),
      '#description' => $this->t('Stored in configuration. For production, prefer setting $settings[\'bird_mail_api_key\'] in settings.php instead, so the key is not exported with config or stored in the database.'),
      '#default_value' => '',
      '#attributes' => ['placeholder' => $config->get('api_key') ? $this->t('•••••••• (unchanged)') : ''],
    ];

    $form['api_url'] = [
      '#type' => 'url',
      '#title' => $this->t('Bird API endpoint'),
      '#default_value' => $config->get('api_url') ?: 'https://eu1.platform.bird.com/v1/email/messages',
      '#required' => TRUE,
    ];

    $form['from_address'] = [
      '#type' => 'email',
      '#title' => $this->t('Default From address'),
      '#description' => $this->t('Must use a domain verified in your Bird account. For testing use onboarding@messagebird.dev'),
      '#default_value' => $config->get('from_address'),
      '#required' => TRUE,
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config('bird_mail.settings');

    // Only overwrite the stored key if a new one was actually typed in.
    $new_key = $form_state->getValue('api_key');
    if (!empty($new_key)) {
      $config->set('api_key', $new_key);
    }

    $config
      ->set('api_url', $form_state->getValue('api_url'))
      ->set('from_address', $form_state->getValue('from_address'))
      ->save();

    parent::submitForm($form, $form_state);
  }

}
