<?php

namespace Drupal\mz_crud\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\drupal_helper\DrupalHelper;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class ApiController.
 */
class ApiController extends ControllerBase
{

    /**
     * Paragraph_delete.
     *
     * @return string
     *   Return Hello string.
     */
    public function save()
    {
        $json = [];
        $method = \Drupal::request()->getMethod();
        $id = null;
        if ($method == "POST") {
            $content = \Drupal::request()->getContent();

            if (!empty($content)) {
                $content = json_decode($content, TRUE);
                $service =  \Drupal::service('api.crud');
                $token = $content["token"];
                $is_valid =  true; //$service->isTokenValid($content["author"], $token)    ; 
                if ($is_valid) {
                    $entity_type = $content["entity_type"];
                    $bundle = $content["bundle"];
                    unset($content["bundle"]);
                    unset($content["entity_type"]);
                    unset($content["token"]);
                    $elemt = \Drupal::service('crud')->save($entity_type, $bundle, $content);
                    if (is_object($elemt)) {
                        $id  = $elemt->id();
                    }
                } else {
                    $message = "Author token is not valid";
                }
            } else {
                // $message = "Data not found";
            }
        } else {
            $message = "No POST request";
        }
        $json = ($id) ? ['item' => $id, 'status' => true] : ['message' => $message, 'status' => 'error'];
        return new JsonResponse($json);
    }

    public function register()
    {
        $service =  \Drupal::service('api.crud');
        $method = \Drupal::request()->getMethod();
        $json['status'] = false;

        if ($method == "POST") {
            $content = \Drupal::request()->getContent();

            if (!empty($content)) {
                $data = json_decode($content, TRUE);
                if ($data['name'] && $data['pass']) {

                    $status = $service->isUserNameExist($data['name']);

                    if ($status) {
                        $json['name'] = $data['name'];
                        $json['error'] = 'Username exist deja';
                        $json['status'] = false;
                    } else {
                        $json['name'] = $data['name'];
                        $user = User::create();
                        $user->setPassword($data['pass']);
                        $user->enforceIsNew();
                        $user->setEmail("email@yahoo.fr");
                        $user->setUsername($data['name']); //This username must be unique and accept only a-Z,0-9, - _ @ .
                        //   $user->addRole('authenticated'); //E.g: authenticated
                        $json['status'] = $user->save();
                        $json['token'] = $service->generateToken($user);
                        $json['id'] = $user->id();
                    }
                }
            }
        }
        return new JsonResponse($json);
    }

    public function login()
    {

        $method = \Drupal::request()->getMethod();
        $json['status'] = false;
        if ($method == "POST") {
            $content = \Drupal::request()->getContent();
            if (!empty($content)) {
                $data = json_decode($content, TRUE);
                $json['name'] = $data['name'];
                $user = user_load_by_name($data['name']);
                if (is_object($user)) {
                    $hashed_password = $user->getPassword();
                    $password_hasher = \Drupal::service('password');
                    $password = $data['password'];
                    $json['mail'] = $user->getEmail();
                    $json['token'] = \Drupal\Component\Utility\Crypt::hashBase64($hashed_password);
                    $json['status'] = ($password_hasher->check($password, $hashed_password));
                    $json['roles'] = $user->getRoles();
                    $json['id'] = $user->id();
                }
            }
        }

        return new JsonResponse($json);
    }

    public function createUser()
    {
        $method = \Drupal::request()->getMethod();
        $json = ['status' => false];

        if ($method == "POST") {
            $content = \Drupal::request()->getContent();

            if (!empty($content)) {
                $data = json_decode($content, TRUE);

                if (!empty($data['name']) && !empty($data['pass'])) {

                    $service = \Drupal::service('api.crud');
                    $exist = $service->isUserNameExist($data['name']);

                    if ($exist) {
                        $json['status'] = false;
                        $json['error'] = 'Username existe déjà';
                    } else {

                        $user = User::create([
                            'name' => $data['name'],
                            'mail' => $data['mail'] ?? '',
                            'status' => 1
                        ]);

                        $user->setPassword($data['pass']);

                        // Ajouter plusieurs roles
                        if (!empty($data['roles']) && is_array($data['roles'])) {
                            foreach ($data['roles'] as $role) {
                                $user->addRole($role);
                            }
                        }

                        $user->save();

                        // Retourner les données utilisateur
                        $json = [
                            'status' => true,
                            'user' => [
                                'id' => $user->id(),
                                'name' => $user->getAccountName(),
                                'mail' => $user->getEmail(),
                                'roles' => $user->getRoles(),
                                'created' => $user->getCreatedTime(),
                            ]
                        ];
                    }
                }
            }
        }

        return new JsonResponse($json);
    }

    public function user_edit()
    {
        // allow editing by uid and update core properties and roles/password/status
        $service =  \Drupal::service('api.crud');
        $method = \Drupal::request()->getMethod();
        $json = ['status' => false];

        if ($method === "POST") {
            $content = \Drupal::request()->getContent();
            if (!empty($content)) {
                $data = json_decode($content, TRUE);

                // require uid to identify the user
                if (!empty($data['uid'])) {
                    $user = User::load($data['uid']);
                    if (is_object($user)) {
                        // optional: check for name change and uniqueness
                        if (!empty($data['name']) && $data['name'] !== $user->getAccountName()) {
                            if ($service->isUserNameExist($data['name'])) {
                                $json['error'] = 'Le nom d\'utilisateur est déjà pris';
                                return new JsonResponse($json);
                            }
                            $user->setUsername($data['name']);
                        }

                        if (isset($data['mail'])) {
                            $user->setEmail($data['mail']);
                        }
                        if (isset($data['pass']) && $data['pass'] !== '') {
                            $user->setPassword($data['pass']);
                        }
                        if (isset($data['status'])) {
                            // accept 1/0 or true/false
                            $user->set('status', $data['status'] ? 1 : 0);
                        }
                        if (!empty($data['roles']) && is_array($data['roles'])) {
                            // set roles property directly; authenticated role stays automatically
                            $user->set('roles', $data['roles']);
                        }

                        $saved = $user->save();
                        $json['status'] = (bool) $saved;
                        $json['id'] = $user->id();
                        $json['user'] = [
                            'uid' => $user->id(),
                            'name' => $user->getAccountName(),
                            'mail' => $user->getEmail(),
                            'roles' => $user->getRoles(),
                            'status' => $user->isActive(),
                        ];
                    } else {
                        $json['error'] = 'Utilisateur introuvable';
                    }
                } else {
                    $json['error'] = 'UID manquant';
                }
            }
        }

        return new JsonResponse($json);
    }
}
