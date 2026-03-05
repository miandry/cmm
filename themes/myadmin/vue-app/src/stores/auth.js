import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => {
        // Try to recover user from localStorage
        const savedUser = localStorage.getItem('user_data');
        const user = savedUser ? JSON.parse(savedUser) : (window.APP_DATA?.user || null);

        // Sync to window.APP_DATA for legacy global access if needed
        if (user && window.APP_DATA) {
            window.APP_DATA.user = user;
            window.APP_DATA.isLoggedIn = true;
            window.APP_DATA.username = user.name || user.username;
            window.APP_DATA.roles = user.roles || [];
        }

        return {
            user: user,
            isAuthenticated: !!user,
            loading: false,
            error: null,
        }
    },

    actions: {
        async login(username, password) {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.post('/crud/login', {
                    name: username,
                    pass: password
                });

                if (response.status === 200) {
                    const userData = response.data;
                    this.user = userData.current_user || userData.user || userData;
                    this.isAuthenticated = true;

                    // Extract roles from response
                    const userRoles = this.user.roles || userData.roles || [];
                    this.user.roles = userRoles;

                    // Persist for page reloads
                    localStorage.setItem('user_data', JSON.stringify(this.user));

                    // Sync to window.APP_DATA with menu
                    if (!window.APP_DATA) window.APP_DATA = {};
                    window.APP_DATA.user = this.user;
                    window.APP_DATA.isLoggedIn = true;
                    window.APP_DATA.username = this.user.name || this.user.username;
                    window.APP_DATA.roles = userRoles;

                    // Set menu based on roles
                    const allMenuItems = [
                        { id: 2, name: "Caisses", path: "/", icon: "fas fa-shopping-cart", paths: ["/", "/caisse", "/fr", "/fr/frontdesk"] },
                        { id: 8, name: "Tableau de bord", path: "/dashboard", icon: "fas fa-chart-line" },
                        { id: 5, name: "Commandes", path: "/commandes", icon: "fas fa-shopping-bag" },
                        { id: 3, name: "Patients", path: "/patients", icon: "fas fa-users", roles: ["docteur", "administrator"] },
                        { id: 4, name: "Consulter", path: "/consultations", icon: "fas fa-stethoscope", paths: ["/consultations", "/consultations/edit"], roles: ["docteur", "administrator"] },
                        { id: 6, name: "Stocks", path: "/stocks", icon: "fas fa-boxes" },
                        { id: 7, name: "Assistant IA", path: "/assist", icon: "ri-robot-2-line", roles: ["docteur", "administrator"] },
                        { id: 9, name: "Utilisateurs", path: "/users", icon: "fas fa-users-cog", roles: ["administrator"] },
                    ];

                    // Filter menu based on user roles
                    window.APP_DATA.menu = allMenuItems.filter(item => {
                        if (!item.roles || item.roles.length === 0) return true;
                        return item.roles.some(role => userRoles.includes(role));
                    });

                    this.user.menu = window.APP_DATA.menu;

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
                localStorage.removeItem('user_data');

                if (window.APP_DATA) {
                    window.APP_DATA.user = null;
                    window.APP_DATA.isLoggedIn = false;
                }
                window.location.href = '/login';
            }
        },

        async checkAuth() {
            if (this.isAuthenticated) return true;

            try {
                const response = await axios.get('/user/login_status?_format=json');
                if (response.data === 1) {
                    this.isAuthenticated = true;
                    return true;
                }
            } catch (e) {
                this.isAuthenticated = false;
                localStorage.removeItem('user_data');
            }
            return false;
        }
    }
});
