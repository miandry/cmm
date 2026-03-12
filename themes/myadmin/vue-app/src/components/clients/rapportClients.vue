<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">

      <!-- Total Patients -->
      <div
        class="relative overflow-hidden rounded-2xl p-5 shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div class="flex items-center justify-between font-bold">
          <div>
            <p class="text-xs uppercase opacity-80">Total Patients</p>
            <p class="text-3xl font-bold mt-1">{{ clientStore.allClients.total }}</p>
            <p class="text-xs opacity-80 mt-1">Patients enregistrés</p>
          </div>

          <div class="bg-white/20 backdrop-blur p-3 rounded-xl">
            <i class="ri-user-line text-2xl text-white"></i>
          </div>
        </div>
      </div>

      <!-- New This Month -->
      <div
        class="relative overflow-hidden rounded-2xl p-5 shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div class="flex items-center justify-between font-bold">
          <div>
            <p class="text-xs uppercase opacity-80">Nouveaux ce mois</p>
            <p class="text-3xl font-bold mt-1">{{ countThisMonth }}</p>
            <p class="text-xs opacity-80 mt-1">Patients ajoutés</p>
          </div>

          <div class="bg-white/20 backdrop-blur p-3 rounded-xl">
            <i class="ri-user-add-line text-2xl text-white"></i>
          </div>
        </div>
      </div>

      <!-- With Insurance -->
      <div
        class="relative overflow-hidden rounded-2xl p-5 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div class="flex items-center justify-between font-bold">
          <div>
            <p class="text-xs uppercase opacity-80">Avec assurance</p>
            <p class="text-3xl font-bold mt-1">{{ withInsurance }}</p>
            <p class="text-xs opacity-80 mt-1">Patients assurés</p>
          </div>

          <div class="bg-white/20 backdrop-blur p-3 rounded-xl">
            <i class="ri-shield-check-line text-2xl text-white"></i>
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