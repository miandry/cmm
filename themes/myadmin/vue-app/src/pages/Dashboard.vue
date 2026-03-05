<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Tableau de Bord</h1>
      <p class="text-gray-600 text-sm mt-1">Vue d'ensemble de la clinique</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Today's Consultations -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase font-medium">Consultations</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ todayStats.consultations_count || 0 }}</p>
            <p class="text-xs text-gray-500 mt-1">Aujourd'hui</p>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg">
            <i class="ri-stethoscope-line text-2xl text-blue-600"></i>
          </div>
        </div>
      </div>

      <!-- Today's Sales -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase font-medium">Ventes</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ formatCurrency(todayStats.sales_total) }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ todayStats.sales_count || 0 }} commandes</p>
          </div>
          <div class="bg-green-50 p-3 rounded-lg">
            <i class="ri-shopping-cart-line text-2xl text-green-600"></i>
          </div>
        </div>
      </div>

      <!-- Total Patients -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase font-medium">Patients</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ totalPatients }}</p>
            <p class="text-xs text-gray-500 mt-1">Total enregistrés</p>
          </div>
          <div class="bg-purple-50 p-3 rounded-lg">
            <i class="ri-user-heart-line text-2xl text-purple-600"></i>
          </div>
        </div>
      </div>

      <!-- Low Stock Items -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase font-medium">Stock Bas</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ todayStats.low_stock_items || 0 }}</p>
            <p class="text-xs text-gray-500 mt-1">Articles critiques</p>
          </div>
          <div class="bg-red-50 p-3 rounded-lg">
            <i class="ri-alert-line text-2xl text-red-600"></i>
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
    const todayStats = ref({
      consultations_count: 0,
      sales_count: 0,
      sales_total: 0,
      low_stock_items: 0
    });
    const totalPatients = ref(0);
    const lowStockItems = ref([]);
    const recentConsultations = ref([]);
    const consultationsData = ref([]);

    const fetchTodayStats = async () => {
      try {
        const response = await fetch('/api/rag/today');
        const data = await response.json();
        todayStats.value = data.stats || {};
        recentConsultations.value = (data.consultations || []).slice(0, 10);
      } catch (error) {
        console.error('Error fetching today stats:', error);
      }
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

    const fetchTotalPatients = async () => {
      try {
        const response = await fetch('/api/rag/patients?limit=1');
        const data = await response.json();
        totalPatients.value = data.count || 0;
      } catch (error) {
        console.error('Error fetching patients:', error);
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
      const consultsByDate = {};
      
      consultationsData.value.forEach(consult => {
        if (!consult.created) return;
        
        const dateObj = new Date(consult.created * 1000);
        const dateKey = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        
        consultsByDate[dateKey] = (consultsByDate[dateKey] || 0) + 1;
      });

      const sortedEntries = Object.entries(consultsByDate).sort((a, b) => {
        const [d1, m1] = a[0].split('/');
        const [d2, m2] = b[0].split('/');
        const year = new Date().getFullYear();
        return new Date(year, parseInt(m1) - 1, parseInt(d1)) - new Date(year, parseInt(m2) - 1, parseInt(d2));
      });

      const recentEntries = sortedEntries.slice(-14);
      const labels = recentEntries.map(e => e[0]);
      const data = recentEntries.map(e => e[1]);

      return {
        labels: labels,
        datasets: [
          {
            label: 'Consultations',
            backgroundColor: '#8b5cf6',
            borderRadius: 6,
            data: data
          }
        ]
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
      fetchTodayStats();
      fetchLowStock();
      fetchTotalPatients();
      fetchConsultations();
    });

    return {
      todayStats,
      totalPatients,
      lowStockItems,
      recentConsultations,
      consultationsChartData,
      chartOptions,
      formatCurrency,
      formatDate
    };
  }
}
</script>
