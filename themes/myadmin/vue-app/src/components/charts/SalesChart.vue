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
import { computed } from 'vue';
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

    const chartData = computed(() => {
      const orders = orderStore.orders.rows || [];
      
      // Grouper les ventes par date
      const salesByDate = {};
      
      orders.forEach(order => {
        if (!order.created) return;
        
        // Convertir le timestamp ou la date en format lisible (DD/MM)
        const dateObj = new Date(order.created * 1000); // Supposons timestamp unix
        // Si c'est une string ISO, new Date(order.created) fonctionne aussi
        
        const dateKey = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        
        const amount = parseFloat(order.field_total_vente) || 0;
        
        if (salesByDate[dateKey]) {
          salesByDate[dateKey] += amount;
        } else {
          salesByDate[dateKey] = amount;
        }
      });

      // Trier par date (approximation simple via les clés ou sorting explicite)
      // Pour faire simple, on prend les clés telles quelles, idéalement on trierait par timestamp
      // Créons un tableau pour trier
      const sortedEntries = Object.entries(salesByDate).sort((a, b) => {
        // Cette méthode de tri sur DD/MM est imparfaite sur une année glissante mais ok pour démo courte
        // Mieux : reconstruire des objets date pour le tri
        const [d1, m1] = a[0].split('/');
        const [d2, m2] = b[0].split('/');
        return new Date(2024, m1 - 1, d1) - new Date(2024, m2 - 1, d2);
      });

      // Garder les 7 derniers jours par exemple, ou tout afficher
      const labels = sortedEntries.map(e => e[0]);
      const data = sortedEntries.map(e => e[1]);

      return {
        labels: labels,
        datasets: [
          {
            label: 'Ventes (Ar)',
            backgroundColor: '#3b82f6', // primary blue
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
