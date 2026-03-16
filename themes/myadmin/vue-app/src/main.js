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
import Dashboard from "./pages/Dashboard.vue";
import UserManager from "./pages/UserManager.vue";
import Facture from "./pages/Facture.vue";
import Ordonnance from "./pages/Ordonnance.vue";
import Stocks from "./pages/Stocks.vue";
import Login from "./pages/Login.vue";
import { hasAnyRole } from "./utils/auth.js";
import { useAuthStore } from "./stores/auth.js";
import ConsultationDetails from "./pages/ConsultationDetails.vue";
import { toast } from "vue-sonner";

blockZoom();

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { hideHeader: true, roles: [] },
  },
  {
    path: "/",
    name: "home",
    component: Caisse,
    meta: { roles: ["caissier", "docteur", "gerant", "administrator"] },
  },
  {
    path: "/caisse",
    name: "caisse",
    component: Caisse,
    meta: { roles: ["caissier", "docteur", "gerant", "administrator"] },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: { roles: ["docteur", "gerant", "administrator"] },
  },
  {
    path: "/users",
    name: "users",
    component: UserManager,
    meta: { roles: ["gerant", "administrator"] },
  },
  {
    path: "/fr",
    name: "home-fr",
    component: Caisse,
    meta: { roles: ["caissier", "docteur", "gerant", "administrator"] },
  },
  {
    path: "/fr/frontdesk",
    name: "frontdesk",
    component: Caisse,
    meta: { roles: ["caissier", "docteur", "gerant", "administrator"] },
  },
  {
    path: "/patients",
    name: "patients",
    component: Clients,
    meta: { roles: ["docteur", "gerant", "administrator"] },
  },
  {
    path: "/consultations",
    name: "consultations",
    component: Consultations,
    meta: { roles: ["docteur", "gerant", "administrator"] },
  },
  {
    path: "/assist",
    name: "assist",
    component: Assist,
    meta: { roles: ["docteur", "gerant", "administrator"] },
  },
  {
    path: "/consultations/:id/edit",
    name: "consultation.edit",
    component: Consultations,
    meta: { roles: ["docteur", "gerant", "administrator"] },
  },
  {
    path: "/consultations/details",
    name: "consultation.details",
    component: ConsultationDetails,
    meta: { roles: ["docteur", "gerant", "administrator"] },
  },
  {
    path: "/facture",
    name: "facture",
    component: Facture,
    meta: { hideHeader: true, roles: ["caissier", "docteur", "gerant", "administrator"] },
  },
  {
    path: "/ordonnance",
    name: "ordonnance",
    component: Ordonnance,
    meta: { hideHeader: true, roles: ["docteur", "gerant", "administrator"] },
  },
  {
    path: "/commandes",
    name: "commandes",
    component: Order,
    meta: { roles: ["caissier", "docteur", "gerant", "administrator"] },
  },
  {
    path: "/stocks",
    name: "stocks",
    component: Stocks,
    meta: { roles: ["docteur", "gerant", "administrator"] },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.user) {
    authStore.checkAuth();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const requiredRoles = to.meta.roles || [];

  // Si connecté et va sur login
  if (to.name === "login" && isAuthenticated) {
    return next({ name: "home" });
  }

  // Si pas connecté
  if (!isAuthenticated && to.name !== "login") {
    toast.error("Vous devez être connecté pour accéder à cette page.");
    return next({ name: "login" });
  }

  // Vérification des rôles
  if (requiredRoles.length && !hasAnyRole(requiredRoles)) {
    toast.error("Vous n'avez pas les permissions nécessaires pour accéder à cette page.");
    return next({ name: "home" });
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
