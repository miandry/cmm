import { defineStore } from "pinia";
import { ref } from "vue";
import { getClients, saveClient, deleteClient } from "../../services/cliens";
import { buildQueryParams } from "../../utils/queryBuilder.js";

export const useClientStore = defineStore("client", () => {
  const clients = ref({ rows: [], total: 0 });
  const allClients = ref({ rows: [], total: 0 });
  const client = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // fetchClient
  async function fetchClients(options) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getClients(query);
      clients.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchAllClients(options) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getClients(query);
      allClients.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchClient(id) {
    loading.value = true;
    const query = `filters[nid][val]=${id}`;
    try {
      const response = await getClients(query);
      client.value = response.data.rows[0];
      return response.data.rows[0];
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function createClient(newClientData, page = "other") {
    try {
      let newClient;
      const response = await saveClient(newClientData);
      if (page != "client") {
        newClient = await fetchClient(response.data.item);
        client.value = newClient;
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function destroyClient(id) {
    loading.value = true;
    error.value = null;
    try {
      const res = await deleteClient(id);
      if (res.data.status) {
        clients.value.rows = clients.value.rows.filter((c) => c.nid != id);
      }
      clients.value.total -= ids.length;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function destroyClients(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) return;

    loading.value = true;
    error.value = null;

    try {
      // appels API en parallèle
      await Promise.all(ids.map((id) => deleteClient(id)));

      // mise à jour du store (optimiste)
      clients.value.rows = clients.value.rows.filter(
        (c) => !ids.includes(c.nid)
      );

      // optionnel : mise à jour du total
      clients.value.total -= ids.length;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  function resetClient() {
    client.value = [];
  }

  return {
    clients,
    allClients,
    client,
    loading,
    error,
    fetchClients,
    fetchAllClients,
    fetchClient,
    createClient,
    resetClient,
    destroyClient,
    destroyClients
  };
});
