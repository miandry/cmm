<template>
  <div>
    <div class="mb-2 rounded-lg p-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Champ de recherche -->
        <div class="flex-1 max-w-lg">
          <div class="relative">
            <div
              class="w-5 h-5 flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <i class="ri-search-line text-lg"></i>
            </div>
            <input type="text" placeholder="Rechercher par nom, téléphone ou numéro de dossier..." v-model="searchQuery"
              @keyup.enter="searchByKeys" class="w-full pl-10 pr-4 py-3 border border-gray-300 !rounded-button text-sm 
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
          </div>
        </div>
        <!-- Filters + Ajouter -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Filtres -->
          <div class="flex space-x-2">
            <!-- Tous -->
            <button @click="filter('all')" :class="[
              'px-3 py-2 text-sm font-medium !rounded-button whitespace-nowrap filter-btn border',
              filterQueryActive === 'all'
                ? 'text-primary bg-blue-50 border-primary'
                : 'text-gray-600 hover:text-primary hover:bg-gray-50 border-gray-300'
            ]">
              Tous
            </button>
            <!-- Assurés -->
            <button @click="filter(1)" :class="[
              'px-3 py-2 text-sm font-medium !rounded-button whitespace-nowrap filter-btn border',
              filterQueryActive === 1
                ? 'text-primary bg-blue-50 border-primary'
                : 'text-gray-600 hover:text-primary hover:bg-gray-50 border-gray-300'
            ]">
              Assurés
            </button>
            <!-- Non assurés -->
            <button @click="filter(0)" :class="[
              'px-3 py-2 text-sm font-medium !rounded-button whitespace-nowrap filter-btn border',
              filterQueryActive === 0
                ? 'text-primary bg-blue-50 border-primary'
                : 'text-gray-600 hover:text-primary hover:bg-gray-50 border-gray-300'
            ]">
              Non assurés
            </button>
          </div>
          <!-- Ajouter patient -->
          <button @click="showModal(null)" class="px-4 py-2 bg-primary text-white !rounded-button font-medium text-sm 
               whitespace-nowrap flex items-center space-x-2">
            <div class="w-4 h-4 flex items-center justify-center">
              <i class="ri-add-line"></i>
            </div>
            <span>Ajouter Patient</span>
          </button>
        </div>
      </div>
    </div>



    <div class="bg-white rounded-lg shadow-sm border border-gray-100">
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Liste des Patients</h2>
          <div class="flex items-center space-x-2">
            <div class="relative hidden">
              <button
                class="px-3 py-2 text-sm text-gray-600 hover:text-primary border border-gray-300 !rounded-button whitespace-nowrap flex items-center space-x-2">
                <div class="w-4 h-4 flex items-center justify-center">
                  <i class="ri-download-line"></i>
                </div>
                <span>Exporter</span>
                <div class="w-4 h-4 flex items-center justify-center ml-1">
                  <i class="ri-arrow-down-s-line text-xs"></i>
                </div>
              </button>
              <div
                class="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden">
                <div class="py-1">
                  <button
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <div class="w-4 h-4 flex items-center justify-center">
                      <i class="ri-file-text-line text-green-600"></i>
                    </div>
                    <span>Exporter CSV</span>
                  </button>
                  <button
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <div class="w-4 h-4 flex items-center justify-center">
                      <i class="ri-file-excel-2-line text-green-700"></i>
                    </div>
                    <span>Exporter Excel (.xlsx)</span>
                  </button>
                  <button
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <div class="w-4 h-4 flex items-center justify-center">
                      <i class="ri-file-pdf-line text-red-600"></i>
                    </div>
                    <span>Exporter PDF</span>
                  </button>
                </div>
              </div>
            </div>
            <button
              class="px-3 py-2 text-sm text-gray-600 hover:text-primary border border-gray-300 !rounded-button whitespace-nowrap flex items-center space-x-2">
              <div class="w-4 h-4 flex items-center justify-center">
                <i class="ri-settings-3-line"></i>
              </div>
              <span>Actions</span>
            </button>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left">
                <input type="checkbox" class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Âge</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assurance</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden">Dernière
                Consultation</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="client in clients.rows" :key="client.nid" class="hover:bg-gray-50 cursor-pointer patient-row">
              <td class="px-4 py-3">
                <input type="checkbox"
                  class="patient-checkbox w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-10 h-10 bg-primary text-white uppercase rounded-full flex items-center justify-center text-sm font-medium">
                    {{ client.title.slice(0, 2) }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 capitalize">{{ client.title }}</p>
                    <p class="text-xs text-gray-500 hidden">#0001</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ client.field_age ? client.field_age + " ans" : '' }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ client.field_phone }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-1" v-if="client.field_assurance && client.field_assurance == 1">
                  <div class="w-2 h-2 bg-secondary rounded-full"></div>
                  <span class="text-xs font-medium text-secondary ">Oui</span>
                </div>
                <div class="flex items-center space-x-1" v-if="client.field_assurance && client.field_assurance == 0">
                  <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span class="text-xs font-medium text-red-500 ">Non</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500 hidden">15 Nov 2024</td>
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <button class="text-primary hover:text-blue-600 view-patient">
                    <div class="w-5 h-5 flex items-center justify-center">
                      <i class="ri-eye-line"></i>
                    </div>
                  </button>
                  <button class="text-gray-600 hover:text-primary edit-patient" @click="showModal(client)">
                    <div class="w-5 h-5 flex items-center justify-center">
                      <i class="ri-edit-line"></i>
                    </div>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-end" v-if="clients.total > 10">
        <div class="flex items-center space-x-2">

          <!-- Précédent -->
          <button @click="previousPage" :class="[
            'px-3 py-2 text-sm text-gray-600 hover:text-primary border border-gray-300 !rounded-button whitespace-nowrap',
            currentPage === 1 && 'opacity-50 cursor-not-allowed'
          ]" :disabled="currentPage === 1">
            Précédent
          </button>

          <!-- Numéros de pages -->
          <div class="flex space-x-1">
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
              'px-3 py-2 text-sm !rounded-button',
              page === currentPage
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
            ]">
              {{ page }}
            </button>
          </div>

          <!-- Suivant -->
          <button @click="nextPage" :disabled="currentPage === totalPages" :class="[
            'px-3 py-2 text-sm text-gray-600 hover:text-primary border border-gray-300 !rounded-button whitespace-nowrap',
            currentPage === totalPages && 'opacity-50 cursor-not-allowed'
          ]">
            Suivant
          </button>

        </div>
      </div>

    </div>
  </div>

