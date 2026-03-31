<?php

namespace Drupal\simple_json_api\Controller;

use Drupal;
use Drupal\Component\Utility\Xss;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Cache\CacheableJsonResponse;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Datetime\DateFormatterInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Render\RendererInterface;
use Drupal\simple_json_api\ApiJsonParser;
use Drupal\user\Entity\User;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;


/**
 * Class CcmsContentController.
 *
 * @package Drupal\ccms_core\Controller
 */
class JsonContentController extends ControllerBase implements ContainerInjectionInterface
{

    /**
     * The date formatter service.
     *
     * @var \Drupal\Core\Datetime\DateFormatterInterface
     */
    protected $dateFormatter;

    /**
     * The renderer service.
     *
     * @var \Drupal\Core\Render\RendererInterface
     */
    protected $renderer;

    /**
     * The API JSON parser service.
     *
     * @var \Drupal\simple_json_api\ApiJsonParser
     */
    protected $apiJsonParser;

    /**
     * Constructs a NodeController object.
     *
     * @param \Drupal\Core\Datetime\DateFormatterInterface $date_formatter
     *   The date formatter service.
     * @param \Drupal\Core\Render\RendererInterface $renderer
     *   The renderer service.
     */
    public function __construct(DateFormatterInterface $date_formatter, RendererInterface $renderer)
    {
        $this->dateFormatter = $date_formatter;
        $this->renderer = $renderer;
        $this->apiJsonParser = new ApiJsonParser();
    }

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container)
    {
        return new static(
            $container->get('date.formatter'),
            $container->get('renderer')
        );
    }

    public function uploader()
    {
        $json = [
            'status' => false
        ];
        $uri = 'public://';
        $stream_wrapper_manager = \Drupal::service('stream_wrapper_manager')->getViaUri($uri);
        $file_path = $stream_wrapper_manager->realpath();

        foreach ($_FILES as $fileItem) {

            $status = move_uploaded_file($fileItem['tmp_name'], $file_path . "/" . $fileItem['name']);
            if ($status) {
                $name = basename($fileItem['name']);
                $url = file_create_url($uri . "/" . $fileItem['name']);
                $fields = [
                    'name' => $name,
                    'field_media_image' => $url
                ];
                $image = \Drupal::service('crud')->save('media', 'image', $fields);
                if (is_object($image)) {
                    $json = [
                        'id' => $image->id(),
                        'status' => true
                    ];
                } else {
                    $json = [
                        'status' => false
                    ];
                }
                unlink($file_path . "/" . $fileItem['name']);
            }
        }
        if (isset($_GET['destination'])) {
            $base_url = \Drupal::request()->getSchemeAndHttpHost();
            $url = $base_url . $_GET['destination'] . '?fid=';
            header("Location:" . $url);
            exit();
        }
        return new JsonResponse($json);
    }

    public function apiListJson()
    {

        $bundle = \Drupal::request()->get('bundle');
        $entitype = \Drupal::request()->get('entitype');
        $pager = \Drupal::request()->get('pager');
        $offset = \Drupal::request()->get('offset');
        $view = \Drupal::request()->get('view');
        $cat = \Drupal::request()->get('cat');
        $fields = \Drupal::request()->get('fields');
        if ($cat) {
            $entity = \Drupal::service('drupal.helper')->helper->getEntityByAlias($cat);
            if (is_object($entity)) {
                $id = $entity->id();
                $children = \Drupal::service('drupal.helper')->helper->taxonomy_get_children($id);
            } else {
                $children = [-1];
            }
        }
        if ($bundle && $entitype) {
            if ($offset == null) {
                $offset = 10;
            }
            $key_bundle = \Drupal::entityTypeManager()->getDefinition($entitype)->getKey('bundle');
            $query = \Drupal::entityQuery($entitype)->condition($key_bundle, $bundle);

            if ($entitype == 'node') {
                $query->sort('promote', 'DESC');
                $query->sort('nid', 'DESC');
                $query->condition('status', '1');
            }
            if ($cat && $children) {
                $query->condition('field_catalogue', $children, 'IN');
            }
            if ($pager) {
                $query->range($offset * ($pager - 1), $offset);
            } else {
                $query->range(0, $offset);
            }
            $json = $query->execute();
        } else {
            $json = ['empty parameter /api/v1/list?bundle=article&entitype=node'];
        }


        if ($view == 'full') {
            $results = [];
            foreach ($json as $key => $id) {
                $results[] = \Drupal::service('entity_parser.manager')->loader_entity_by_type($id, $entitype);
            }
            return $this->responseCacheableJson($results);
        }
        if (is_array($fields)) {
            $results = [];
            foreach ($json as $key => $id) {
                $fields_array = $fields;
                $results[] = \Drupal::service('entity_parser.manager')->loader_entity_by_type($id, $entitype, $fields_array, $options);
            }
            return $this->responseCacheableJson($results);
        }
        if (is_string($fields)) {
            $results = [];
            foreach ($json as $key => $id) {
                $fields_array[] = $fields;
                $results[] = \Drupal::service('entity_parser.manager')->loader_entity_by_type($id, $entitype, $fields_array, $options);
            }
            return $this->responseCacheableJson($results);
        }
        if (is_string($fields)) {
            $results = [];
            foreach ($json as $key => $id) {
                $fields_array[] = $fields;
                $results[] = \Drupal::service('entity_parser.manager')->loader_entity_by_type($id, $entitype, $fields_array, $options);
            }
            return $this->responseCacheableJson($results);
        }
        return $this->responseCacheableJson(array_values($json));
    }

    public function apiTerm($vid)
    {
        $parser_node_json = new ApiJsonParser();
        $data = \Drupal::request()->query->all();
        $results = $parser_node_json->taxonomy_load_multi_by_vid($vid, $data);
        return new JsonResponse($results);
    }


    protected function responseCacheableJson($data)
    {
        // Add Cache settings for Max-age and URL context.
        // You can use any of Drupal's contexts, tags, and time.

        $config = $this->config('system.performance');
        $build = [
            '#cache' => [
                // The max-age use system settings.
                'max-age' => $config->get('cache.page.max_age'),
                'contexts' => [
                    'url',
                ],
            ]
        ];

        $response = new CacheableJsonResponse($data);
        $response->addCacheableDependency(CacheableMetadata::createFromRenderArray($build));
        return $response;
    }

    public function apiMenu()
    {
        $menu = \Drupal::service('simplify_menu.menu_items')->getMenuTree();
        return $this->responseCacheableJson($menu['menu_tree']);
    }

    public function apiMenuChildren($name)
    {

        // $menu = \Drupal::service('simplify_menu.menu_items')->getMenuTree();
        //  return new JsonResponse($menu['menu_tree']);


    }

    public function sendResetEmail()
    {
        $method = \Drupal::request()->getMethod();
        $json['status'] = false;

        if ($method == "POST") {
            $content = \Drupal::request()->getContent();
            $data = json_decode($content, TRUE);    // Check if email is provided.
            if (empty($data['email'])) {
                return new JsonResponse(['status' => 'error', 'message' => 'Email is required.'], 400);
            }

            $email = $data['email'];

            // Load the user by email.
            $users = \Drupal::entityTypeManager()->getStorage('user')->loadByProperties(['mail' => $email]);
            $user = reset($users);

            // If user does not exist.
            if (!$user) {
                return new JsonResponse(['status' => 'error', 'message' => 'User with this email does not exist.']);
            }

            // Generate a one-time login URL.
            $login_url = user_pass_reset_url($user);

            // Send the password reset email.


            $email = $user->getEmail();
            $subject = "Vous avez demandé une réinitialisation de mot de passe. Utilisez le lien ci-dessous pour réinitialiser votre mot de passe.<br/><a href='" . $login_url . "'>" . $login_url . "</a>";
            $body = 'Password Reset Request';
            // Send the email.
            $service = \Drupal::service("mz_email.default");
            $status = $service->sendMail($email, $body, $subject);
            if ($status === true) {
                return new JsonResponse([
                    'status' => 'success',
                    'message' => 'Password reset email sent successfully.'
                ]);
            } else {
                return new JsonResponse([
                    'status' => 'error',
                    'message' => 'Failed to send password reset email.'
                ]);
            }
        }
        return new JsonResponse([
            'status' => 'error',
            'message' => 'Failed to send password reset email.'
        ], 500);
    }


    /**
     * Custom access function for protected API routes.
     *
     * @return \Drupal\Core\Access\AccessResult
     */
    public function apiJsonAccess()
    {
        // Initialiser ApiJsonParser si nécessaire
        if (!isset($this->apiJsonParser)) {
            $this->apiJsonParser = new ApiJsonParser();
        }

        // Récupérer la requête courante
        $request = \Drupal::request();

        // Vérifier si c'est une requête API (vérifier le chemin ou le format)
        $is_api_request = strpos($request->getPathInfo(), '/api/') === 0;

        $user = $this->apiJsonParser->authenticate($request);

        if ($user) {
            return AccessResult::allowed();
        }

        // Pour les requêtes API, retourner un accès interdit sans redirection
        if ($is_api_request) {
            // Utiliser AccessResult::forbidden() pour éviter la redirection
            return AccessResult::forbidden('Authentication required')->setCacheMaxAge(0);
        }

        // Pour les requêtes normales, laisser Drupal gérer
        return AccessResult::forbidden();
    }


    public function apiUserList()
    {

        // Simple legacy list, kept for backward compatibility.
        // This method does not support filtering or fields; clients
        // should use apiUserListV2 instead if they need more control.
        $page = 2;
        $limit = 10;
        $offset = ($page - 1) * $limit;

        $query = \Drupal::entityTypeManager()
            ->getStorage('user')
            ->getQuery()
            ->condition('status', 1) // Only active users
            ->condition('uid', 0, '<>'); // Exclude anonymous
        $query->range($offset, $limit);

        // Note: $filters was undefined in the original implementation, so
        // it produced a PHP notice.  We intentionally do not attempt to
        // add filtering here to preserve original behavior.
        $uids = $query->execute();

        $results = [];
        $users = \Drupal::entityTypeManager()->getStorage('user')->loadMultiple($uids);
        foreach ($users as $user) {
            $results[] = \Drupal::service('entity_parser.manager')->user_parser($user->id());
        }

        $ouput = ["rows" => $results, "total" =>  sizeof($results)];
        return new JsonResponse($ouput);
    }

    /**
     * Enhanced user listing with support for filters, field selection,
     * sorting, paging, value extraction and field renaming.  Mirrors the
     * behaviour of apiListJsonV2 but constrained to user entities.
     */
    public function apiUserListV2(Request $request)
    {
        $fields = $request->get('fields');
        $changes = $request->get('changes');
        $values = $request->get('values');
        $filters = $request->get('filters');
        $sort = $request->get('sort');
        $pager = $request->get('pager');
        $offset = $request->get('offset');

        if ($offset === null) {
            $offset = 10;
        }

        $query = \Drupal::entityQuery('user');
        $query->condition('uid', 0, '<>');

        // Apply generic filters if provided.
        if (is_array($filters)) {
            foreach ($filters as $key => $filter) {
                if (isset($filter['op']) && $filter['op'] !== null) {
                    $query->condition($key, $filter['val'], $filter['op']);
                } else {
                    if (is_array($filter['val'])) {
                        $query->condition($key, $filter['val'], 'IN');
                    } else {
                        $query->condition($key, $filter['val']);
                    }
                }
            }
        }

        // Clone the query to compute total without altering the original.
        $count_query = clone $query;
        $total = $count_query->count()->execute();

        if ($sort && isset($sort['val'], $sort['op'])) {
            $query->sort($sort['val'], $sort['op']);
        }

        if ($pager) {
            if ($pager !== 'all') {
                $query->range($offset * ($pager), $offset);
            }
        } else {
            $query->range(0, $offset);
        }

        $uids = $query->execute();
        if (!is_array($uids)) {
            $uids = [];
        }

        $results = [];
        $users = \Drupal::entityTypeManager()->getStorage('user')->loadMultiple($uids);

        foreach ($users as $user) {
            if (is_array($fields)) {
                $results[] = \Drupal::service('entity_parser.manager')->user_parser($user, $fields);
            } else {
                $results[] = \Drupal::service('entity_parser.manager')->user_parser($user);
            }
        }

        // Post-process values and changes exactly like apiListJsonV2
        if ($values) {
            foreach ($results as $rkey => $item) {
                foreach ($item as $key_field => $value_field) {
                    if (isset($values[$key_field])) {
                        $val = $this->getValueArray($item, $key_field);
                        $results[$rkey][$key_field] = $val;
                    }
                }
            }
        }

        if ($changes) {
            foreach ($results as $rkey => $item) {
                foreach ($item as $key_field => $value_field) {
                    if (isset($changes[$key_field])) {
                        $results[$rkey][$changes[$key_field]] = $value_field;
                        unset($results[$rkey][$key_field]);
                    }
                }
            }
        }

        $ouput = ['rows' => $results, 'total' => $total];
        return new JsonResponse($ouput);
    }


    /**
     * API List V2 avec authentification.
     */
    public function apiListJsonV2(Request $request, $entitype, $bundle)
    {
        // Vérifier l'authentification
        $user = $this->apiJsonParser->authenticate($request);

        if (!$user) {
            return $this->apiJsonParser->unauthorizedResponse();
        }

        $fields = $request->get('fields');
        $changes = $request->get('changes');
        $values = $request->get('values');

        // Utiliser la méthode modifiée avec le paramètre Request
        $jsons = $this->apiJsonParser->listQueryExecute($entitype, $bundle, $request);
        $results = [];
        $options = [];
        $json = $jsons["rows"];

        foreach ($json as $key => $id) {
            if (is_array($fields)) {
                $results[] = \Drupal::service('entity_parser.manager')->loader_entity_by_type($id, $entitype, $fields, $options);
            } else {
                $results[] = \Drupal::service('entity_parser.manager')->loader_entity_by_type($id, $entitype);
            }
        }

        if ($values) {
            foreach ($results as $rkey => $item) {
                foreach ($item as $key_field => $value_field) {
                    if (isset($values[$key_field])) {
                        $val = $this->getValueArray($item, $key_field);
                        $results[$rkey][$key_field] = $val;
                    }
                }
            }
        }

        if ($changes) {
            foreach ($results as $key => $item) {
                foreach ($item as $key_field => $value_field) {
                    if (isset($changes[$key_field])) {
                        $results[$key][$changes[$key_field]] = $value_field;
                        unset($results[$key][$key_field]);
                    }
                }
            }
        }

        $output = ["rows" => $results, "total" => $jsons["total"]];
        return new JsonResponse($output);
    }

    /**
     * Récupère les valeurs des champs imbriqués
     *
     * @param array $item
     * @param string $key_field
     * @return array
     */
    private function getValueArray($item, $key_field)
    {
        $output = [];

        // Vérifier si le champ existe dans l'élément
        if (!isset($item[$key_field])) {
            return $output;
        }

        $field_value = $item[$key_field];

        // Si le champ est vide
        if (empty($field_value)) {
            return $output;
        }

        // Cas 1: C'est une référence simple avec l'objet dans #object
        if (is_array($field_value) && isset($field_value["#object"])) {
            $output = $this->getValue($field_value["#object"], $key_field);
        }
        // Cas 2: C'est un tableau de références multiples
        elseif (is_array($field_value)) {
            foreach ($field_value as $value_child) {
                if (is_array($value_child) && isset($value_child["#object"])) {
                    $output[] = $this->getValue($value_child["#object"], $key_field);
                } elseif (is_object($value_child)) {
                    // Si c'est directement un objet
                    $output[] = $this->getValue($value_child, $key_field);
                } elseif (is_array($value_child) && isset($value_child['target_id'])) {
                    // Cas pour les références d'entités standard
                    $entity = \Drupal::entityTypeManager()->getStorage('node')->load($value_child['target_id']);
                    if ($entity) {
                        $output[] = $this->getValue($entity, $key_field);
                    }
                }
            }
        }
        // Cas 3: C'est directement un objet
        elseif (is_object($field_value)) {
            $output = $this->getValue($field_value, $key_field);
        }
        // Cas 4: C'est un tableau avec target_id (référence standard)
        elseif (is_array($field_value) && isset($field_value['target_id'])) {
            $entity = \Drupal::entityTypeManager()->getStorage('node')->load($field_value['target_id']);
            if ($entity) {
                $output = $this->getValue($entity, $key_field);
            }
        }

        return $output;
    }

    /**
     * Extrait les valeurs d'une entité pour un champ spécifique
     *
     * @param object $item_object
     * @param string $field
     * @return array
     */
    private function getValue($item_object, $field)
    {
        $output = [];
        $values = \Drupal::request()->get('values');

        // Vérifier si le champ parent existe dans values
        if (!isset($values[$field]) || !is_array($values[$field])) {
            return $output;
        }

        // Récupérer les champs demandés pour cette entité
        $requested_fields = $values[$field];

        // Parser l'entité pour obtenir tous ses champs
        $entity_array = \Drupal::service('entity_parser.manager')->parser($item_object);

        // Filtrer uniquement les champs demandés
        foreach ($entity_array as $field_child => $value_child) {
            if (in_array($field_child, $requested_fields)) {
                $output[$field_child] = $value_child;
            }
        }

        return $output;
    }

    /**
     * API Details V2 avec authentification.
     */
    public function apiDetailsJsonV2(Request $request, $entitype, $bundle, $id)
    {
        // Vérifier l'authentification
        $user = $this->apiJsonParser->authenticate($request);

        if (!$user) {
            return $this->apiJsonParser->unauthorizedResponse();
        }

        $fields = $request->get('fields');
        $changes = $request->get('changes');
        $values = $request->get('values');
        $options = [];

        if (is_array($fields)) {
            $item = \Drupal::service('entity_parser.manager')->loader_entity_by_type($id, $entitype, $fields, $options);
        } else {
            $item = \Drupal::service('entity_parser.manager')->loader_entity_by_type($id, $entitype);
        }

        // Traitement des valeurs imbriquées
        if ($values) {
            foreach ($item as $key_field => $value_field) {
                if (isset($values[$key_field])) {
                    $val = $this->getValueArray($item, $key_field);
                    $item[$key_field] = $val;
                }
            }
        }

        // Traitement des changements de noms de champs
        if ($changes) {
            foreach ($item as $key_field => $value_field) {
                if (isset($changes[$key_field])) {
                    $item[$changes[$key_field]] = $value_field;
                    unset($item[$key_field]);
                }
            }
        }

        return new JsonResponse($item);
    }
}
