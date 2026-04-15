<?php

namespace Drupal\mz_crud;

use Drupal\user\Entity\User;

/**
 * Class APIService.
 */
class APIService
{
    /**
     * Vérifie si un token est valide (ancienne méthode basée sur le password).
     *
     * @param string $name
     *   Le nom d'utilisateur.
     * @param string $token
     *   Le token à vérifier.
     *
     * @return bool
     *   TRUE si valide, FALSE sinon.
     */
    public function isTokenValid($name, $token)
    {
        $user = user_load_by_name($name);
        if (!is_object($user)) {
            return false;
        }
        $hashed_password = $user->getPassword();
        $token_new = \Drupal\Component\Utility\Crypt::hashBase64($hashed_password);
        return ($token_new == $token);
    }

    /**
     * Vérifie si un nom d'utilisateur existe déjà.
     *
     * @param string $name
     *   Le nom d'utilisateur à vérifier.
     *
     * @return bool
     *   TRUE si existe, FALSE sinon.
     */
    public function isUserNameExist($name)
    {
        $query = \Drupal::entityQuery('user')
            ->condition('name', $name);
        $query->range(0, 1);
        $result = $query->execute();
        if (!empty($result)) {
            return true;
        }
        return false;
    }

    /**
     * Génère un token basé sur le password (ancienne méthode).
     *
     * @param object $user
     *   L'utilisateur.
     *
     * @return string|false
     *   Le token ou FALSE si erreur.
     */
    public function generateToken($user)
    {
        if (!is_object($user)) {
            return false;
        }
        $hashed_password = $user->getPassword();
        $token_new = \Drupal\Component\Utility\Crypt::hashBase64($hashed_password);
        return $token_new;
    }

    // =============== MÉTHODES POUR TOKEN BEARER AVEC MULTI-SESSIONS ===============

    /**
     * Génère un identifiant de session unique pour un appareil.
     *
     * @param \Drupal\user\Entity\User $user
     *   L'utilisateur.
     *
     * @return string
     *   L'identifiant de session.
     */
    private function generateSessionId($user)
    {
        $request = \Drupal::request();
        $user_agent = $request->headers->get('User-Agent', '');
        $ip = $request->getClientIp();
        $timestamp = time();

        // Créer un ID unique basé sur plusieurs facteurs
        return hash('sha256', $user->id() . $user_agent . $ip . $timestamp . uniqid('', true));
    }

    /**
     * Génère un token Bearer unique pour un utilisateur (supporte multi-sessions).
     *
     * @param \Drupal\user\Entity\User $user
     *   L'utilisateur pour lequel générer le token.
     * @param int $days
     *   Nombre de jours avant expiration (défaut: 60).
     *
     * @return string
     *   Le token généré.
     */
    public function generateBearerToken($user, $days = 60)
    {
        // Générer un token unique et sécurisé (64 caractères hexadécimaux)
        $token = bin2hex(random_bytes(32));

        // Générer un identifiant de session unique pour cet appareil
        $session_id = $this->generateSessionId($user);

        // Calculer la date d'expiration
        $expiration = time() + ($days * 24 * 60 * 60);

        // NE PAS supprimer les anciens tokens - on garde toutes les sessions actives
        // On insère simplement le nouveau token pour cette session

        // Insérer le nouveau token avec l'ID de session
        \Drupal::database()->insert('mz_crud_tokens')
            ->fields([
                'uid' => $user->id(),
                'token' => $token,
                'session_id' => $session_id,
                'user_agent' => \Drupal::request()->headers->get('User-Agent', ''),
                'ip_address' => \Drupal::request()->getClientIp(),
                'created' => time(),
                'expiration' => $expiration,
                'last_activity' => time(),
            ])
            ->execute();

        return $token;
    }

    /**
     * Valide un token Bearer et retourne l'utilisateur associé.
     *
     * @param string $token
     *   Le token à valider.
     *
     * @return \Drupal\user\Entity\User|null
     *   L'utilisateur ou null si token invalide/expiré.
     */
    public function validateBearerToken($token)
    {
        if (empty($token)) {
            return null;
        }

        $query = \Drupal::database()->select('mz_crud_tokens', 't')
            ->fields('t', ['uid', 'token', 'session_id'])
            ->condition('token', $token)
            ->condition('expiration', time(), '>')
            ->execute()
            ->fetchAssoc();

        if ($query && isset($query['uid'])) {
            // Mettre à jour la dernière activité
            \Drupal::database()->update('mz_crud_tokens')
                ->fields(['last_activity' => time()])
                ->condition('token', $token)
                ->execute();

            return User::load($query['uid']);
        }

        return null;
    }

    /**
     * Récupère un utilisateur par son token (alias de validateBearerToken).
     *
     * @param string $token
     *   Le token.
     *
     * @return \Drupal\user\Entity\User|null
     *   L'utilisateur ou null.
     */
    public function getUserByToken($token)
    {
        return $this->validateBearerToken($token);
    }

    /**
     * Vérifie si un token Bearer est valide (sans charger l'utilisateur).
     *
     * @param string $token
     *   Le token à vérifier.
     *
     * @return bool
     *   TRUE si valide, FALSE sinon.
     */
    public function isBearerTokenValid($token)
    {
        if (empty($token)) {
            return false;
        }

        $count = \Drupal::database()->select('mz_crud_tokens', 't')
            ->fields('t', ['uid'])
            ->condition('token', $token)
            ->condition('expiration', time(), '>')
            ->countQuery()
            ->execute()
            ->fetchField();

        return $count > 0;
    }

    /**
     * Invalide un token Bearer spécifique (pour logout d'un appareil).
     *
     * @param string $token
     *   Le token à invalider.
     */
    public function invalidateBearerToken($token)
    {
        if (!empty($token)) {
            \Drupal::database()->delete('mz_crud_tokens')
                ->condition('token', $token)
                ->execute();
        }
    }

    /**
     * Invalide tous les tokens d'un utilisateur (déconnexion globale).
     *
     * @param int $uid
     *   L'ID de l'utilisateur.
     */
    public function invalidateUserTokens($uid)
    {
        if (!empty($uid)) {
            \Drupal::database()->delete('mz_crud_tokens')
                ->condition('uid', $uid)
                ->execute();
        }
    }

    /**
     * Récupère toutes les sessions actives d'un utilisateur.
     *
     * @param int $uid
     *   L'ID de l'utilisateur.
     *
     * @return array
     *   Liste des sessions actives.
     */
    public function getUserSessions($uid)
    {
        $result = \Drupal::database()->select('mz_crud_tokens', 't')
            ->fields('t', ['token', 'session_id', 'user_agent', 'ip_address', 'created', 'expiration', 'last_activity'])
            ->condition('uid', $uid)
            ->condition('expiration', time(), '>')
            ->execute()
            ->fetchAll();

        return $result;
    }

    /**
     * Invalide une session spécifique par son ID.
     *
     * @param string $session_id
     *   L'ID de session.
     */
    public function invalidateSession($session_id)
    {
        if (!empty($session_id)) {
            \Drupal::database()->delete('mz_crud_tokens')
                ->condition('session_id', $session_id)
                ->execute();
        }
    }

    /**
     * Nettoie les tokens expirés (à appeler périodiquement).
     *
     * @return int
     *   Nombre de tokens supprimés.
     */
    public function cleanupExpiredTokens()
    {
        return \Drupal::database()->delete('mz_crud_tokens')
            ->condition('expiration', time(), '<')
            ->execute();
    }
}
