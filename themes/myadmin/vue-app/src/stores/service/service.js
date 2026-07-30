import { defineStore } from "pinia";
import { computed, h, ref } from "vue";
import { toast } from "vue-sonner";
import {
  getServices,
  getServiceCategories,
  getPraticiens,
  getTypePraticien,
  saveService,
  saveServiceCategory,
  savePraticien,
} from "../../services/service.js";
import { buildQueryParams } from "../../utils/queryBuilder.js";

function normalizePractitioners(field) {
  if (!field) {
    return [];
  }
  const rows = Array.isArray(field) ? field : [field];
  return rows
    .filter(Boolean)
    .map((row) => ({
      nid: row.nid || row.target_id,
      title: row.title || row.name || `Praticien #${row.nid || row.target_id}`,
    }))
    .filter((row) => row.nid);
}

export const useServiceStore = defineStore("service", () => {
  const services = ref({ rows: [], total: 0 });
  const categories = ref({ rows: [], total: 0 });
  const praticiens = ref({ rows: [], total: 0 });
  const typePraticiens = ref({ rows: [], total: 0 });
  const loading = ref(false);
  const error = ref(null);
  const cardItems = ref([]);
  const savedOrder = ref(null);
  const pendingPraticienItem = ref(null);

  async function fetchServices(options, append = false, page = null) {
    loading.value = true;
    try {
      const queryOptions = {
        ...options,
        filters: { ...(options.filters || {}) },
      };

      if (page === "caisse") {
        queryOptions.filters.status = { val: 1, op: "=" };
        queryOptions.filters.field_actif = { val: 1, op: "=" };
      }

      const query = buildQueryParams(queryOptions);
      const response = await getServices(query);
      const data = response.data;

      if (page === "caisse" && data?.rows) {
        data.rows = data.rows.filter(
          (row) => Number(row.status) === 1 && Number(row.field_actif) === 1,
        );
      }

      if (append && services.value.rows.length) {
        services.value.rows = [...services.value.rows, ...data.rows];
      } else {
        services.value = data;
      }
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function normalizeService(service) {
    const price = Number(service.field_prix) || 0;
    return {
      ...service,
      field_prix_unitaire: price,
      _original_price: price,
    };
  }

  function addItem(service) {
    if (Number(service.status) !== 1 || !Number(service.field_actif)) {
      toast.warning(() =>
        h("div", ["Service non disponible.", h("br"), h("span", service.title)]),
      );
      return;
    }

    const normalized = normalizeService(service);
    const practitionerOptions = normalizePractitioners(service.field_practitioners);
    const item = cardItems.value.find((i) => i.nid == service.nid);

    if (item) {
      item.quantity++;
    } else {
      const newItem = {
        ...normalized,
        quantity: 1,
        field_praticien: practitionerOptions.length === 1 ? practitionerOptions[0].nid : '',
        _praticien_title: practitionerOptions.length === 1 ? practitionerOptions[0].title : '',
        _practitionerOptions: practitionerOptions,
      };
      cardItems.value.push(newItem);
      if (!newItem.field_praticien) {
        pendingPraticienItem.value = newItem;
      }
    }
  }

  function getPraticienLabel(item) {
    if (!item?.field_praticien) {
      return '';
    }
    if (item._praticien_title) {
      return item._praticien_title;
    }
    const options = getPractitionerOptions(item);
    const found = options.find((row) => String(row.nid) === String(item.field_praticien));
    return found?.title || '';
  }

  function setItemPraticien(item, praticien) {
    if (!item || !praticien) {
      return;
    }
    item.field_praticien = praticien.nid;
    item._praticien_title = praticien.title;
    if (!item._practitionerOptions?.some((row) => String(row.nid) === String(praticien.nid))) {
      item._practitionerOptions = [...(item._practitionerOptions || []), praticien];
    }
    const exists = praticiens.value.rows?.some((row) => String(row.nid) === String(praticien.nid));
    if (!exists) {
      praticiens.value.rows = [...(praticiens.value.rows || []), praticien];
    }
  }

  function clearPendingPraticienItem() {
    pendingPraticienItem.value = null;
  }

  function getPractitionerOptions(item) {
    if (item._practitionerOptions?.length) {
      return item._practitionerOptions;
    }
    return praticiens.value.rows || [];
  }

  function incrementQuantity(item) {
    item.quantity++;
  }

  function decrementQuantity(item) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      removeItem(item);
    }
  }

  function removeItem(item) {
    const index = cardItems.value.findIndex((i) => i.nid == item.nid);
    if (index !== -1) {
      cardItems.value.splice(index, 1);
      toast.success(() =>
        h("div", [h("span", item.title), h("br"), "a été retiré du panier !"]),
      );
    }
  }

  function clearCart(silent = false) {
    cardItems.value.splice(0);
    if (!silent) {
      toast.success("Le panier a été vidé avec succès !");
    }
  }

  const total = computed(() =>
    cardItems.value.reduce(
      (sum, item) => sum + item.field_prix_unitaire * item.quantity,
      0,
    ),
  );

  function saveOrder(client) {
    savedOrder.value = {
      clientId: client.nid,
      clientName: client.title,
      items: cardItems.value.map((item) => ({ ...item })),
      total: total.value,
    };
    return savedOrder.value;
  }

  async function fetchCategories(options) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getServiceCategories(query);
      categories.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPraticiens(options) {
    try {
      const query = buildQueryParams(options);
      const response = await getPraticiens(query);
      praticiens.value = response.data;
    } catch (err) {
      error.value = err;
    }
  }

  async function fetchTypePraticiens(options) {
    try {
      const query = buildQueryParams(options);
      const response = await getTypePraticien(query);
      typePraticiens.value = response.data;
    } catch (err) {
      error.value = err;
    }
  }

  async function createPraticien(data) {
    try {
      const response = await savePraticien(data);
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    }
  }

  async function saveServiceItem(data) {
    try {
      const response = await saveService(data);
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    }
  }

  async function updateServiceStatus(nid, published) {
    try {
      const response = await saveService({
        entity_type: "node",
        bundle: "service",
        nid,
        status: published ? 1 : 0,
      });
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    }
  }

  async function createCategory(name) {
    try {
      const response = await saveServiceCategory(name);
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    }
  }

  return {
    services,
    categories,
    praticiens,
    typePraticiens,
    loading,
    error,
    cardItems,
    savedOrder,
    pendingPraticienItem,
    total,
    fetchServices,
    fetchCategories,
    fetchPraticiens,
    fetchTypePraticiens,
    saveServiceItem,
    updateServiceStatus,
    createCategory,
    createPraticien,
    addItem,
    getPractitionerOptions,
    getPraticienLabel,
    setItemPraticien,
    clearPendingPraticienItem,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
    saveOrder,
  };
});
