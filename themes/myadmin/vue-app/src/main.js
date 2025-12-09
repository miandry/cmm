import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import blockZoom from './utils/blockZoom.js';
import { PDFPlugin } from "vue3-pdfmake";

import App from './App.vue'
import Caisse from './pages/Caisse.vue'
import Clients from './pages/Clients.vue'
import UserList from './pages/user/UserList.vue'
import About from './pages/About.vue'
import Order from './pages/Order.vue';
import Consultations from './pages/Consultations.vue';
import Facture from './pages/Facture.vue';

blockZoom();

const routes = [
  { path: '/', component: Caisse },
  { path: '/caisse', component: Caisse },
  { path: '/fr', component: Caisse },
  { path: '/fr/frontdesk', component: Caisse },
  { path: '/clients', component: Clients },
  { path: '/consultations', component: Consultations },
  { path: '/facture/:slug', component: Facture },
  { path: '/commandes', component: Order },
  { path: '/users', component: UserList },
  { path: '/about', component: About }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()

document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector('#vue-app')
  if (el) {
    createApp(App).use(pinia).use(router).use(PDFPlugin).mount('#vue-app')
  }
})
