<template>
  <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
    <h3 class="text-sm font-semibold text-gray-700 mb-4">
      Évolution des Ventes
    </h3>

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
import { computed, onMounted, ref } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";
import { useOrderStore } from "../../stores/index.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: "SalesChart",

  components: {
    Bar,
  },

  setup() {
    const orderStore = useOrderStore();

    const queryOptions = ref({
      fields: ["nid", "title", "field_total_vente", "created"],
      sort: { val: "nid", op: "desc" },
      filters: {},
      values: {},
      pager: 0,
      offset: 100,
    });

    const fetchOrders = async (append = false) => {
      await orderStore.fetchOrders(queryOptions.value, append);
    };

    onMounted(() => {
      fetchOrders(false);
    });

    const chartData = computed(() => {
      const orders = orderStore.orders.rows || [];

      const salesByDate = {};

      orders.forEach((order) => {
        if (!order.created) return;

        const dateObj = new Date(parseInt(order.created) * 1000);

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");

        const key = `${year}-${month}-${day}`;

        const amount = parseFloat(order.field_total_vente) || 0;

        if (!salesByDate[key]) {
          salesByDate[key] = 0;
        }

        salesByDate[key] += amount;
      });

      const sortedEntries = Object.entries(salesByDate).sort(
        (a, b) => new Date(a[0]) - new Date(b[0])
      );

      const labels = sortedEntries.map(([date]) => {
        const d = new Date(date);

        return d.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
        });
      });

      const data = sortedEntries.map(([, total]) => total);

      return {
        labels,
        datasets: [
          {
            label: "Ventes (Ar)",
            data,
            backgroundColor: "#3b82f6",
            borderRadius: 6,
            maxBarThickness: 80,
          },
        ],
      };
    });

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          callbacks: {
            label: function (context) {
              let label = "Ventes : ";

              label += new Intl.NumberFormat("fr-MG", {
                style: "currency",
                currency: "MGA",
              }).format(context.parsed.y);

              return label;
            },
          },
        },
      },

      scales: {
        y: {
          beginAtZero: true,

          grid: {
            color: "#f3f4f6",
          },

          ticks: {
            font: {
              size: 10,
            },
          },
        },

        x: {
          grid: {
            display: false,
          },

          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
    };

    return {
      chartData,
      chartOptions,
    };
  },
};
</script>