import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    // state refs
    const user = ref(null);
    const isAuthenticated = ref(false);
    const loading = ref(false);
    const error = ref(null);

    // initialize from localStorage or window.APP_DATA
    const savedUser = localStorage.getItem('user_data');
    const initialUser = savedUser ? JSON.parse(savedUser) : (window.APP_DATA?.user || null);
    if (initialUser) {
        user.value = initialUser;
        isAuthenticated.value = true;
        if (window.APP_DATA) {
            window.APP_DATA.user = initialUser;
            window.APP_DATA.isLoggedIn = true;
            window.APP_DATA.username = initialUser.name || initialUser.username;
            window.APP_DATA.roles = initialUser.roles || [];
        }
    }

    // actions
    async function login(username, password) {
        loading.value = true;
        error.value = null;

        try {
            const response = await axios.post('/crud/login', {
                name: username,
                password: password
            });

            if (response.status === 200) {
                const data = response.data;
                // Vérifier le status retourné par l'API
                if (data.status === true) {
                    // Construire l'objet utilisateur à partir de la réponse
                    user.value = {
                        id: data.id,
                        name: data.name,
                        mail: data.mail,
                        roles: data.roles || [],
                        token: data.token
                    };
                    // Persist for page reloads
                    localStorage.setItem('user_data', JSON.stringify(user.value));
                    isAuthenticated.value = true;

                    // Sync to window.APP_DATA
                    if (!window.APP_DATA) window.APP_DATA = {};
                    window.APP_DATA.user = user.value;
                    window.APP_DATA.isLoggedIn = true;
                    window.APP_DATA.username = user.value.name;
                    window.APP_DATA.roles = user.value.roles;
                    window.APP_DATA.token = user.value.token;
                    return true;
                } else {
                    error.value = "Identifiants incorrects.";
                    return false;
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            if (err.response && err.response.data && err.response.data.message) {
                error.value = err.response.data.message;
            } else {
                error.value = "Erreur de connexion. Vérifiez vos identifiants.";
            }
            return false;
        } finally {
            loading.value = false;
        }
    }

    function logout() {
        // simply clear local state and storage, then redirect
        user.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem('user_data');

        if (window.APP_DATA) {
            window.APP_DATA.user = null;
            window.APP_DATA.isLoggedIn = false;
        }
    }

    function checkAuth() {
        // Determine auth based on stored user data
        if (isAuthenticated.value) return true;
        const saved = localStorage.getItem('user_data');
        if (saved) {
            user.value = JSON.parse(saved);
            isAuthenticated.value = true;
            return true;
        }
        isAuthenticated.value = false;
        return false;
    }

    return {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        checkAuth
    };
});
