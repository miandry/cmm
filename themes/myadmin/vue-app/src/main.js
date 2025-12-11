import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import blockZoom from "./utils/blockZoom.js";
import { PDFPlugin } from "vue3-pdfmake";

import App from "./App.vue";
import Caisse from "./pages/Caisse.vue";
import Clients from "./pages/Clients.vue";
import UserList from "./pages/user/UserList.vue";
import About from "./pages/About.vue";
import Order from "./pages/Order.vue";
import Consultations from "./pages/Consultations.vue";
import Facture from "./pages/Facture.vue";

blockZoom();

const routes = [
  { path: "/", name: "home", component: Caisse },
  { path: "/caisse", name: "caisse", component: Caisse },
  { path: "/fr", name: "home-fr", component: Caisse },
  { path: "/fr/frontdesk", name: "frontdesk", component: Caisse },
  { path: "/patients", name: "patients", component: Clients },
  { path: "/consultations", name: "consultations", component: Consultations },
  { path: "/facture/:slug", name: "facture", component: Facture },
  { path: "/commandes", name: "commandes", component: Order },
  { path: "/users", name: "users", component: UserList },
  { path: "/about", name: "about", component: About },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();

document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector("#vue-app");
  if (el) {
    createApp(App).use(pinia).use(router).use(PDFPlugin).mount("#vue-app");
  }
});
