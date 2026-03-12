<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Tableau de Bord</h1>
        <p class="text-gray-500 text-sm mt-1">Vue d'ensemble de la clinique</p>
      </div>

      <!-- Filters -->
      <div class="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm w-fit">
        <button @click="changePeriod('today')" class="px-4 py-1.5 text-sm rounded-lg transition-colors"
          :class="currentPeriod === 'today' ? 'bg-blue-600 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'">
          Aujourd'hui
        </button>
        <button @click="changePeriod('week')" class="px-4 py-1.5 text-sm rounded-lg transition-colors"
          :class="currentPeriod === 'week' ? 'bg-blue-600 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'">
          7 jours
        </button>
        <button @click="changePeriod('month')" class="px-4 py-1.5 text-sm rounded-lg transition-colors"
          :class="currentPeriod === 'month' ? 'bg-blue-600 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'">
          30 jours
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

      <!-- Consultations -->
      <div
        class="relative overflow-hidden rounded-2xl p-5 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div class="flex items-center justify-between font-bold">
          <div>
            <p class="text-xs uppercase opacity-80">Consultations</p>
            <p class="text-3xl font-bold mt-1">{{ todayStats.consultations_count || 0 }}</p>
            <p class="text-xs opacity-80 mt-1">{{ periodLabel }}</p>
          </div>

          <div class="bg-white/20 backdrop-blur p-3 rounded-xl">
            <i class="ri-stethoscope-line text-2xl text-white"></i>
          </div>
        </div>
      </div>

      <!-- Sales -->
      <div
        class="relative overflow-hidden rounded-2xl p-5 shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div class="flex items-center justify-between font-bold">
          <div>
            <p class="text-xs uppercase opacity-80">Ventes</p>
            <p class="text-2xl font-bold mt-1">{{ formatCurrency(todayStats.sales_total) }}</p>
            <p class="text-xs opacity-80 mt-1">{{ todayStats.sales_count || 0 }} commandes</p>
          </div>

          <div class="bg-white/20 backdrop-blur p-3 rounded-xl">
            <i class="ri-shopping-cart-line text-2xl text-white"></i>
          </div>
        </div>
      </div>

      <!-- Patients -->
      <div
        class="relative overflow-hidden rounded-2xl p-5 shadow-lg bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white">
        <div class="flex items-center justify-between font-bold">
          <div>
            <p class="text-xs uppercase opacity-80">Patients</p>
            <p class="text-3xl font-bold mt-1">{{ todayStats.clients_count || 0 }}</p>
            <p class="text-xs opacity-80 mt-1">Nouveaux patients</p>
          </div>

          <div class="bg-white/20 backdrop-blur p-3 rounded-xl">
            <i class="ri-user-heart-line text-2xl text-white"></i>
          </div>
        </div>
      </div>

      <!-- Low Stock -->
      <div
        class="relative overflow-hidden rounded-2xl p-5 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div class="flex items-center justify-between font-bold">
          <div>
            <p class="text-xs uppercase opacity-80">Stock Bas</p>
            <p class="text-3xl font-bold mt-1">{{ todayStats.low_stock_items || 0 }}</p>
            <p class="text-xs opacity-80 mt-1">Articles critiques</p>
          </div>

          <div class="bg-white/20 backdrop-blur p-3 rounded-xl">
            <i class="ri-alert-line text-2xl text-white"></i>
          </div>
        </div>
      </div>

    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Sales Chart -->
      <SalesChart />

      <!-- Consultations Chart -->
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Consultations Récentes</h3>
        <div class="h-64 w-full relative">
          <Bar v-if="consultationsChartData.labels.length > 0" :data="consultationsChartData" :options="chartOptions" />
          <div v-else class="flex flex-col items-center justify-center h-full text-gray-500 text-xs">
            <i class="ri-line-chart-line text-2xl mb-2 text-gray-300"></i>
            <p>Pas de données disponibles</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tables Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Low Stock Table -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-gray-700">Stocks Critiques</h3>
          <span class="text-xs text-red-600 font-medium">{{ lowStockItems.length }} articles</span>
        </div>
        <div class="overflow-auto max-h-80">
          <div v-if="lowStockItems.length === 0" class="text-center py-8 text-gray-500 text-sm">
            <i class="ri-checkbox-circle-line text-3xl text-green-500 mb-2"></i>
            <p>Tous les stocks sont suffisants</p>
          </div>
          <div v-else class="space-y-2">
            <div v-for="item in lowStockItems" :key="item.nid"
              class="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-800">{{ item.title }}</p>
                <p class="text-xs text-gray-500">{{ item.dci || 'N/A' }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-red-600">{{ item.stock }} {{ item.unit || 'unités' }}</p>
                <p class="text-xs text-gray-500">{{ formatCurrency(item.price) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Consultations Table -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-gray-700">Consultations Récentes</h3>
          <span class="text-xs text-blue-600 font-medium">{{ recentConsultations.length }} consultations</span>
        </div>
        <div class="overflow-auto max-h-80">
          <div v-if="recentConsultations.length === 0" class="text-center py-8 text-gray-500 text-sm">
            <i class="ri-calendar-line text-3xl text-gray-300 mb-2"></i>
            <p>Aucune consultation récente</p>
          </div>
          <div v-else class="space-y-2">
            <div v-for="consult in recentConsultations" :key="consult.nid"
              class="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-800">{{ consult.patient_name || 'Anonyme' }}</p>
                <p class="text-xs text-gray-500">{{ consult.motif || 'Consultation générale' }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500">{{ formatDate(consult.created) }}</p>
                <p v-if="consult.temperature" class="text-xs text-blue-600">{{ consult.temperature }}°C</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import SalesChart from '../components/charts/SalesChart.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default {
  name: 'Dashboard',
  components: {
    Bar,
    SalesChart
  },
  setup() {
    const currentPeriod = ref('today');
    const todayStats = ref({
      consultations_count: 0,
      sales_count: 0,
      sales_total: 0,
      clients_count: 0,
      low_stock_items: 0
    });
    const lowStockItems = ref([]);
    const recentConsultations = ref([]);
    const consultationsData = ref([]);

    const periodLabel = computed(() => {
      const labels = {
        'today': "Aujourd'hui",
        'week': "7 derniers jours",
        'month': "30 derniers jours"
      };
      return labels[currentPeriod.value] || "Aujourd'hui";
    });

    const fetchStats = async (period = "today") => {
      try {
        const response = await fetch(`/api/rag/get-data?period=${period}`);
        const data = await response.json();

        if (data.success) {
          todayStats.value = {
            consultations_count: data.stats?.consultations_count || 0,
            sales_count: data.stats?.sales_count || 0,
            sales_total: data.stats?.sales_total || 0,
            clients_count: data.stats?.clients_count || 0,
            low_stock_items: data.stats?.low_stock_items || 0
          };
          recentConsultations.value = (data.consultations || []).slice(0, 10);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    const changePeriod = (period) => {
      currentPeriod.value = period;
      fetchStats(period);
    };

    const fetchLowStock = async () => {
      try {
        const response = await fetch('/api/rag/medications?low_stock_only=true&limit=20');
        const data = await response.json();
        lowStockItems.value = data.data || [];
      } catch (error) {
        console.error('Error fetching low stock:', error);
      }
    };

    const fetchConsultations = async () => {
      try {
        const response = await fetch('/api/rag/consultations?limit=30');
        const data = await response.json();
        consultationsData.value = data.data || [];
      } catch (error) {
        console.error('Error fetching consultations:', error);
      }
    };

    const consultationsChartData = computed(() => {
      const consults = consultationsData.value || [];

      const consultsByDate = {};

      consults.forEach((consult) => {
        if (!consult.created) return;

        const dateObj = new Date(parseInt(consult.created) * 1000);

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");

        const key = `${year}-${month}-${day}`;

        if (!consultsByDate[key]) {
          consultsByDate[key] = 0;
        }

        consultsByDate[key] += 1;
      });

      const sortedEntries = Object.entries(consultsByDate).sort(
        (a, b) => new Date(a[0]) - new Date(b[0])
      );

      let limit = 14;
      if (currentPeriod.value === 'week') limit = 7;
      if (currentPeriod.value === 'month') limit = 30;

      const recentEntries = sortedEntries.slice(-limit);

      const labels = recentEntries.map(([date]) => {
        const d = new Date(date);

        return d.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
        });
      });

      const data = recentEntries.map(([, total]) => total);

      return {
        labels,
        datasets: [
          {
            label: "Consultations",
            backgroundColor: "#8b5cf6",
            borderRadius: 6,
            maxBarThickness: 80,
            data: data,
          },
        ],
      };
    });

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#f3f4f6'
          },
          ticks: {
            font: {
              size: 10
            },
            stepSize: 1
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 10
            }
          }
        }
      }
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('fr-MG', {
        style: 'currency',
        currency: 'MGA',
        minimumFractionDigits: 0
      }).format(value || 0);
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    onMounted(() => {
      fetchStats("today");
      fetchLowStock();
      fetchConsultations();
    });

    return {
      currentPeriod,
      periodLabel,
      todayStats,
      lowStockItems,
      recentConsultations,
      consultationsChartData,
      chartOptions,
      formatCurrency,
      formatDate,
      changePeriod
    };
  }
}
</script>