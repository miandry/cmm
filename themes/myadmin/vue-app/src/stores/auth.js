import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // state refs
  const user = ref(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref(null);
  const initialized = ref(false);

  // IMPORTANT: Configurer axios pour envoyer les cookies
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;

  // Helper pour mettre à jour window.APP_DATA
  function updateWindowAppData(userData) {
    if (!window.APP_DATA) window.APP_DATA = {};
    window.APP_DATA.user = userData;
    window.APP_DATA.isLoggedIn = true;
    window.APP_DATA.username = userData.name;
    window.APP_DATA.roles = userData.roles || [];
  }

  // Helper pour nettoyer les données d'authentification
  function clearAuthData() {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("user_data");

    if (window.APP_DATA) {
      window.APP_DATA.user = null;
      window.APP_DATA.isLoggedIn = false;
      window.APP_DATA.username = null;
      window.APP_DATA.roles = [];
    }
  }

  // Initialisation asynchrone
  async function initialize() {
    if (initialized.value) return true;

    loading.value = true;
    try {
      const savedUser = localStorage.getItem("user_data");
      if (savedUser) {
        const localUser = JSON.parse(savedUser);
        user.value = localUser;
        isAuthenticated.value = true;
        updateWindowAppData(localUser);
      }

      const authStatus = await checkAuthWithServer();

      if (authStatus.authenticated) {
        user.value = authStatus.user;
        isAuthenticated.value = true;

        localStorage.setItem("user_data", JSON.stringify(authStatus.user));
        updateWindowAppData(authStatus.user);
      } else if (savedUser) {
        console.log("Session invalide, nettoyage...");
        clearAuthData();
      }

      initialized.value = true;
      return isAuthenticated.value;
    } catch (error) {
      console.error("Auth initialization error:", error);
      clearAuthData();
      initialized.value = true;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function checkAuthWithServer() {
    try {
      const response = await axios.get("/api/crud/check-auth");
      if (response.status === 200 && response.data.authenticated) {
        return {
          authenticated: true,
          user: response.data.user,
        };
      }
      return { authenticated: false };
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error("Check auth error:", err);
      }
      return { authenticated: false };
    }
  }

  async function login(username, password, redirectTo = "/dashboard", router) {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.post("/api/crud/login", {
        name: username,
        password: password,
      });

      if (response.status === 200) {
        const data = response.data;

        if (data.status === true) {
          user.value = {
            id: data.user.id,
            name: data.user.name,
            mail: data.user.mail,
            roles: data.user.roles || [],
          };

          localStorage.setItem("user_data", JSON.stringify(user.value));
          isAuthenticated.value = true;

          updateWindowAppData(user.value);

          if (router) {
            router.push(redirectTo);
          }

          return true;
        } else {
          error.value = data.message || "Identifiants incorrects.";
          return false;
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        if (err.response.status === 401) {
          error.value = "Identifiants incorrects.";
        } else if (err.response.data && err.response.data.message) {
          error.value = err.response.data.message;
        } else {
          error.value = "Erreur de connexion. Vérifiez vos identifiants.";
        }
      } else {
        error.value = "Erreur de connexion au serveur.";
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function logout(redirectTo = "/login", router) {
    try {
      await axios.post("/api/crud/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearAuthData();

      if (router) {
        router.push(redirectTo);
      }
    }
  }

  /**
   * Changer le mot de passe de l'utilisateur connecté
   * @param {string} currentPassword - Mot de passe actuel
   * @param {string} newPassword - Nouveau mot de passe
   * @param {Object} router - Routeur Vue pour la redirection
   * @returns {Promise<Object>} Résultat de l'opération
   */
  async function changePassword(currentPassword, newPassword, router = "/login") {
    loading.value = true;
    error.value = null;

    // Validation côté client
    if (!currentPassword || !newPassword) {
      error.value = "Tous les champs sont requis";
      loading.value = false;
      return { success: false, error: error.value };
    }

    if (currentPassword === newPassword) {
      error.value = "Le nouveau mot de passe doit être différent de l'ancien";
      loading.value = false;
      return { success: false, error: error.value };
    }

    if (newPassword.length < 6) {
      error.value = "Le mot de passe doit contenir au moins 6 caractères";
      loading.value = false;
      return { success: false, error: error.value };
    }

    try {
      const response = await axios.post("/api/crud/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (response.status === 200 && response.data.status) {
        // 🔴 DÉCONNEXION IMMÉDIATE - Supprimer les données locales
        clearAuthData();

        // Message de succès
        const successMessage =
          response.data.message || "Mot de passe changé avec succès";

        // Rediriger vers login immédiatement
        if (router) {
          router.push("/login");
        } else {
          // Fallback si pas de router
          window.location.href = "/login";
        }

        return {
          success: true,
          message: successMessage,
          requiresRelogin: true,
        };
      } else {
        error.value =
          response.data.error || "Erreur lors du changement de mot de passe";
        return { success: false, error: error.value };
      }
    } catch (err) {
      console.error("Change password error:", err);

      if (err.response) {
        if (err.response.status === 401) {
          if (err.response.data.error === "Mot de passe actuel incorrect") {
            error.value = "Mot de passe actuel incorrect";
          } else {
            error.value = "Session expirée. Veuillez vous reconnecter.";
            // Nettoyer et rediriger
            clearAuthData();
            if (router) {
              router.push("/login");
            }
          }
        } else if (err.response.status === 400) {
          error.value = err.response.data.error || "Données invalides";
        } else if (err.response.status === 403) {
          error.value = "Vous n'êtes pas autorisé à effectuer cette action";
        } else {
          error.value =
            err.response.data.error ||
            "Erreur lors du changement de mot de passe";
        }
      } else {
        error.value = "Erreur de connexion au serveur";
      }

      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function checkAuth() {
    if (!initialized.value) {
      await initialize();
    }
    return isAuthenticated.value;
  }

  // Fonction pour rediriger si non authentifié
  async function requireAuth(to, from, next) {
    await checkAuth();
    if (isAuthenticated.value) {
      next();
    } else {
      next("/login");
    }
  }

  // Fonction pour rediriger si déjà authentifié
  async function requireGuest(to, from, next) {
    await checkAuth();
    if (!isAuthenticated.value) {
      next();
    } else {
      next("/caisse");
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    initialized,
    initialize,
    login,
    logout,
    changePassword, // ← Nouvelle fonction exportée
    checkAuth,
    requireAuth,
    requireGuest,
  };
});
