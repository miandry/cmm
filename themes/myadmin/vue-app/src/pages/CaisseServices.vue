<template>
  <div class="flex flex-col sm:flex-row h-[calc(100vh-80px)]">
    <PageLoader v-if="serviceStore.loading || orderStore.loading || clientStore.loading" />
    <div class="flex-1 p-3 order-2 sm:order-1 flex flex-col mw-910">
      <div class="mb-3 flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-gray-900">Caisse services</h1>
          <p class="text-xs text-gray-500">Prestations et actes de la clinique</p>
        </div>
        <router-link to="/" class="text-xs text-primary hover:underline flex items-center gap-1 whitespace-nowrap">
          <i class="ri-shopping-cart-line"></i>
          Caisse produits
        </router-link>
      </div>
      <ServiceGrid />
    </div>

    <div
      class="w-full sm:w-2/5 md:w-2/6 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col order-1 sm:order-2 h-auto">
      <ServiceCartSidebar @open-customer-modal="showCustomerModal = true"
        @open-payment-modal="showPaymentModal = true" />
    </div>

    <ClientModal v-show="showCustomerModal" @close="showCustomerModal = false"
      @open-add-customer-modal="openAddCustomerModal" />
    <AddClientModal v-if="showAddCustomerModal" @close-add-customer-modal="closeAddCustomerModal"
      @close-client-modal="showCustomerModal = false" />
    <ServicePaymentModal v-if="showPaymentModal" @close-payment-modal="showPaymentModal = false" />

    <!-- Floating Action Button Component -->
    <FloatingActionButton position="bottom-right" @add-submit="handleAddSubmit" @waiting-list="handleWaitingList" class="hidden" />
  </div>
</template>

<script>
import ServiceGrid from '../components/caisses/ServiceGrid.vue';
import ServiceCartSidebar from '../components/caisses/ServiceCartSidebar.vue';
import ClientModal from '../components/caisses/ClientModal.vue';
import AddClientModal from '../components/caisses/AddClientModal.vue';
import ServicePaymentModal from '../components/caisses/ServicePaymentModal.vue';
import PageLoader from '../components/PageLoader.vue';
import FloatingActionButton from '../components/checkoutLine/FloatingActionButton.vue'
import { useClientStore, useOrderStore, useServiceStore } from '../stores/index.js';

export default {
  name: 'CaisseServices',
  components: {
    ServiceGrid,
    ServiceCartSidebar,
    ClientModal,
    AddClientModal,
    ServicePaymentModal,
    PageLoader,
    FloatingActionButton,
  },
  data() {
    return {
      showCustomerModal: false,
      showAddCustomerModal: false,
      showPaymentModal: false,
    };
  },
  methods: {
    openAddCustomerModal() {
      this.showCustomerModal = false;
      this.showAddCustomerModal = true;
    },
    closeAddCustomerModal() {
      this.showAddCustomerModal = false;
      this.showCustomerModal = true;
    },
    handleAddSubmit(formData) {
      // Traiter les données du formulaire
      console.log('Données du formulaire:', formData);

      // Ici vous pouvez appeler votre API ou store pour ajouter l'élément
      // Exemple: this.articleStore.addArticle(formData);

      // Notification
      // toast.success('Élément ajouté avec succès');
    },
    handleWaitingList() {
      console.log('Navigation vers la liste d\'attente');
      // La navigation est déjà gérée dans le composant FAB
    }
  },
  setup() {
    const serviceStore = useServiceStore();
    const orderStore = useOrderStore();
    const clientStore = useClientStore();
    return { serviceStore, orderStore, clientStore };
  },
};
</script>

<style>
.mw-910 {
  max-width: 910px;
  overflow-x: auto;
}

@media (min-width: 1380px) {
  .mw-910 {
    max-width: none;
    overflow-x: auto;
  }
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

@media (min-width: 1024px) {
  .lg\:w-80 {
    width: 27rem !important;
  }
}

@media (min-width: 768px) {
  .md\:w-80 {
    width: 21rem;
  }
}
</style>
