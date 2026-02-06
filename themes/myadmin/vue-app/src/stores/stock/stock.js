import { defineStore } from "pinia";
import { buildQueryParams } from "../../utils/queryBuilder.js";
import { getStockRapport, getStocks, getsuppliers, saveStock, saveStockRapport } from "../../services/stock.js";
import { ref } from "vue";

export const useStockStore = defineStore("stock", () => {
  const stocks = ref({ rows: [], total: 0 });
  const stockRapport = ref({ rows: [], total: 0 });
  const suppliers = ref({ rows: [], total: 0 });
  const loading = ref(false);
  const error = ref(null);

  // fetchStocks: si append=true, on ajoute les nouvelles données
  async function fetchStocks(options, append = false) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getStocks(query);

      const data = response.data;

      if (append && stocks.value.rows.length) {
        // Ajouter les nouvelles données à la liste existante
        stocks.value.rows = [...stocks.value.rows, ...data.rows];
      } else {
        // Remplacer les données
        stocks.value = data;
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  // Save stock
  async function createStock(data) {
    try {
      const response = await saveStock(data);
      if (response.data.status) {
        data.nid = response.data.item;
      }
      await saveStock(data);
      return response;
    } catch (err) {
      error.value = err;
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  // categories
  async function fetchSuppliers(options) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getsuppliers(query);
      const data = response.data;
      suppliers.value = data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchStockRapport(options) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getStockRapport(query);
      const data = response.data;
      stockRapport.value = data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function createStockRapport(data) {
    try {
      const response = await saveStockRapport(data);
      return response.data;
    } catch (err) {
      error.value = err;
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  return {
    stocks,
    fetchStocks,
    createStock,
    fetchSuppliers,
    suppliers,
    error,
    loading,
    fetchStockRapport,
    stockRapport,
    createStockRapport,
  };
});
