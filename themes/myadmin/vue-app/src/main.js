import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import blockZoom from "./utils/blockZoom.js";

import App from "./App.vue";
import Caisse from "./pages/Caisse.vue";
import CaisseServices from "./pages/CaisseServices.vue";
import Clients from "./pages/Clients.vue";
import Order from "./pages/Order.vue";
import Consultations from "./pages/Consultations.vue";
import Assist from "./pages/Assist.vue";
import Dashboard from "./pages/Dashboard.vue";
import UserManager from "./pages/UserManager.vue";
import Facture from "./pages/Facture.vue";
import Ordonnance from "./pages/Ordonnance.vue";
import Stocks from "./pages/Stocks.vue";
import Depenses from "./pages/Depenses.vue";
import AddArticle from "./pages/AddArticle.vue";
import EditArticle from "./pages/EditArticle.vue";
import Articles from "./pages/Articles.vue";
import ArticlesRetour from "./pages/ArticlesRetour.vue";
import Services from "./pages/Services.vue";
import AddService from "./pages/AddService.vue";
import EditService from "./pages/EditService.vue";
import Login from "./pages/Login.vue";
import { hasAnyRole } from "./utils/auth.js";
import { useAuthStore } from "./stores/auth.js";
import { useMenuStore } from "./stores/menu/menu.js";
import ConsultationDetails from "./pages/ConsultationDetails.vue";
import { toast } from "vue-sonner";
import UserProfile from "./pages/UserProfile.vue";
import AssistBoard from "./pages/AssistBoard.vue";
import AllAppointment from "./pages/AllAppointment.vue";
import FactureList from "./pages/FactureList.vue";
import FactureDetails from "./pages/FactureDetails.vue";
import ConsultationList from "./pages/ConsultationList.vue";
import InvoiceHeaderSettings from "./pages/InvoiceHeaderSettings.vue";
import Parametres from "./pages/Parametres.vue";
import MenuSettings from "./pages/MenuSettings.vue";
import ArticleReports from "./pages/ArticleReports.vue";
import QueueList from "./pages/QueueList.vue";

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
    meta: {
      roles: ["caissier", "gerant", "webmaster", "administrator"],
    },
  },
  {
    path: "/caisse",
    name: "caisse",
    component: Caisse,
    meta: {
      roles: ["caissier", "gerant", "webmaster", "administrator"],
    },
  },
  {
    path: "/caisse/services",
    name: "caisse-services",
    component: CaisseServices,
    meta: {
      roles: ["caissier", "gerant", "webmaster", "administrator"],
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: { roles: ["gerant", "webmaster", "administrator"] },
  },
  {
    path: "/users",
    name: "users",
    component: UserManager,
    meta: { roles: ["webmaster", "administrator"] },
  },
  {
    path: "/fr",
    name: "home-fr",
    component: Caisse,
    meta: {
      roles: ["caissier", "gerant", "webmaster", "administrator"],
    },
  },
  {
    path: "/fr/frontdesk",
    name: "frontdesk",
    component: Caisse,
    meta: {
      roles: ["caissier", "gerant", "webmaster", "administrator"],
    },
  },
  {
    path: "/assist/dashboard",
    name: "assist.dashboard",
    component: AssistBoard,
    meta: {
      roles: ["assistant", "gerant", "webmaster", "administrator"],
    },
  },
  {
    path: "/patients",
    name: "patients",
    component: Clients,
    meta: { roles: ["docteur", "gerant", "webmaster", "administrator"] },
  },
  {
    path: "/consultations",
    name: "consultations",
    component: Consultations,
    meta: { roles: ["docteur", "webmaster", "administrator"] },
  },
  {
    path: "/assist",
    name: "assist",
    component: Assist,
    meta: { roles: ["gerant", "webmaster", "administrator"] },
  },
  {
    path: "/consultations/:id/edit",
    name: "consultation.edit",
    component: Consultations,
    meta: { roles: ["docteur", "webmaster", "administrator"] },
  },
  {
    path: "/consultations/details",
    name: "consultation.details",
    component: ConsultationDetails,
    meta: { roles: ["docteur", "webmaster", "administrator"] },
  },
  {
    path: "/mes-consultations",
    name: "consultation.list",
    component: ConsultationList,
    meta: { roles: ["docteur", "webmaster", "administrator"] },
  },
  {
    path: "/facture",
    name: "facture",
    component: Facture,
    meta: {
      hideHeader: true,
      roles: ["caissier", "gerant", "webmaster", "administrator"],
    },
  },
  {
    path: "/ordonnance",
    name: "ordonnance",
    component: Ordonnance,
    meta: {
      hideHeader: true,
      roles: ["docteur", "gerant", "webmaster", "administrator"],
    },
  },
  {
    path: "/commandes",
    name: "commandes",
    component: Order,
    meta: {
      roles: ["caissier", "gerant", "webmaster", "administrator"],
    },
  },
  {
    path: "/stocks",
    name: "stocks",
    component: Stocks,
    meta: { roles: ["gerant", "webmaster", "administrator"] },
  },
  {
    path: "/stocks/ajouter-produit",
    name: "stocks-add-article",
    component: AddArticle,
    meta: { roles: ["gerant", "webmaster", "administrator"] },
  },
  {
    path: "/articles",
    name: "articles",
    component: Articles,
  },
  {
    path: "/articles/retour",
    name: "articles-retour",
    component: ArticlesRetour,
  },
  {
    path: "/articles/:id/edit",
    name: "articles-edit",
    component: EditArticle,
  },
  {
    path: "/services",
    name: "services",
    component: Services,
    meta: { roles: ["gerant", "caissier", "webmaster", "administrator"] },
  },
  {
    path: "/services/add",
    name: "services-add",
    component: AddService,
    meta: { roles: ["gerant", "caissier", "webmaster", "administrator"] },
  },
  {
    path: "/services/:id/edit",
    name: "services-edit",
    component: EditService,
    meta: { roles: ["gerant", "caissier", "webmaster", "administrator"] },
  },
  {
    path: "/reports/articles",
    name: "article.reports",
    component: ArticleReports,
    meta: { roles: ["gerant", "webmaster", "administrator"] },
  },
  {
    path: "/depenses",
    name: "depenses",
    component: Depenses,
    meta: {
      roles: ["caissier", "assistant", "gerant", "webmaster", "administrator"],
    },
  },
  {
    path: "/user-profil",
    name: "user.profil",
    component: UserProfile,
    meta: {
      roles: [
        "caissier",
        "assistant",
        "docteur",
        "gerant",
        "webmaster",
        "administrator",
      ],
    },
  },
  {
    path: "/rendez-vous",
    name: "appointment",
    component: AllAppointment,
    meta: {
      roles: ["docteur", "webmaster", "administrator"],
    },
  },
  {
    path: "/parametres",
    name: "parametres",
    component: Parametres,
    meta: { roles: ["gerant", "administrator", "admin"] },
  },
  {
    path: "/parametres/menu",
    name: "menu-settings",
    component: MenuSettings,
    meta: { roles: ["gerant", "administrator", "admin"] },
  },
  {
    path: "/parametres/facture",
    name: "invoice-header-settings",
    component: InvoiceHeaderSettings,
    meta: { roles: ["gerant", "administrator", "admin"] },
  },
  {
    path: "/factures",
    name: "facture-list",
    component: FactureList,
    meta: {
      roles: ["caissier", "gerant", "webmaster", "administrator"],
    },
  },
  {
    path: "/factures/details",
    name: "facture-details",
    component: FactureDetails,
    meta: {
      roles: ["caissier", "gerant", "webmaster", "administrator"],
    },
  },
  {
    path: "/file-d-attente",
    name: "queue-list",
    component: QueueList,
    meta: {
      roles: ["caissier", "gerant", "webmaster", "administrator"],
    },
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
    // toast.error("Vous devez être connecté pour accéder à cette page.");
    return next({ name: "login" });
  }

  // Vérification des rôles
  if (requiredRoles.length && !hasAnyRole(requiredRoles)) {
    toast.error(
      "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
    );
    return next({ name: "home" });
  }

  next();
});

const pinia = createPinia();

document.addEventListener("DOMContentLoaded", async () => {
  const el = document.querySelector("#vue-app");
  if (!el) {
    return;
  }

  const app = createApp(App).use(pinia).use(router);
  const authStore = useAuthStore(pinia);
  const menuStore = useMenuStore(pinia);

  menuStore.initFromAppData();

  await authStore.checkAuth();
  if (authStore.isAuthenticated) {
    await menuStore.load();
  }

  app.mount("#vue-app");
});
