import { defineStore } from "pinia";
import { ref } from "vue";
import { buildQueryParams } from "../../utils/queryBuilder.js";
import { getAppointment, getAppointments, saveAppointment } from "../../services/appointment.js";

export const useAppointmentStore = defineStore("appointment", () => {
  const appointments = ref({ rows: [], total: 0 });
  const appointment = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchAppointments(options) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getAppointments(query);
      appointments.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchAppointment(id, options = {}) {
    loading.value = true;
    try {
      const query = buildQueryParams(options);
      const response = await getAppointment(id, query);
      appointment.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function createAppointment(newAppointmentData) {
    loading.value = true;
    try {
      await saveAppointment(newAppointmentData);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  return {
    createAppointment,
    fetchAppointment,
    fetchAppointments,
    appointment,
    appointments,
    loading,
    error,
  };
});
