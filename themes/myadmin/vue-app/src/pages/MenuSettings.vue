<template>
  <div class="max-w-3xl mx-auto p-4 md:p-6">
    <div class="mb-6">
      <router-link to="/parametres" class="text-sm text-primary hover:underline mb-2 inline-block">
        ← Retour aux paramètres
      </router-link>
      <h1 class="text-2xl font-bold text-gray-800">Menu de navigation</h1>
      <p class="text-sm text-gray-500 mt-1">
        Active ou désactive les entrées du menu principal pour tous les utilisateurs.
      </p>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-500">
      <i class="fas fa-spinner fa-spin mr-2"></i> Chargement...
    </div>

    <form v-else @submit.prevent="save" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <ul class="divide-y divide-gray-100">
        <li v-for="item in localItems" :key="item.key" class="flex items-center justify-between px-5 py-4">
          <div>
            <p class="font-medium text-gray-800">{{ item.label }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ item.key }}</p>
          </div>
          <label class="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="item.enabled" class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
            <span class="text-sm text-gray-500">{{ item.enabled ? 'Activé' : 'Désactivé' }}</span>
          </label>
        </li>
      </ul>

      <div class="flex gap-3 p-5 border-t border-gray-100 bg-gray-50">
        <button type="submit" :disabled="saving"
          class="px-5 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
          <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
          {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
        <button type="button" @click="enableAll"
          class="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white">
          Tout activer
        </button>
        <router-link to="/parametres"
          class="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white inline-flex items-center">
          Annuler
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import { getMenuSettings, saveMenuSettings } from "../services/menuSettings.js";
import { useMenuStore } from "../stores/menu/menu.js";

export default {
  name: "MenuSettings",
  setup() {
    const menuStore = useMenuStore();
    const loading = ref(true);
    const saving = ref(false);
    const localItems = ref([]);

    const load = async () => {
      loading.value = true;
      try {
        const response = await getMenuSettings();
        if (response.data?.status) {
          localItems.value = (response.data.items || []).map((item) => ({ ...item }));
        }
      } catch (error) {
        toast.error("Impossible de charger la configuration du menu.");
      } finally {
        loading.value = false;
      }
    };

    const enableAll = () => {
      localItems.value = localItems.value.map((item) => ({ ...item, enabled: true }));
    };

    const save = async () => {
      saving.value = true;
      const disabled = localItems.value.filter((item) => !item.enabled).map((item) => item.key);

      try {
        const response = await saveMenuSettings(disabled);
        if (response.data?.status) {
          localItems.value = (response.data.items || []).map((item) => ({ ...item }));
          menuStore.setDisabledKeys(response.data.disabled || disabled);
          toast.success(response.data.message || "Menu enregistré.");
        } else {
          toast.error(response.data?.message || "Erreur lors de l'enregistrement.");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement.");
      } finally {
        saving.value = false;
      }
    };

    onMounted(load);

    return { loading, saving, localItems, save, enableAll };
  },
};
</script>
