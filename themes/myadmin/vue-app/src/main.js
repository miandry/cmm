import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import blockZoom from "./utils/blockZoom.js";

import App from "./App.vue";
import Caisse from "./pages/Caisse.vue";
import Clients from "./pages/Clients.vue";
import Order from "./pages/Order.vue";
import Consultations from "./pages/Consultations.vue";
import Facture from "./pages/Facture.vue";
import Ordonnance from "./pages/Ordonnance.vue";
import Stocks from "./pages/Stocks.vue";
import { hasAnyRole } from "./utils/auth.js";

blockZoom();

const routes = [
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

// router.beforeEach((to, from, next) => {
//   const requiredRoles = to.meta.roles;

//   // Route publique
//   if (!requiredRoles) {
//     return next();
//   }

//   // Pas connecté
//   if (!window.APP_DATA?.isLoggedIn) {
//     return next("/");
//   }

//   // Vérification des rôles
//   if (!hasAnyRole(requiredRoles)) {
//     console.warn("Accès refusé", to.path);
//     return next("/"); // ou page 403
//   }

//   next();
// });

const pinia = createPinia();

document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector("#vue-app");
  if (el) {
    createApp(App).use(pinia).use(router).mount("#vue-app");
  }
});
