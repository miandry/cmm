import { defineStore } from "pinia";
import { ref } from "vue";
import { buildQueryParams } from "../../utils/queryBuilder.js";
import {
  getSpeciality,
  getSpecialities,
  saveSpeciality,
} from "../../services/specialite.js";

export const useSpecialityStore = defineStore("speciality", () => {
  const specialities = ref({ rows: [], total: 0 });
  const speciality = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchSpeciality(id, options) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getSpeciality(id, query);
      speciality.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchSpecialities(options) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getSpecialities(query);
      specialities.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function saveSpecialityData(newData) {
    loading.value = true;
    try {
      await saveSpeciality(newData);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  return {
    saveSpecialityData,
    fetchSpecialities,
    fetchSpeciality,
    specialities,
    speciality,
    loading,
    error,
  };
});
