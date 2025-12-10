import { defineStore } from "pinia";
import { computed, h, ref } from "vue";
import { buildQueryParams } from "../../utils/queryBuilder.js";
import { toast } from "vue-sonner";
import { getExamens } from "../../services/examen.js";

export const useExamenStore = defineStore("examen", () => {
  const examens = ref({ rows: [], total: 0 });
  const loading = ref(false);
  const error = ref(null);
  const savedExamen = ref([]);
  const paragraphExamens = ref([]);

  // fetchExamens: si append=true, on ajoute les nouvelles données
  async function fetchExamens(options, append = false) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getExamens(query);

      const data = response.data;

      if (append && examens.value.rows.length) {
        // Ajouter les nouvelles données à la liste existante
        examens.value.rows = [...examens.value.rows, ...data.rows];
      } else {
        // Remplacer les données
        examens.value = data;
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function saveExamen(data) {
    // Vérifier si l'article existe déjà
    const exists = paragraphExamens.value.some(
      (item) => parseInt(item.nid) === parseInt(data.nid)
    );
    if (exists) {
      toast.error("C'est déjà ajouté.");
      return null; // ne rien ajouter
    }

    paragraphExamens.value.push(data);

    const total = paragraphExamens.value.reduce((sum, item) => {
      return sum + (parseFloat(item.field_prix) || 0);
    }, 0);

    savedExamen.value = {
      items: paragraphExamens.value,
      total: total,
    };
    return true;
  }

  function removeFromList(nid, prix) {
    // Retirer tous les items avec ce nid
    paragraphExamens.value = paragraphExamens.value.filter((item) => item.nid != nid);
    savedExamen.value.items = savedExamen.value.items.filter(
      (item) => item.nid !== nid
    );
    savedExamen.value.total -= parseFloat(prix);
  }

  return {
    examens,
    loading,
    error,
    fetchExamens,
    savedExamen,
    saveExamen,
    paragraphExamens,
    removeFromList,
  };
});
