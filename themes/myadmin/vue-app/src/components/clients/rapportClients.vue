<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Patients</p>
            <p class="text-2xl font-bold text-gray-900">{{ clientStore.allClients.total }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <div class="w-6 h-6 flex items-center justify-center">
              <i class="ri-user-line text-primary text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Nouveaux ce mois</p>
            <p class="text-2xl font-bold text-secondary">{{ countThisMonth }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <div class="w-6 h-6 flex items-center justify-center">
              <i class="ri-user-add-line text-secondary text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Avec assurance</p>
            <p class="text-2xl font-bold text-orange-600">{{ withInsurance }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <div class="w-6 h-6 flex items-center justify-center">
              <i class="ri-shield-check-line text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useClientStore } from "../../stores/index.js";


export default {
  name: "rapportClients",
  emit: ['show'],
  setup(_, { emit }) {
    const clientStore = useClientStore();
    // Paramètres dynamiques de la requête
    const queryOptions = ref({
      fields: [
        'nid',
        'field_assurance',
        'created'
      ],
      pager: 0,
      offset: 2000
    })

    const fetchClients = async () => {
      await clientStore.fetchAllClients(queryOptions.value);
    }

    const withInsurance = computed(() =>
      clientStore.allClients.rows.filter(c => c.field_assurance == 1).length
    );

    const countThisMonth = computed(() => {
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();

      return clientStore.allClients.rows.filter(c => {
        const d = new Date(c.created * 1000);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length;
    });

    onMounted(() => {
      fetchClients();
    });

    return {
      // custom
      clientStore,
      withInsurance,
      countThisMonth
    };
  },
};
</script>