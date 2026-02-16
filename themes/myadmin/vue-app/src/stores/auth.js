import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: window.APP_DATA?.user || null,
        isAuthenticated: !!window.APP_DATA?.user,
        loading: false,
        error: null,
    }),

    actions: {
        async login(username, password) {
            this.loading = true;
            this.error = null;

            try {
                // En Drupal, le login standard est POST /user/login?_format=json
                const response = await axios.post('/user/login?_format=json', {
                    name: username,
                    pass: password
                });

                if (response.status === 200) {
                    const userData = response.data;
                    // Store the complete user data (including menu, roles, etc.)
                    this.user = userData.current_user || userData;
                    this.isAuthenticated = true;

                    // Mettre à jour window.APP_DATA pour la compatibilité
                    if (!window.APP_DATA) window.APP_DATA = {};
                    // Merge the complete user data into APP_DATA
                    Object.assign(window.APP_DATA, userData);
                    window.APP_DATA.user = this.user;
                    window.APP_DATA.isLoggedIn = true;

                    return true;
                }
            } catch (err) {
                console.error("Login error:", err);
                if (err.response && err.response.data && err.response.data.message) {
                    this.error = err.response.data.message;
                } else {
                    this.error = "Identifiants incorrects ou erreur serveur.";
                }
                return false;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                await axios.get('/user/logout');
            } catch (err) {
                console.error("Logout error", err);
            } finally {
                this.user = null;
                this.isAuthenticated = false;
                if (window.APP_DATA) {
                    window.APP_DATA.user = null;
                    window.APP_DATA.isLoggedIn = false;
                }
                // Force reload to clear all states
                window.location.href = '/user/login';
            }
        },

        // Vérifier si l'utilisateur est connecté au chargement (si session cookie existe)
        async checkAuth() {
            if (this.isAuthenticated) return true;

            try {
                const response = await axios.get('/user/login_status?_format=json');
                if (response.data === 1) {
                    // Si connecté, on pourrait avoir besoin de fetcher le user profile
                    // Mais pour l'instant on suppose que window.APP_DATA est la source de vérité au chargement initial
                    this.isAuthenticated = true;
                    return true;
                }
            } catch (e) {
                this.isAuthenticated = false;
            }
            return false;
        }
    }
});
