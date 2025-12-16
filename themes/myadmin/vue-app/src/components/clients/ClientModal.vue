<template>
  <div class="flex items-center justify-center min-h-screen p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900">{{ modalTitle }}</h3>
          <button @click="closeModal()" class="text-gray-400 hover:text-gray-600">
            <div class="w-6 h-6 flex items-center justify-center">
              <i class="ri-close-line text-xl"></i>
            </div>
          </button>
        </div>
        <form class="space-y-4">
          <!-- Nom complet -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet <span
                class="text-red-500">*</span></label>
            <input type="text" v-model="form.title" :class="{ 'border-red-500': errors.title }"
              class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Ex: Marie Andriamampionona">
            <p v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</p>
          </div>

          <!-- Âge -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Âge <span
                  class="text-red-500">*</span></label>
              <input type="number" min="1" v-model="form.field_age" :class="{ 'border-red-500': errors.age }"
                placeholder="34"
                class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
              <p v-if="errors.age" class="text-xs text-red-500">{{ errors.age }}</p>
            </div>

            <!-- Sexe -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sexe</label>
              <select v-model="form.field_sexe"
                class="w-full px-3 py-2 pr-8 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                <option :value="'masculin'">Masculin</option>
                <option :value="'feminin'">Féminin</option>
              </select>
            </div>
          </div>

          <!-- Téléphone -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone <span
                  class="text-red-500">*</span></label>
              <input type="tel" v-model="form.field_phone" :class="{ 'border-red-500': errors.phone }"
                class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="+261 34 12 345 67">
              <p v-if="errors.phone" class="text-xs text-red-500">{{ errors.phone }}</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" v-model="form.field_email" :class="{ 'border-red-500': errors.email }"
                class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="email@exemple.com">
              <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
            </div>
          </div>

          <!-- Adresse -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Adresse <span
                class="text-red-500">*</span></label>
            <textarea v-model="form.field_adresse" rows="2" :class="{ 'border-red-500': errors.adresse }"
              class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
              placeholder="Adresse complète"></textarea>
            <p v-if="errors.adresse" class="text-xs text-red-500">{{ errors.adresse }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Allergies connues </label>
            <input type="text" v-model="form.field_allergies"
              class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Pénicilline, Aspirine, etc.">
          </div>

          <!-- Contact d'urgence -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Contact d'urgence</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input type="text" v-model="nameUrgence" :class="{ 'border-red-500': errors.name_urgence }"
                  class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="Nom du contact">
                <p v-if="errors.phone_urgence" class="text-xs text-red-500">{{ errors.name_urgence }}</p>
              </div>
              <div>
                <input type="tel" v-model="phoneUrgence" :class="{ 'border-red-500': errors.phone_urgence }"
                  class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="+261 34 12 345 67">
                <p v-if="errors.phone_urgence" class="text-xs text-red-500">{{ errors.phone_urgence }}</p>
              </div>
            </div>

          </div>

          <!-- Assurance -->
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-700">
              <input type="checkbox" :checked="form.field_assurance == '1'"
                @change="form.field_assurance = $event.target.checked ? '1' : '0'"
                class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
              Ce patient a une assurance
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Notes médicales importantes</label>
            <textarea v-model="form.field_notes_medicales" rows="3"
              class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
              placeholder="Antécédents médicaux, traitements en cours, etc."></textarea>
          </div>

          <div class="flex space-x-3 mt-6">
            <button @click.prevent="closeModal()"
              class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button font-medium whitespace-nowrap">
              Annuler
            </button>
            <button @click.prevent="handleSubmit"
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
import { computed, reactive, ref, watch } from 'vue';
import { useClientStore } from '../../stores/index.js';
import { toast } from 'vue-sonner';

export default {
  name: 'ClientModal',
  props: {
    patientToEdit: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const nameUrgence = ref('');
    const phoneUrgence = ref('');
    const modalMode = ref("add");
    const clientStore = useClientStore();
    const modalTitle = ref("Ajouter un patient");
    // Form state
    const form = reactive({
      entity_type: "node",
      bundle: "client",
      status: 1,
      nid: "",
      title: "",
      field_adresse: "",
      field_allergies: "",
      field_assurance: 0,
      field_contact_d_urgence: "",
      field_email: "",
      field_notes_medicales: "",
      field_phone: "",
      field_sexe: "masculin",
      field_age: "",
    });

    // Error messages
    const errors = reactive({
      title: "",
      age: "",
      phone: "",
      email: "",
      adresse: "",
      phone_urgence: "",
      name_urgence: "",
    });

    // -----------------------------
    // Validation function séparée
    // -----------------------------
    const validateForm = () => {
      // Reset errors
      Object.keys(errors).forEach(key => errors[key] = "");

      let valid = true;

      // Nom complet
      if (!form.title) {
        errors.title = "Le nom est requis.";
        valid = false;
      }

      // Age
      if (!form.field_age) {
        errors.age = "L'âge est requis.";
        valid = false;
      } else if (form.field_age < 1) {
        errors.age = "L'âge doit être valide.";
        valid = false;
      }

      // Téléphone
      if (!form.field_phone) {
        errors.phone = "Le téléphone est requis.";
        valid = false;
      }

      // Adresse
      if (!form.field_adresse) {
        errors.adresse = "L'adresse est requise.";
        valid = false;
      }

      // Email (non requis, mais valide si rempli)
      if (form.field_email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.field_email)) {
          errors.email = "Format d'email invalide.";
          valid = false;
        }
      }

      if (!phoneUrgence.value) {
        errors.phone_urgence = "Le téléphone pour urgence est requis.";
        valid = false;
      }

      if (!nameUrgence.value) {
        errors.name_urgence = "Le nom est requis.";
        valid = false;
      }

      return valid;
    };

    // -----------------------------
    // Submit with validation
    // -----------------------------
    const handleSubmit = async () => {
      const isValid = validateForm();

      if (!isValid) return;

      form.field_contact_d_urgence = nameUrgence.value + " - " + phoneUrgence.value;

      clientStore.loading = true;

      await clientStore.createClient(form);

      if (clientStore.error) {
        toast.error("Une erreur est survenue lors de l'enregistrement.")
        return
      }
      if (form.nid == "") {
        closeModal();
        toast.success('Patient ajouté avec succès !')
      } else {
        closeModal(JSON.parse(JSON.stringify(form)));
        toast.success('Modification enregistré !')
      }
      clientStore.loading = false;
    };

    function resetForm() {
      Object.assign(form, {
        entity_type: "node",
        bundle: "client",
        status: 1,
        nid: "",
        title: "",
        field_adresse: "",
        field_allergies: "",
        field_assurance: "0",
        field_contact_d_urgence: "",
        field_email: "",
        field_notes_medicales: "",
        field_phone: "",
        field_sexe: "masculin",
        field_age: "",
      });
      nameUrgence.value = '';
      phoneUrgence.value = '';
      Object.keys(errors).forEach(key => errors[key] = '');
    }

    const closeModal = (patientData = null) => {
      resetForm();
      const data = {
        patientData: patientData
      }
      
      emit('close', data);
    };

    // Détecte si on édite ou ajoute
    const initializeForm = () => {
      if (props.patientToEdit && Object.keys(props.patientToEdit).length) {
        modalTitle.value = "Modifier le Patient";
        Object.assign(form, props.patientToEdit);

        // Extraire contact urgence
        if (props.patientToEdit.field_contact_d_urgence) {
          const parts = props.patientToEdit.field_contact_d_urgence.split(' - ');
          nameUrgence.value = parts[0] || '';
          phoneUrgence.value = parts[1] || '';
        }
      } else {
        modalTitle.value = "Ajouter un patient";
        resetForm();
      }
    };

    watch(() => props.patientToEdit, initializeForm, { immediate: true });

    return {
      form,
      errors,
      modalTitle,
      handleSubmit,
      closeModal,
      validateForm,
      nameUrgence,
      phoneUrgence,
    };
  }
}
</script>
