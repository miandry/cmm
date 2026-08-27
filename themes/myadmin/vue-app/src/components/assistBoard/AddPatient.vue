<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div class="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-900">Ajouter un patient</h3>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <i class="ri-close-line text-2xl"></i>
                </button>
            </div>
            <div class="px-6 py-3">
                <form @submit.prevent="handleSave">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Nom complet <span class="text-red-500">*</span>
                            </label>
                            <input type="text" placeholder="Nom du patient" v-model="form.title"
                                @input="clearFieldError('title')" :disabled="saving"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-colors"
                                :class="{ 'border-red-500 focus:ring-red-500': errors.title, 'bg-gray-50': saving }">
                            <p v-if="errors.title" class="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <i class="ri-error-warning-line"></i>
                                {{ errors.title }}
                            </p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Âge <span class="text-red-500">*</span>
                            </label>
                            <input type="number" placeholder="Âge du patient" v-model="form.field_age"
                                @input="clearFieldError('field_age')" :disabled="saving" min="0" max="120" step="1"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-colors"
                                :class="{ 'border-red-500 focus:ring-red-500': errors.field_age, 'bg-gray-50': saving }">
                            <p v-if="errors.field_age" class="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <i class="ri-error-warning-line"></i>
                                {{ errors.field_age }}
                            </p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Sexe <span class="text-red-500">*</span>
                            </label>
                            <div class="grid grid-cols-2 gap-3">
                                <label
                                    class="relative flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all"
                                    :class="[
                                        form.field_sexe === 'masculin'
                                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                                            : 'border-gray-300 hover:bg-gray-50',
                                        saving ? 'opacity-50 cursor-not-allowed' : ''
                                    ]">
                                    <input type="radio" value="masculin" v-model="form.field_sexe" :disabled="saving"
                                        class="absolute opacity-0">
                                    <div class="flex items-center gap-2">
                                        <i class="ri-mars-line text-lg"></i>
                                        <span class="text-sm font-medium">Masculin</span>
                                    </div>
                                </label>

                                <label
                                    class="relative flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all"
                                    :class="[
                                        form.field_sexe === 'feminin'
                                            ? 'bg-pink-50 border-pink-500 text-pink-700'
                                            : 'border-gray-300 hover:bg-gray-50',
                                        saving ? 'opacity-50 cursor-not-allowed' : ''
                                    ]">
                                    <input type="radio" value="feminin" v-model="form.field_sexe" :disabled="saving"
                                        class="absolute opacity-0">
                                    <div class="flex items-center gap-2">
                                        <i class="ri-venus-line text-lg"></i>
                                        <span class="text-sm font-medium">Féminin</span>
                                    </div>
                                </label>
                            </div>
                            <p v-if="errors.field_sexe" class="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <i class="ri-error-warning-line"></i>
                                {{ errors.field_sexe }}
                            </p>
                        </div>

                        <div class="mt-4">
                            <label for="field_adresse" class="block text-sm font-medium text-gray-700">Adresse</label>
                            <input type="text" id="field_adresse" v-model="form.field_adresse" :disabled="saving"
                            placeholder="Lot 3k Antanimena, Antananarivo"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-colors"
                                :class="[errors.field_adresse ? 'border-red-500' : 'border-gray-300']">
                            <p v-if="errors.field_adresse" class="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <i class="ri-error-warning-line"></i>
                                {{ errors.field_adresse }}
                            </p>
                        </div>

                        <div class="mt-4">
                            <label for="field_phone" class="block text-sm font-medium text-gray-700">Téléphone</label>
                            <input type="text" id="field_phone" v-model="form.field_phone" :disabled="saving"
                                placeholder="034 xx xxx xx"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-colors"
                                :class="[errors.field_phone ? 'border-red-500' : 'border-gray-300']">
                            <p v-if="errors.field_phone" class="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <i class="ri-error-warning-line"></i>
                                {{ errors.field_phone }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end gap-3">
                        <button type="button" @click="closeModal" :disabled="saving"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Annuler
                        </button>
                        <button type="submit" :disabled="saving"
                            class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            <i v-if="saving" class="ri-loader-4-line animate-spin"></i>
                            {{ saving ? 'Ajout en cours...' : 'Ajouter le patient' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useClientStore } from '../../stores/index.js';
import { toast } from 'vue-sonner';

export default {
    name: "AddPatient",
    setup(_, { emit }) {
        const clientStore = useClientStore();
        const saving = ref(false);

        const form = reactive({
            entity_type: "node",
            bundle: "client",
            status: 1,
            title: "",
            field_sexe: "masculin",
            field_age: "",
            field_adresse: "",
            field_phone: "",
        });

        // Errors state
        const errors = reactive({
            title: '',
            field_sexe: '',
            field_age: '',
            field_adresse: '',
            field_phone: '',
        });

        // Clear specific field error
        const clearFieldError = (field) => {
            if (errors[field]) {
                errors[field] = '';
            }
        };

        // Clear all errors
        const clearAllErrors = () => {
            errors.title = '';
            errors.field_sexe = '';
            errors.field_age = '';
            errors.field_adresse = '';
            errors.field_phone = '';
        };

        // Validation function
        const validateForm = () => {
            clearAllErrors();
            let isValid = true;

            // Validate name
            const trimmedTitle = form.title?.trim();
            if (!trimmedTitle) {
                errors.title = 'Le nom du patient est requis';
                isValid = false;
            } else if (trimmedTitle.length < 2) {
                errors.title = 'Le nom doit contenir au moins 2 caractères';
                isValid = false;
            } else if (trimmedTitle.length > 100) {
                errors.title = 'Le nom ne peut pas dépasser 100 caractères';
                isValid = false;
            }

            // Validate age
            const age = Number(form.field_age);
            if (!form.field_age && form.field_age !== 0) {
                errors.field_age = 'L\'âge est requis';
                isValid = false;
            } else if (isNaN(age)) {
                errors.field_age = 'L\'âge doit être un nombre valide';
                isValid = false;
            } else if (!Number.isInteger(age)) {
                errors.field_age = 'L\'âge doit être un nombre entier';
                isValid = false;
            } else if (age < 0) {
                errors.field_age = 'L\'âge ne peut pas être négatif';
                isValid = false;
            } else if (age > 120) {
                errors.field_age = 'L\'âge ne peut pas dépasser 120 ans';
                isValid = false;
            }

            // Validate sex
            if (!form.field_sexe) {
                errors.field_sexe = 'Le sexe est requis';
                isValid = false;
            } else if (!['masculin', 'feminin'].includes(form.field_sexe)) {
                errors.field_sexe = 'Veuillez sélectionner un sexe valide';
                isValid = false;
            }

            return isValid;
        };

        // Reset form
        const resetForm = () => {
            form.title = "";
            form.field_age = "";
            form.field_sexe = "masculin";
            form.field_adresse = "";
            form.field_phone = "";
            clearAllErrors();
        };

        // Close modal with reset
        const closeModal = () => {
            resetForm();
            emit('close-patient');
        };

        const handleSave = async () => {
            // Run validations
            if (!validateForm()) {
                // Scroll to first error
                const firstError = document.querySelector('.border-red-500');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            saving.value = true;

            try {
                // Préparer les données avec le nom nettoyé
                const formDataToSave = {
                    ...form,
                    title: form.title.trim(),
                    field_age: parseInt(form.field_age),
                };

                const response = await clientStore.createClient(formDataToSave);

                if (clientStore.error) {
                    toast.error(clientStore.error || "Une erreur est survenue lors de l'ajout du patient.");
                    return;
                }

                toast.success('Patient ajouté avec succès !', {
                    duration: 3000,
                    icon: '🎉'
                });

                // Émettre l'événement avec les données du patient créé
                const nouveauPatient = clientStore.client || response;
                emit('patient-created', nouveauPatient);

                // Fermer la modal
                closeModal();
            } catch (error) {
                console.error('Error creating patient:', error);
                toast.error("Une erreur est survenue lors de l'ajout du patient.", {
                    duration: 4000
                });
            } finally {
                saving.value = false;
            }
        };

        return {
            form,
            errors,
            saving,
            handleSave,
            clearFieldError,
            closeModal,
        };
    }
}
</script>

<style scoped>
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Transition pour les boutons radio */
label {
    transition: all 0.2s ease;
}

label:active {
    transform: scale(0.98);
}

/* Style pour les champs désactivés */
input:disabled {
    cursor: not-allowed;
}
</style>