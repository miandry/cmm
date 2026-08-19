import { defineStore } from "pinia";
import { ref } from "vue";
import { buildQueryParams } from "../../utils/queryBuilder.js";
import {
  getDepenses,
  saveDepense,
  getCategoriesDepense,
} from "../../services/depense.js";

export const useDepenseStore = defineStore("depense", () => {
  const depenses = ref({ rows: [], total: 0 });
  const categories = ref({ rows: [], total: 0 });
  const loading = ref(false);
  const error = ref(null);

  async function fetchDepenses(options, append = false) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getDepenses(query);
      const data = response.data;
      if (append && depenses.value.rows.length) {
        depenses.value.rows = [...depenses.value.rows, ...data.rows];
      } else {
        depenses.value = data;
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchAllForTotals(options) {
    loading.value = true;
    try {
      // demander beaucoup d'éléments pour calculer le total côté client
      const query = buildQueryParams({ ...options, pager: 0, offset: 10000 });
      const response = await getDepenses(query);
      return response.data.rows || [];
    } catch (err) {
      error.value = err;
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function createDepense(data) {
    loading.value = true;
    try {
      const response = await saveDepense(data);
      return response.data;
    } catch (err) {
      error.value = err;
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchCategories(options) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getCategoriesDepense(query);
      categories.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  return {
    depenses,
    fetchDepenses,
    fetchAllForTotals,
    createDepense,
    categories,
    fetchCategories,
    loading,
    error,
  };
});
