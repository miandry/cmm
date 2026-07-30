<template>
  <div class="flex flex-col h-full mb-24 sm:mb-0">
    <div class="mb-3">
      <div class="relative mb-3">
        <div
          class="w-5 h-5 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <i class="ri-search-line text-sm"></i>
        </div>
        <input v-model="searchKeyword" @keyup.enter="onSearch" type="text" placeholder="Rechercher des services..."
          class="w-full pl-10 pr-4 py-2 border border-gray-200 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
      </div>
      <div class="flex space-x-2 overflow-x-auto scrollbar-hide mb-2">
        <button @click="filterByCategory('')" :class="categoryButtonClass('')">
          Tous
        </button>
        <button v-for="cat in store.categories.rows" :key="cat.tid" @click="filterByCategory(String(cat.tid))"
          :class="categoryButtonClass(String(cat.tid))">
          {{ cat.name || cat.title }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 xxl-grid-cols-8 gap-2 overflow-y-auto"
      v-if="availableServices.length">
      <ServiceCard v-for="service in availableServices" :key="service.nid" :service="service"
        @add-to-cart="handleAddToCart"
        class="bg-white rounded-lg p-2 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"></ServiceCard>
    </div>
    <div class="flex justify-center items-center mt-24" v-else>
      <h1 class="text-gray-500 text-lg">Aucun service trouvé</h1>
    </div>

    <div v-if="canLoadMore" class="text-center mt-4">
      <button @click="loadMore"
        class="px-4 py-1 bg-primary text-white text-sm rounded hover:bg-primary-dark font-semibold">
        Voir plus
      </button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue';
import { h } from 'vue';
import { toast } from 'vue-sonner';
import { useServiceStore } from '../../stores/index.js';
import ServiceCard from './ServiceCard.vue';

const PUBLISHED_STATUS_FILTER = { val: 1, op: '=' };
const ACTIVE_FILTER = { val: 1, op: '=' };

export default {
  name: 'ServiceGrid',
  components: { ServiceCard },
  setup() {
    const store = useServiceStore();
    const searchKeyword = ref('');
    const selectedCategory = ref('');

    const queryOptions = ref({
      fields: [
        'nid',
        'title',
        'field_prix',
        'field_category',
        'field_image',
        'field_practitioners',
        'status',
        'field_actif',
      ],
      sort: { val: 'title', op: 'asc' },
      filters: {
        status: { ...PUBLISHED_STATUS_FILTER },
        field_actif: { ...ACTIVE_FILTER },
      },
      values: {
        field_category: ['tid', 'name', 'title'],
        field_practitioners: ['nid', 'title'],
      },
      pager: 0,
      offset: 12,
    });

    const availableServices = computed(() =>
      store.services.rows.filter(
        (service) => Number(service.status) === 1 && Number(service.field_actif) === 1,
      ),
    );

    const ensureCaisseFilters = () => {
      queryOptions.value.filters.status = { ...PUBLISHED_STATUS_FILTER };
      queryOptions.value.filters.field_actif = { ...ACTIVE_FILTER };
    };

    const fetchServices = async (append = false) => {
      ensureCaisseFilters();
      await store.fetchServices(queryOptions.value, append, 'caisse');
    };

    const updateFilter = (key, value, op = '=') => {
      if (key === 'status' || key === 'field_actif') {
        ensureCaisseFilters();
        return;
      }
      if (!value) {
        delete queryOptions.value.filters[key];
      } else {
        queryOptions.value.filters[key] = { val: value, op };
      }
      ensureCaisseFilters();
    };

    const onSearch = () => {
      queryOptions.value.pager = 0;
      updateFilter('title', searchKeyword.value.trim(), 'CONTAINS');
      fetchServices(false);
    };

    const filterByCategory = (tid) => {
      selectedCategory.value = tid;
      queryOptions.value.pager = 0;
      updateFilter('field_category', tid);
      fetchServices(false);
    };

    const categoryButtonClass = (tid) => [
      'px-3 py-1.5 rounded-button whitespace-nowrap text-xs font-medium uppercase',
      selectedCategory.value === tid
        ? 'bg-primary text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    ];

    const loadMore = () => {
      queryOptions.value.pager += 1;
      fetchServices(true);
    };

    const handleAddToCart = (service) => {
      store.addItem(service);
      toast.success(() =>
        h('div', ['Ajouté au panier !', h('br'), h('span', service.title)]),
      );
    };

    const canLoadMore = ref(true);
    watch(
      () => store.services,
      (services) => {
        if (!services?.rows) return;
        canLoadMore.value = services.rows.length < (services.total || 0);
      },
      { deep: true, immediate: true },
    );

    onMounted(async () => {
      await store.fetchCategories({
        fields: ['tid', 'name', 'title'],
        sort: { val: 'name', op: 'asc' },
        pager: 0,
        offset: 1000,
      });
      await fetchServices(false);
    });

    return {
      store,
      availableServices,
      searchKeyword,
      onSearch,
      filterByCategory,
      categoryButtonClass,
      loadMore,
      canLoadMore,
      handleAddToCart,
    };
  },
};
</script>

<style>
@media (min-width: 1680px) {
  .xxl-grid-cols-8 {
    grid-template-columns: repeat(8, minmax(0, 1fr)) !important;
  }
}
</style>
