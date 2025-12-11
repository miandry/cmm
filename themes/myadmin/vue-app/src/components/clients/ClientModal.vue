<template>
  <div class="flex items-center justify-center min-h-screen p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900">{{ modalTitle }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <div class="w-6 h-6 flex items-center justify-center">
              <i class="ri-close-line text-xl"></i>
            </div>
          </button>
        </div>
        <form  class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet <span
                class="text-red-500">*</span></label>
            <input type="text" id="patient-name" required
              class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Ex: Marie Andriamampionona">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Âge <span
                  class="text-red-500">*</span></label>
              <input type="number"
                class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="34">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sexe <span
                  class="text-red-500">*</span></label>
              <select
                class="w-full px-3 py-2 pr-8 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                <option value="masculin">Masculin</option>
                <option value="feminin">Féminin</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone <span
                class="text-red-500">*</span></label>
            <input type="tel"
              class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Ex: +261 34 87 654 32">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Allergies connues <span
                class="text-red-500">*</span></label>
            <input type="text"
              class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Ex: Pénicilline, Aspirine">
          </div>
          <div class="flex items-center space-x-2">
            <input type="checkbox" id="patient-insurance"
              class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
            <label for="patient-insurance" class="text-sm text-gray-700">Ce patient a une
              assurance</label>
          </div>
          <div class="flex space-x-3 mt-6">
            <button @click="closeModal"
              class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button font-medium whitespace-nowrap">
              Annuler
            </button>
            <button type="submit"
              class="flex-1 px-4 py-2 bg-primary text-white hover:bg-blue-600 !rounded-button font-medium whitespace-nowrap">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue';

export default {
  name: 'ClientModal',
  props: {
    client: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  setup(_, { emit }) {
    // Modal state
    const modalMode = ref("add");

    // Form data
    const formData = reactive({
      nid: "",
      name: "",
      phone: "",
      address: "",
      insurance: 0,
      notes: ""
    });

    // Computed modal title
    const modalTitle = computed(() => {
      return modalMode.value === "add" ? "Ajouter un Client" : "Modifier le Client";
    });


    const resetForm = () => {
      Object.assign(formData, {
        name: "",
        phone: "",
        address: "",
        insurance: 0,
        notes: ""
      });
    };

    const handleSubmit = () => {
      console.log("Form submitted:", formData);
      closeModal();
      // alert(modalMode.value === "add" ? "Client ajouté avec succès!" : "Client modifié avec succès!");
    };

    const editClient = (client) => {
      showModal("edit", client);
    };

    const closeModal = () => {
      emit('close');
    }

    return {
      modalTitle,
      modalMode,
      formData,
      handleSubmit,
      editClient,
      closeModal
    }
  }
}
</script>