import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    // state refs
    const user = ref(null);
    const isAuthenticated = ref(false);
    const loading = ref(false);
    const error = ref(null);
    const initialized = ref(false); // ← Nouveau flag

    // IMPORTANT: Configurer axios pour envoyer les cookies
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;

    // Ne pas initialiser automatiquement au chargement du store
    // On va le faire manuellement après la création du router

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
        localStorage.removeItem('user_data');

        if (window.APP_DATA) {
            window.APP_DATA.user = null;
            window.APP_DATA.isLoggedIn = false;
            window.APP_DATA.username = null;
            window.APP_DATA.roles = [];
        }
    }

    // Initialisation asynchrone (à appeler depuis App.vue)
    async function initialize() {
        if (initialized.value) return true;
        
        loading.value = true;
        try {
            // D'abord restaurer depuis localStorage
            const savedUser = localStorage.getItem('user_data');
            if (savedUser) {
                const localUser = JSON.parse(savedUser);
                user.value = localUser;
                isAuthenticated.value = true;
                updateWindowAppData(localUser);
            }

            // Puis vérifier avec le serveur
            const authStatus = await checkAuthWithServer();
            
            if (authStatus.authenticated) {
                // Mettre à jour avec les données du serveur
                user.value = authStatus.user;
                isAuthenticated.value = true;
                
                localStorage.setItem('user_data', JSON.stringify(authStatus.user));
                updateWindowAppData(authStatus.user);
            } else if (savedUser) {
                // Le localStorage dit connecté mais le serveur dit non
                // => Token invalide, on nettoie
                console.log('Session invalide, nettoyage...');
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
            const response = await axios.get('/crud/check-auth');
            if (response.status === 200 && response.data.authenticated) {
                return {
                    authenticated: true,
                    user: response.data.user
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

    async function login(username, password, redirectTo = '/dashboard', router) {
        loading.value = true;
        error.value = null;

        try {
            const response = await axios.post('/crud/login', {
                name: username,
                password: password
            });

            if (response.status === 200) {
                const data = response.data;
                
                if (data.status === true) {
                    user.value = {
                        id: data.user.id,
                        name: data.user.name,
                        mail: data.user.mail,
                        roles: data.user.roles || []
                    };
                    
                    localStorage.setItem('user_data', JSON.stringify(user.value));
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

    async function logout(redirectTo = '/login', router) {
        try {
            await axios.post('/crud/logout');
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            clearAuthData();
            
            if (router) {
                router.push(redirectTo);
            }
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
            next('/login');
        }
    }

    // Fonction pour rediriger si déjà authentifié
    async function requireGuest(to, from, next) {
        await checkAuth();
        if (!isAuthenticated.value) {
            next();
        } else {
            next('/caisse');
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
        checkAuth,
        requireAuth,
        requireGuest
    };
});