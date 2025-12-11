import { defineStore } from "pinia";
import { ref } from "vue";
import { buildQueryParams } from "../../utils/queryBuilder.js";
import {
  getConsultations,
  saveConsultation,
} from "../../services/consultation.js";
import { toast } from "vue-sonner";

export const useConsultationStore = defineStore("consultation", () => {
  const consultations = ref({ rows: [], total: 0 });
  const consultation = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const savedMedication = ref([]);
  const medications = ref([]);

  // fetchConsultations all
  async function fetchConsultations(options) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getConsultations(query);
      consultations.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchConsultation(id) {
    loading.value = true;
    const query = `filters[nid][val]=${id}`;
    try {
      const response = await getConsultations(query);
      consultation.value = response.data.rows[0];
      return response.data.rows[0];
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function createConsultation(newConsultationData) {
    try {
      const response = await saveConsultation(newConsultationData);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function saveMedication(data) {
    // Vérifier si l'article existe déjà
    const exists = medications.value.some((item) => item.nid == data.nid);

    if (exists) {
      toast.error("Cet article est déjà ajouté.");
      return null; // ne rien ajouter
    }

    medications.value.push(data);

    const total = medications.value.reduce((sum, item) => {
      return sum + (parseFloat(item.field_prix * item.quantity) || 0);
    }, 0);

    savedMedication.value = {
      items: medications.value,
      total: total,
    };

    return true;
  }

  function removeFromList(nid, prix, quantity) {
    // Retirer tous les items avec ce nid
    medications.value = medications.value.filter((item) => item.nid !== nid);
    savedMedication.value.items = savedMedication.value.items.filter(
      (item) => item.nid !== nid
    );
    savedMedication.value.total -= parseFloat(prix * quantity);
  }

  function resetMedication() {
    savedMedication.value = {
      items: [],
      total: 0,
    };
    medications.value = [];
  }

  return {
    consultations,
    consultation,
    loading,
    error,
    saveMedication,
    fetchConsultations,
    fetchConsultation,
    createConsultation,
    savedMedication,
    medications,
    removeFromList,
    resetMedication
  };
});
