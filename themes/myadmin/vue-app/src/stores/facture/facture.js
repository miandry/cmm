import { defineStore } from "pinia";
import { ref } from "vue";
import { buildQueryParams } from "../../utils/queryBuilder.js";
import {
  getInvoice,
  getInvoices,
  saveInvoice,
} from "../../services/facture.js";

export const useInvoiceStore = defineStore("invoice", () => {
  const invoices = ref({ rows: [], total: 0 });
  const invoice = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchInvoice(id, options = {}) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getInvoice(id, query);
      invoice.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchInvoices(options) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getInvoices(query);
      invoices.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function saveInvoiceData(newInvoiceData) {
    loading.value = true;
    try {
      return await saveInvoice(newInvoiceData);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  return {
    saveInvoiceData,
    fetchInvoice,
    fetchInvoices,
    invoice,
    invoices,
    loading,
    error,
  };
});
