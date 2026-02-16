<?php

namespace Drupal\mz_visitor\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\user\Entity\User;
use Drupal\Core\Datetime\DrupalDateTime;

/**
 * Form to create a visitor user.
 */
class CreateVisitorForm extends FormBase
{

    /**
     * {@inheritdoc}
     */
    public function getFormId()
    {
        return 'mz_visitor_create_form';
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(array $form, FormStateInterface $form_state)
    {
        $form['username'] = [
            '#type' => 'textfield',
            '#title' => $this->t('Username'),
            '#required' => TRUE,
        ];

        $form['email'] = [
            '#type' => 'email',
            '#title' => $this->t('Email'),
            '#required' => TRUE,
        ];

        $form['password'] = [
            '#type' => 'password',
            '#title' => $this->t('Password'),
            '#required' => TRUE,
        ];

        $form['actions']['submit'] = [
            '#type' => 'submit',
            '#value' => $this->t('Create Visitor'),
            '#button_type' => 'primary',
        ];

        return $form;
    }

    /**
     * {@inheritdoc}
     */
    public function submitForm(array &$form, FormStateInterface $form_state)
    {
        $config = \Drupal::config('mz_visitor.settings');
        $default_role = $config->get('default_role');
        $duration = $config->get('expiration_duration') ?: 7;

        if (!$default_role) {
            \Drupal::messenger()->addError($this->t('Default role is not configured. Please visit the settings page.'));
            return;
        }

        $username = $form_state->getValue('username');
        $email = $form_state->getValue('email');
        $password = $form_state->getValue('password');

        // Create user.
        $user = User::create();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        $user->enforceIsNew();
        $user->activate();
        $user->addRole($default_role);

        // Calculate expiration date.
        $date = new \DateTime();
        $date->modify("+$duration days");
        $user->set('field_expiration_date', $date->format('Y-m-d'));

        $user->save();

        \Drupal::messenger()->addStatus($this->t('Visitor user @user created and assigned the @role role. Expires on @date.', [
            '@user' => $username,
            '@role' => $default_role,
            '@date' => $date->format('Y-m-d'),
        ]));
    }

}
