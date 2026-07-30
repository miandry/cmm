import { defineStore } from "pinia";
import { ref } from "vue";
import { getMenuSettings } from "../../services/menuSettings.js";
import { applyMenuSettings } from "../../utils/menuFilter.js";

export const useMenuStore = defineStore("menu", () => {
  const items = ref([]);
  const disabledKeys = ref([]);
  const loaded = ref(false);

  async function load() {
    try {
      const response = await getMenuSettings();
      if (response.data?.status) {
        items.value = response.data.items || [];
        disabledKeys.value = response.data.disabled || [];
        applyMenuSettings(disabledKeys.value);
      }
    } catch (error) {
      console.error("Impossible de charger la configuration du menu:", error);
      disabledKeys.value = window.APP_DATA?.menuDisabled || [];
    } finally {
      loaded.value = true;
    }
  }

  function initFromAppData() {
    disabledKeys.value = window.APP_DATA?.menuDisabled || [];
  }

  function setDisabledKeys(keys) {
    disabledKeys.value = keys;
    applyMenuSettings(keys);
  }

  return {
    items,
    disabledKeys,
    loaded,
    load,
    initFromAppData,
    setDisabledKeys,
  };
});