</template>

<script>
import { computed, ref, defineExpose } from 'vue';

export default {
  name: 'tableClients',

  // Définition des props
  props: {
    clients: {
      type: Array,
      required: true
    }
  },

  emits: ['searchKeyWords', 'filterBy', 'paginate'],
  setup(props, { emit }) {
    const searchQuery = ref("");
    const filterQueryActive = ref("all");
    const perPage = 10;
    const currentPage = ref(1);

    const totalPages = computed(() => Math.ceil(props.clients.total / perPage));

    // Pages visibles (3 pages max)
    const visiblePages = computed(() => {
      const pages = [];
      const total = totalPages.value;
      const current = currentPage.value;

      if (total <= 3) {
        // Si total ≤ 3 → affichage normal
        for (let i = 1; i <= total; i++) pages.push(i);
      } else {
        // Toujours 3 pages visibles autour de la page active
        if (current === 1) pages.push(1, 2, 3);
        else if (current === total) pages.push(total - 2, total - 1, total);
        else pages.push(current - 1, current, current + 1);
      }

      return pages;
    });

    // Actions
    const goToPage = page => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        emit('paginate', currentPage.value)
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        emit('paginate', currentPage.value)
      };
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        emit('paginate', currentPage.value)
      };
    };

    function searchByKeys() {
      emit('searchKeyWords', searchQuery.value)
      currentPage.value = 1;
    }

    function filter(value) {
      filterQueryActive.value = value;
      emit('filterBy', value);
      currentPage.value = 1;
    }

    function resetFilterUi() {
      searchQuery.value = "";
      filterQueryActive.value = "all";
    }

    const showModal = (client = null) => {
      emit('show', client);
    }

    defineExpose({
      resetFilterUi
    })

    return {
      searchByKeys,
      searchQuery,
      filter,
      filterQueryActive,
      visiblePages,
      currentPage,
      totalPages,
      goToPage,
      nextPage,
      previousPage,
      showModal,
      resetFilterUi,
    }
  }
}
</script>