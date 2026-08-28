<template>
    <div id="add-customer-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Ajouter un nouveau client</h3>
                        <button @click="$emit('close-add-customer-modal')" class="text-gray-400 hover:text-gray-600">
                            <div class="w-6 h-6 flex items-center justify-center">
                                <i class="ri-close-line text-xl"></i>
                            </div>
                        </button>
                    </div>

                    <form @submit.prevent="submitClientForm" id="add-customer-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                            <input type="text" v-model="form.title" @input="validateTitle" required :class="['w-full px-3 py-2 border !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm',
                                titleError ? 'border-red-500' : 'border-gray-300']" placeholder="Ex: Rakoto Andry">
                            <p v-if="titleError" class="mt-1 text-sm text-red-500">{{ titleError }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Âge</label>
                            <input type="number" v-model="form.field_age" @input="validateAge" min="0" max="120"
                                step="1" :class="['w-full px-3 py-2 border !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm',
                                    ageError ? 'border-red-500' : 'border-gray-300']" placeholder="Ex: 35">
                            <p v-if="ageError" class="mt-1 text-sm text-red-500">{{ ageError }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                            <div class="grid grid-cols-2 gap-3">
                                <label
                                    class="relative flex items-center justify-center px-4 py-2 border !rounded-button cursor-pointer transition-all"
                                    :class="form.field_sexe === 'masculin'
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'border-gray-300 hover:bg-gray-50'">
                                    <input type="radio" value="masculin" v-model="form.field_sexe"
                                        class="absolute opacity-0">
                                    <div class="flex items-center gap-2">
                                        <i class="ri-mars-line text-lg"></i>
                                        <span class="text-sm font-medium">Masculin</span>
                                    </div>
                                </label>

                                <label
                                    class="relative flex items-center justify-center px-4 py-2 border !rounded-button cursor-pointer transition-all"
                                    :class="form.field_sexe === 'feminin'
                                        ? 'bg-pink-50 border-pink-500 text-pink-700'
                                        : 'border-gray-300 hover:bg-gray-50'">
                                    <input type="radio" value="feminin" v-model="form.field_sexe"
                                        class="absolute opacity-0">
                                    <div class="flex items-center gap-2">
                                        <i class="ri-venus-line text-lg"></i>
                                        <span class="text-sm font-medium">Féminin</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                            <input type="text" v-model="form.field_adresse"
                                class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                placeholder="Ex: 123 Rue de la Liberté">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                            <input type="tel" v-model="form.field_phone"
                                class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                placeholder="Ex: +261 34 12 345 67">
                        </div>

                        <div class="flex items-center space-x-2">
                            <label class="text-sm text-gray-700">
                                <input type="checkbox" :checked="form.field_assurance === 1"
                                    @change="form.field_assurance = $event.target.checked ? 1 : 0"
                                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                                Ce client a une assurance</label>
                        </div>

                        <div class="flex space-x-3 mt-6">
                            <button type="button" @click="$emit('close-add-customer-modal')"
                                class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button font-medium whitespace-nowrap">
                                Annuler
                            </button>
                            <button type="submit" :disabled="!!titleError || !!ageError || !form.title || store.loading"
                                class="flex-1 px-4 py-2 bg-secondary text-white hover:bg-green-600 !rounded-button font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <i v-if="store.loading" class="ri-loader-4-line animate-spin"></i>
                                <span>{{ store.loading ? 'Enregistrement...' : 'Enregistrer' }}</span>
                            </button>
                        </div>
                    </form>

                    <p v-if="store.loading" class="mt-2 text-sm text-gray-500">Enregistrement en cours...</p>
                    <p v-if="store.error" class="mt-2 text-sm text-red-500">Erreur : {{ store.error.message }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useClientStore } from "../../stores/index.js";
import { toast } from "vue-sonner";

export default {
    setup(props, { emit }) {
        const store = useClientStore();
        const titleError = ref("");
        const ageError = ref("");

        const form = reactive({
            entity_type: "node",
            bundle: "client",
            title: "",
            field_phone: "",
            field_assurance: 0,
            field_adresse: "",
            field_sexe: "masculin",
            field_age: "",
            status: 1,
        });

        const validateTitle = () => {
            if (!form.title.trim()) {
                titleError.value = "Le nom complet est requis";
            } else {
                titleError.value = "";
            }
        };

        const validateAge = () => {
            const age = Number(form.field_age);
            if (form.field_age === "" || form.field_age === null) {
                ageError.value = "";
            } else if (isNaN(age) || !Number.isInteger(age)) {
                ageError.value = "L'âge doit être un nombre entier valide";
            } else if (age < 0) {
                ageError.value = "L'âge ne peut pas être négatif";
            } else if (age > 120) {
                ageError.value = "L'âge ne peut pas dépasser 120 ans";
            } else {
                ageError.value = "";
            }
        };

        const submitClientForm = async () => {
            if (store.loading) {
                return;
            }

            validateTitle();
            validateAge();

            if (titleError.value || ageError.value) {
                return;
            }

            store.loading = true;
            try {
                await store.createClient(form);

                if (store.error) {
                    toast.error("Une erreur est survenue lors de l'ajout client.")
                    return
                }

                form.title = "";
                form.field_phone = "";
                form.field_adresse = "";
                form.field_age = "";
                form.field_sexe = "masculin";
                titleError.value = "";
                ageError.value = "";
                emit('close-add-customer-modal');
                emit('close-client-modal');
                toast.success('Client sélectionné avec succès !')
            } finally {
                store.loading = false;
            }
        };

        return { form, submitClientForm, store, titleError, validateTitle, ageError, validateAge };
    },
};
</script>

<style></style>