<template>
  <div class="max-w-3xl mx-auto p-4 md:p-6">
    <div class="mb-6">
      <router-link to="/parametres" class="text-sm text-primary hover:underline mb-2 inline-block">
        ← Retour aux paramètres
      </router-link>
      <h1 class="text-2xl font-bold text-gray-800">En-tête de facture</h1>
      <p class="text-sm text-gray-500 mt-1">
        Configure les informations affichées en haut des factures (/facture).
      </p>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-500">
      <i class="fas fa-spinner fa-spin mr-2"></i> Chargement...
    </div>

    <form v-else @submit.prevent="save" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nom du cabinet / pharmacie</label>
        <input v-model="form.nom" type="text" required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
        <input v-model="form.titre" type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Centre / activité</label>
        <input v-model="form.centre" type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
        <input v-model="form.adresse" type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
          <input v-model="form.ville" type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contact (téléphones)</label>
          <input v-model="form.contact" type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">NIF / STAT</label>
        <input v-model="form.immat" type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
      </div>

      <div class="flex gap-3 pt-4 border-t border-gray-100">
        <button type="submit" :disabled="saving"
          class="px-5 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
          <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
          {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
        <router-link to="/parametres"
          class="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          Annuler
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { toast } from "vue-sonner";
import { defaultInvoiceHeader, getInvoiceHeader, saveInvoiceHeader } from "../services/invoiceHeader.js";

export default {
  name: "InvoiceHeaderSettings",
  setup() {
    const loading = ref(true);
    const saving = ref(false);
    const form = reactive({ ...defaultInvoiceHeader });

    const load = async () => {
      loading.value = true;
      try {
        const response = await getInvoiceHeader();
        if (response.data?.status && response.data?.data) {
          Object.assign(form, response.data.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Impossible de charger la configuration de l'en-tête.");
      } finally {
        loading.value = false;
      }
    };

    const save = async () => {
      saving.value = true;
      try {
        const response = await saveInvoiceHeader({ ...form });
        if (response.data?.status) {
          toast.success(response.data.message || "En-tête enregistré.");
          if (response.data.data) {
            Object.assign(form, response.data.data);
          }
        } else {
          toast.error(response.data?.message || "Erreur lors de l'enregistrement.");
        }
      } catch (error) {
        const message = error.response?.data?.message || "Erreur lors de l'enregistrement.";
        toast.error(message);
      } finally {
        saving.value = false;
      }
    };

    onMounted(load);

    return { loading, saving, form, save };
  },
};
</script>
