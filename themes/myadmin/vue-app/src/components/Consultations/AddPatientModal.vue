<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 z-60" v-if="isAddOpen">
        <PageLoader v-if="loader" />
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Ajouter un nouveau patient</h3>
                        <button @click="$emit('hideAddModal')" class="text-gray-400 hover:text-gray-600 cursor-pointer">
                            <div class="w-6 h-6 flex items-center justify-center">
                                <i class="ri-close-line text-xl"></i>
                            </div>
                        </button>
                    </div>
                    <form class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet <span
                                    class="text-red-500">*</span></label>
                            <input type="text" v-model="form.title"
                                class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                placeholder="Ex: Marie Andriamampionona">
                            <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Âge <span
                                        class="text-red-500">*</span></label>
                                <input type="number" v-model="form.field_age"
                                    class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    placeholder="34">
                                <p v-if="errors.field_age" class="text-red-500 text-xs mt-1">{{ errors.field_age }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                                <select id="patient-blood-type" v-model="form.field_sexe"
                                    class="w-full px-3 py-2 pr-8 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                                    <option :value="'masculin'">Masculin</option>
                                    <option :value="'feminin'">Féminin</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone <span
                                    class="text-red-500">*</span></label>
                            <input type="tel" v-model="form.field_phone"
                                class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                placeholder="Ex: +261 34 87 654 32">
                            <p v-if="errors.field_phone" class="text-red-500 text-xs mt-1">{{ errors.field_phone }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Allergies connues</label>
                            <input type="text" v-model="form.field_allergies"
                                class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                placeholder="Ex: Pénicilline, Aspirine">
                        </div>
                        <div class="flex items-center space-x-2">
                            <label class="text-sm text-gray-700">
                                <input type="checkbox" :checked="form.field_assurance === 1"
                                    @change="form.field_assurance = $event.target.checked ? 1 : 0"
                                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                                Ce patient a une
                                assurance</label>
                        </div>
                    </form>
                    <div class="flex space-x-3 mt-6">
                        <button @click="$emit('hideAddModal')"
                            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button font-medium whitespace-nowrap cursor-pointer">
                            Annuler
                        </button>
                        <button @click.prevent="submitClientForm"
                            class="flex-1 px-4 py-2 bg-secondary text-white hover:bg-green-600 !rounded-button font-medium whitespace-nowrap cursor-pointer">
                            Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useClientStore } from "../../stores/index.js";
import { toast } from "vue-sonner";
import PageLoader from "../PageLoader.vue";

export default {
    name: "AddPatientModal",
    components: {
        PageLoader,
    },
    props: {
        isAddOpen: {
            type: Boolean,
        }
    },
    emits: ['hideAddModal', 'hideParentModal'],
    setup(props, { emit }) {
        const store = useClientStore();
        const loader = ref(false);
        const errors = reactive({
            title: "",
            field_age: "",
            field_phone: ""
        });

        const validateForm = () => {
            let valid = true;
            errors.title = form.title.trim() ? "" : "Le nom est requis.";
            errors.field_age = form.field_age ? "" : "L'âge est requis.";
            errors.field_phone = form.field_phone.trim() ? "" : "Le téléphone est requis.";
            if (!form.title.trim() || !form.field_age || !form.field_phone.trim()) valid = false;
            return valid;
        };

        const form = reactive({
            entity_type: "node",
            bundle: "client",
            title: "",
            field_phone: "",
            field_assurance: 0,
            status: 1,
            field_adresse: "",
            field_allergies: "",
            field_sexe: "masculin",
            field_age: "",
        });

        const submitClientForm = async () => {
            try {
                loader.value = true;
                if (!validateForm()) return;
                store.loading = true;
                await store.createClient(form, 'consultations');
    
                if (store.error) {
                    toast.error("Une erreur est survenue lors de l'ajout client.")
                    return
                }
    
                // reset form
                form.title = "";
                form.field_phone = "";
                form.field_age = "";
                form.field_allergies = "";
                form.field_assurance = 0;
                form.field_sexe = "masculin";
                // fermer modal si c'est ok
                emit('hideAddModal');
                emit('hideParentModal');  
                toast.success('Client sélectionné avec succès !')              
            } catch (error) {
                toast.error("Une erreur est survenue lors de l'ajout client.")
            } finally {
                loader.value = false;
            }
        };

        return { form, submitClientForm, store, errors, loader };
    },
}
</script>

<style></style>