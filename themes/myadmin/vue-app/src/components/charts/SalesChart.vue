<template>
  <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-4">
    <h3 class="text-sm font-semibold text-gray-700 mb-4">Évolution des Ventes</h3>
    <div class="h-64 w-full relative">
      <Bar v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
      <div v-else class="flex flex-col items-center justify-center h-full text-gray-500 text-xs">
        <i class="ri-bar-chart-2-line text-2xl mb-2 text-gray-300"></i>
        <p>Pas assez de données pour afficher le graphique.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
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
import { useOrderStore } from '../../stores/index.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default {
  name: 'SalesChart',
  components: {
    Bar
  },
  setup() {
    const orderStore = useOrderStore();
    const salesData = ref([]);

    // Charger les ventes depuis l'API RAG
    const fetchSalesData = async () => {
      try {
        // Calculer la date d'il y a 14 jours
        const today = new Date();
        const twoWeeksAgo = new Date(today);
        twoWeeksAgo.setDate(today.getDate() - 14);
        const dateFrom = twoWeeksAgo.toISOString().split('T')[0];
        
        const response = await fetch('/api/rag/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            limit: 100,
            date_from: dateFrom
          })
        });
        const data = await response.json();
        salesData.value = data.data || [];
      } catch (error) {
        console.error('Error fetching sales data:', error);
        // Fallback vers le store local
        salesData.value = orderStore.orders.rows || [];
      }
    };

    onMounted(() => {
      fetchSalesData();
    });

    const chartData = computed(() => {
      // Utiliser les données de l'API RAG ou du store
      const orders = salesData.value.length > 0 ? salesData.value : (orderStore.orders.rows || []);
      
      if (orders.length === 0) {
        return { labels: [], datasets: [] };
      }
      
      // Grouper les ventes par date
      const salesByDate = {};
      
      orders.forEach(order => {
        let dateObj;
        let amount = 0;
        
        // Gérer différents formats de date
        if (order.created) {
          // Timestamp Unix (seconds)
          dateObj = new Date(order.created * 1000);
        } else if (order.date) {
          // Date string (YYYY-MM-DD)
          dateObj = new Date(order.date);
        } else {
          return;
        }
        
        // Gérer différents noms de champ pour le total
        amount = parseFloat(order.total || order.field_total_vente || 0);
        
        if (isNaN(dateObj.getTime())) return;
        
        const dateKey = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        
        if (salesByDate[dateKey]) {
          salesByDate[dateKey] += amount;
        } else {
          salesByDate[dateKey] = amount;
        }
      });

      // Trier par date correctement
      const sortedEntries = Object.entries(salesByDate).sort((a, b) => {
        const [d1, m1] = a[0].split('/');
        const [d2, m2] = b[0].split('/');
        // Utiliser l'année courante pour le tri
        const year = new Date().getFullYear();
        return new Date(year, parseInt(m1) - 1, parseInt(d1)) - new Date(year, parseInt(m2) - 1, parseInt(d2));
      });

      // Garder les 14 derniers jours
      const recentEntries = sortedEntries.slice(-14);
      const labels = recentEntries.map(e => e[0]);
      const data = recentEntries.map(e => e[1]);

      return {
        labels: labels,
        datasets: [
          {
            label: 'Ventes (Ar)',
            backgroundColor: '#3b82f6',
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
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(context.parsed.y);
              }
              return label;
            }
          }
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
            }
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

    return {
      chartData,
      chartOptions
    };
  }
}
</script>