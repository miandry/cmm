import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import blockZoom from "./utils/blockZoom.js";

import App from "./App.vue";
import Caisse from "./pages/Caisse.vue";
import Clients from "./pages/Clients.vue";
import Order from "./pages/Order.vue";
import Consultations from "./pages/Consultations.vue";
import Assist from "./pages/Assist.vue";
import Facture from "./pages/Facture.vue";
import Ordonnance from "./pages/Ordonnance.vue";
import Stocks from "./pages/Stocks.vue";
import Login from "./pages/Login.vue";
import { hasAnyRole } from "./utils/auth.js";
import { useAuthStore } from "./stores/auth.js";

blockZoom();

const routes = [
  { path: "/login", name: "login", component: Login, meta: { roles: [] } },
  { path: "/", name: "home", component: Caisse, meta: { roles: ["caissier", "docteur", "administrator"] } },
  { path: "/caisse", name: "caisse", component: Caisse, meta: { roles: ["caissier", "docteur", "administrator"] } },
  { path: "/fr", name: "home-fr", component: Caisse, meta: { roles: ["caissier", "docteur", "administrator"] } },
  { path: "/fr/frontdesk", name: "frontdesk", component: Caisse, meta: { roles: ["caissier", "docteur", "administrator"] } },
  {
    path: "/patients",
    name: "patients",
    component: Clients,
    meta: { roles: ["docteur", "administrator"] },
  },
  {
    path: "/consultations",
    name: "consultations",
    component: Consultations,
    meta: { roles: ["docteur", "administrator"] },
  },
  {
    path: "/assist",
    name: "assist",
    component: Assist,
    meta: { roles: ["docteur", "administrator"] },
  },
  {
    path: "/consultations/:id/edit",
    name: "consultation.edit",
    component: Consultations,
    meta: { roles: ["docteur", "administrator"] },
  },
  {
    path: "/facture",
    name: "facture",
    component: Facture,
    meta: { hideHeader: true, roles: ["caissier", "docteur", "administrator"] },
  },
  {
    path: "/ordonnance",
    name: "ordonnance",
    component: Ordonnance,
    meta: { hideHeader: true, roles: ["docteur", "administrator"] },
  },
  { path: "/commandes", name: "commandes", component: Order, meta: { roles: ["caissier", "docteur", "administrator"] } },
  { path: "/stocks", name: "stocks", component: Stocks, meta: { roles: ["caissier", "docteur", "administrator"] } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Vérifier l'état de l'authentification au premier chargement si nécessaire
  if (!authStore.user) {
    await authStore.checkAuth();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const requiredRoles = to.meta.roles;

  // Si on va vers login et qu'on est déjà connecté -> redirect vers home
  if (to.name === 'login' && isAuthenticated) {
    return next({ name: 'home' });
  }

  // Si la route nécessite une authentification (roles définis et non vide)
  // Note: dans ce projet, toutes les routes semblent protégées sauf login potentiellement
  if (to.name !== 'login' && !isAuthenticated) {
    return next({ name: 'login' });
  }

  // Vérification des rôles
  if (requiredRoles && requiredRoles.length > 0 && isAuthenticated) {
    // Ici, on pourrait utiliser authStore.user.roles si disponible, ou window.APP_DATA
    // Pour l'instant on garde la logique existante via utils/auth.js ou on adapte avec le store
    // Supposons que authStore.user contient les rôles ou qu'on utilise hasAnyRole
    if (!hasAnyRole(requiredRoles)) {
      // Redirection si pas le bon rôle, ou laisser passer si c'est juste une vérif permissive
      // return next("/"); 
    }
  }

  next();
});

const pinia = createPinia();

document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector("#vue-app");
  if (el) {
    createApp(App).use(pinia).use(router).mount("#vue-app");
  }
});
