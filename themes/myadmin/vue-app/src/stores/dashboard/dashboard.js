import { defineStore } from "pinia";
import { ref } from "vue";
import { getDashboardSettings } from "../../services/dashboardSettings.js";
import { applyDashboardSettings } from "../../utils/dashboardFilter.js";

export const useDashboardStore = defineStore("dashboard", () => {
  const items = ref([]);
  const disabledKeys = ref([]);
  const loaded = ref(false);

  async function load() {
    try {
      const response = await getDashboardSettings();
      if (response.data?.status) {
        items.value = response.data.items || [];
        disabledKeys.value = response.data.disabled || [];
        applyDashboardSettings(disabledKeys.value);
      }
    } catch (error) {
      console.error("Impossible de charger la configuration du dashboard:", error);
      disabledKeys.value = window.APP_DATA?.dashboardDisabled || [];
    } finally {
      loaded.value = true;
    }
  }

  function initFromAppData() {
    disabledKeys.value = window.APP_DATA?.dashboardDisabled || [];
  }

  function setDisabledKeys(keys) {
    disabledKeys.value = keys;
    applyDashboardSettings(keys);
  }

  function isEnabled(key) {
    return !disabledKeys.value.includes(key);
  }

  return {
    items,
    disabledKeys,
    loaded,
    load,
    initFromAppData,
    setDisabledKeys,
    isEnabled,
  };
});
