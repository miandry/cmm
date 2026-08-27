<template>
  <div class="flex flex-col sm:flex-row h-[calc(100vh-80px)]">
    <PageLoader v-if="articleStore.loading || orderStore.loading || clientStore.loading" />
    <!-- Product Grid Section -->
    <div class="flex-1 p-3 order-2 sm:order-1 flex flex-col mw-910">
      <div class="mb-3 flex items-center justify-end">
        <router-link to="/caisse/services"
          class="text-xs text-primary hover:underline flex items-center gap-1 whitespace-nowrap">
          <i class="ri-stethoscope-line"></i>
          Caisse services
        </router-link>
      </div>
      <ProductGrid />
    </div>

    <!-- Cart Sidebar -->
    <div
      class="w-full sm:w-2/5 md:w-2/6 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col order-1 sm:order-2 h-auto">
      <CartSidebar @open-customer-modal="showCustomerModal = true" @open-payment-modal="showPaymentModal = true" />
    </div>

    <!-- Modals -->
    <ClientModal v-show="showCustomerModal" @close="showCustomerModal = false"
      @open-add-customer-modal="openAddCustomerModal" />

    <AddClientModal v-if="showAddCustomerModal" @close-add-customer-modal="closeAddCustomerModal"
      @close-client-modal="showCustomerModal = false" />

    <PaymentModal v-if="showPaymentModal" @close-payment-modal="showPaymentModal = false" />

    <!-- Floating Action Button Component -->
    <FloatingActionButton position="bottom-right" @add-submit="handleAddSubmit" @waiting-list="handleWaitingList" class="hidden"/>
  </div>
</template>

<script>
import ProductGrid from '../components/caisses/ProductGrid.vue'
import CartSidebar from '../components/caisses/CartSidebar.vue'
import ClientModal from '../components/caisses/ClientModal.vue'
import AddClientModal from '../components/caisses/AddClientModal.vue'
import PaymentModal from '../components/caisses/PaymentModal.vue'
import PageLoader from '../components/PageLoader.vue'
import FloatingActionButton from '../components/checkoutLine/FloatingActionButton.vue'
import { useArticleStore, useClientStore, useOrderStore } from '../stores/index.js'

export default {
  name: 'Caisse',
  components: {
    ProductGrid,
    CartSidebar,
    ClientModal,
    AddClientModal,
    PaymentModal,
    PageLoader,
    FloatingActionButton
  },
  data() {
    return {
      showCustomerModal: false,
      showAddCustomerModal: false,
      showPaymentModal: false
    }
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
    const clientStore = useClientStore();
    const articleStore = useArticleStore();
    const orderStore = useOrderStore();

    return {
      clientStore,
      articleStore,
      orderStore
    };
  }
}
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