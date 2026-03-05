<?php

namespace Drupal\mz_visitor\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\user\Entity\User;
use Drupal\Core\Url;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Public form to request visitor access.
 */
class VisitorRequestForm extends FormBase
{

    /**
     * {@inheritdoc}
     */
    public function getFormId()
    {
        return 'mz_visitor_request_form';
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(array $form, FormStateInterface $form_state)
    {
        $form['#attached']['library'][] = 'mz_visitor/visitor-request-styling';
        $form['#attached']['library'][] = 'mz_visitor/three-js-animation';
        $form['#attributes']['class'][] = 'mz-visitor-request-wrapper';

        $form['canvas'] = [
            '#markup' => '<div id="mz-visitor-canvas"></div>',
            '#weight' => -100,
        ];

        if ($credentials = $form_state->get('credentials')) {
            $form['success_message'] = [
                '#type' => 'container',
                '#attributes' => ['class' => ['messages', 'messages--status']],
                '#markup' => '<h2>' . $this->t('Accès Visiteur Accordé') . '</h2>' .
                    '<p>' . $this->t('Veuillez enregistrer ces identifiants en toute sécurité. Ils ont également été envoyés à votre adresse email.') . '</p>',
            ];

            $form['credentials_display'] = [
                '#type' => 'details',
                '#title' => $this->t('Détails de votre compte'),
                '#open' => TRUE,
            ];

            $form['credentials_display']['username'] = [
                '#type' => 'item',
                '#title' => $this->t('Nom d\'utilisateur'),
                '#markup' => '<strong>' . $credentials['username'] . '</strong>',
            ];

            $form['credentials_display']['password'] = [
                '#type' => 'item',
                '#title' => $this->t('Mot de passe'),
                '#markup' => '<code>' . $credentials['password'] . '</code>',
            ];

            $form['credentials_display']['expiration'] = [
                '#type' => 'item',
                '#title' => $this->t('Expire le'),
                '#markup' => $credentials['expiration'],
            ];

            $form['login_link'] = [
                '#type' => 'link',
                '#title' => $this->t('Aller à la page de connexion'),
                '#url' => Url::fromRoute('user.login'),
                '#attributes' => [
                    'class' => ['button', 'button--primary'],
                    'target' => '_blank',
                ],
            ];

            return $form;
        }

        $form['title'] = [
            '#markup' => '<h2 class="form-title">' . $this->t('Accès Visiteur') . '</h2>',
        ];

        $form['email'] = [
            '#type' => 'email',
            '#title' => $this->t('Votre Email'),
            '#description' => $this->t('Les identifiants seront envoyés à cette adresse email.'),
            '#required' => TRUE,
        ];

        $form['actions']['submit'] = [
            '#type' => 'submit',
            '#value' => $this->t('Demander l\'accès'),
            '#button_type' => 'primary',
        ];

        return $form;
    }

    /**
     * {@inheritdoc}
     */
    public function validateForm(array &$form, FormStateInterface $form_state)
    {
        if ($form_state->get('credentials')) {
            return;
        }
        $email = $form_state->getValue('email');
        if (user_load_by_mail($email)) {
            $form_state->setErrorByName('email', $this->t('Cet email est déjà enregistré.'));
        }
    }

    /**
     * {@inheritdoc}
     */
    public function submitForm(array &$form, FormStateInterface $form_state)
    {
        $config = \Drupal::config('mz_visitor.settings');
        $default_role = $config->get('default_role');
        $duration = $config->get('expiration_duration') ?: 1;

        if (!$default_role) {
            \Drupal::messenger()->addError($this->t('Le système n\'est pas correctement configuré. Veuillez contacter l\'administrateur.'));
            return;
        }

        $email = $form_state->getValue('email');

        // Generate random username and password.
        $username = 'visiteur_' . user_password(6);
        $password = user_password(10);

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
        $expiration_str = $date->format('Y-m-d');
        $user->set('field_expiration_date', $expiration_str);

        $user->save();

        // Store credentials for display and rebuild.
        $form_state->set('credentials', [
            'username' => $username,
            'password' => $password,
            'expiration' => $expiration_str,
        ]);
        $form_state->setRebuild(TRUE);

        // Send email.
        $mailManager = \Drupal::service('plugin.manager.mail');
        $module = 'mz_visitor';
        $key = 'visitor_credentials';
        $to = $email;
        $params = [
            'username' => $username,
            'password' => $password,
            'expiration' => $expiration_str,
            'url' => Url::fromRoute('user.login', [], ['absolute' => TRUE])->toString(),
        ];
        $langcode = 'fr'; // Force French for email.
        $send = TRUE;

        $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);

        if ($result['result'] !== TRUE) {
            \Drupal::messenger()->addError($this->t('Un compte a été créé mais un problème est survenu lors de l\'envoi de l\'email. Ils sont affichés ci-dessous.'));
        }
    }
}
