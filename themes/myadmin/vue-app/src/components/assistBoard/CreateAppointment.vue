<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-900">Ajouter un rendez-vous</h3>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                    <i class="ri-close-line text-2xl"></i>
                </button>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Rechercher un patient <span class="text-red-500">*</span>
                            <button type="button" @click="openPatientModal"
                                class="ml-2 text-sm text-green-600 hover:text-green-700 inline-flex items-center gap-1">
                                <i class="ri-user-add-line"></i> Nouveau patient
                            </button>
                        </label>
                        <div class="relative">
                            <input type="text" placeholder="Nom du patient..." v-model="patientNameSearch"
                                @input="onSearchPatient" @blur="closeSuggestions" :disabled="saving" :class="[
                                    'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm',
                                    errors.patient ? 'border-red-500' : 'border-gray-300',
                                    saving ? 'bg-gray-50' : ''
                                ]">
                            <div
                                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                                <i class="ri-search-line text-gray-400"></i>
                            </div>

                            <!-- Liste des patients suggérés -->
                            <div v-if="showPatientSuggestions && (filteredPatients.length > 0 || patientNameSearch)"
                                class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                <div v-if="loadingPatients" class="flex items-center justify-center py-3">
                                    <div
                                        class="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin">
                                    </div>
                                </div>
                                <div v-else-if="filteredPatients.length > 0">
                                    <div v-for="patient in filteredPatients" :key="patient.nid"
                                        @click="selectPatient(patient)"
                                        class="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                                        <div class="flex items-center space-x-3">
                                            <div
                                                class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium uppercase">
                                                {{ patient.title?.slice(0, 2) || '??' }}
                                            </div>
                                            <div class="flex-1">
                                                <p class="text-sm font-medium text-gray-900">{{ patient.title }}</p>
                                                <p class="text-xs text-gray-500">
                                                    {{ patient.field_phone || 'Pas de téléphone' }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="px-3 py-3 text-center text-sm text-gray-500">
                                    Aucun patient trouvé
                                </div>
                            </div>
                        </div>
                        <p v-if="errors.patient" class="mt-1 text-sm text-red-500 flex items-center gap-1">
                            <i class="ri-error-warning-line"></i>
                            {{ errors.patient }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Médecin spécialiste <span class="text-red-500">*</span>
                            <span v-if="loadingDoctors" class="ml-2 inline-flex items-center text-xs text-gray-500">
                                <i class="ri-loader-4-line animate-spin mr-1"></i>
                                Chargement...
                            </span>
                        </label>
                        <div class="relative">
                            <select v-model="form.field_medecin" @change="clearFieldError('medecin')"
                                :disabled="saving || loadingDoctors" :class="[
                                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white',
                                    errors.medecin ? 'border-red-500' : 'border-gray-300',
                                    (saving || loadingDoctors) ? 'bg-gray-50' : ''
                                ]">
                                <option value="">Sélectionner un médecin...</option>
                                <option v-for="doctor in formattedDoctors" :key="doctor.uid" :value="doctor.uid">
                                    {{ doctor.name }} - {{ doctor.field_specialite?.title ||
                                        doctor.field_specialite?.field_specialite_medicale }}
                                </option>
                            </select>
                            <div v-if="loadingDoctors" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <i class="ri-loader-4-line animate-spin text-gray-400"></i>
                            </div>
                            <p v-if="errors.medecin" class="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <i class="ri-error-warning-line"></i>
                                {{ errors.medecin }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Patient sélectionné affiché -->
                <div v-if="selectedPatient" class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium uppercase">
                                {{ selectedPatient.title?.slice(0, 2) || '??' }}
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-900">{{ selectedPatient.title }}</p>
                                <p class="text-xs text-gray-600">
                                    {{ getPatientGenderLabel(selectedPatient.field_sexe) }}
                                    {{ selectedPatient.field_age ? `- ${selectedPatient.field_age} ans` : '' }}
                                </p>
                                <p v-if="selectedPatient.field_phone" class="text-xs text-gray-500">
                                    <i class="ri-phone-line"></i> {{ selectedPatient.field_phone }}
                                </p>
                            </div>
                        </div>
                        <button @click="clearSelectedPatient" :disabled="saving"
                            class="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
                            <i class="ri-close-line text-lg"></i>
                        </button>
                    </div>
                </div>

                <div class="mt-4 hidden">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Prix de consultation <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                        <input type="number" step="100" placeholder="0" v-model="form.field_montant"
                            @input="clearFieldError('montant')" :disabled="saving" :class="[
                                'w-full pl-4 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm',
                                errors.montant ? 'border-red-500' : 'border-gray-300',
                                saving ? 'bg-gray-50' : ''
                            ]">
                        <div
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                            Ar
                        </div>
                        <p v-if="errors.montant" class="mt-1 text-sm text-red-500 flex items-center gap-1">
                            <i class="ri-error-warning-line"></i>
                            {{ errors.montant }}
                        </p>
                    </div>
                </div>

                <!-- SECTION PARAMÈTRES MÉDICAUX (NON REQUIS) -->
                <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Température
                        </label>
                        <div class="relative">
                            <input type="number" placeholder="36.5" v-model="form.field_temperature" :disabled="saving"
                                :class="[
                                    'w-full pl-4 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm',
                                    saving ? 'bg-gray-50' : 'border-gray-300'
                                ]">
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                °C
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Tension artérielle
                        </label>
                        <input type="text" placeholder="Ex: 120/80" v-model="form.field_tension_arterielle"
                            :disabled="saving" :class="[
                                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm',
                                saving ? 'bg-gray-50' : 'border-gray-300'
                            ]">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Poids
                        </label>
                        <div class="relative">
                            <input type="number" placeholder="53" v-model="form.field_poids" :disabled="saving" :class="[
                                'w-full pl-4 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm',
                                saving ? 'bg-gray-50' : 'border-gray-300'
                            ]">
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                kg
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea rows="3" placeholder="Ajouter des notes sur le rendez-vous..." v-model="form.field_notes"
                        :disabled="saving"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm resize-none"
                        :class="saving ? 'bg-gray-50' : ''"></textarea>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                    <button @click="closeModal" :disabled="saving"
                        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Annuler
                    </button>
                    <button @click="handleSave" :disabled="saving || loadingDoctors"
                        class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        <i v-if="saving" class="ri-loader-4-line animate-spin"></i>
                        {{ saving ? 'Création...' : 'Créer le rendez-vous' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, ref, computed, onUnmounted } from 'vue';
import { useAppointmentStore, useUserStore, useClientStore } from '../../stores/index.js';
import { debounce } from 'lodash';
import { toast } from 'vue-sonner';

export default {
    name: "CreateAppointment",
    setup(props, { emit }) {
        const appointmentStore = useAppointmentStore();
        const userStore = useUserStore();
        const clientStore = useClientStore();

        // États de chargement
        const saving = ref(false);
        const loadingDoctors = ref(false);
        const doctorsLoaded = ref(false);

        // Patient selection state
        const selectedPatient = ref(null);
        const patientNameSearch = ref('');
        const showPatientSuggestions = ref(false);
        const loadingPatients = ref(false);

        // Errors state
        const errors = reactive({
            patient: '',
            medecin: '',
            montant: ''
        });

        // Paramètres dynamiques de la requête pour les patients
        const patientQueryOptions = ref({
            fields: [
                'nid',
                'title',
                'field_sexe',
                'field_age',
                'field_phone'
            ],
            sort: { val: 'nid', op: 'desc' },
            filters: {
                status: {
                    val: 1,
                    op: "="
                }
            },
            pager: 0,
            offset: 10
        });

        // Charger les médecins une seule fois en utilisant le store partagé
        const loadDoctorsOnce = async () => {
            // Si déjà chargé, ne rien faire
            if (doctorsLoaded.value) return;

            // Vérifier si les médecins sont déjà dans le store
            const existingDoctors = userStore.users.rows?.filter(user =>
                user.roles && user.roles.includes('docteur')
            );

            if (existingDoctors && existingDoctors.length > 0) {
                doctorsLoaded.value = true;
                return;
            }

            // Sinon, charger les médecins
            loadingDoctors.value = true;
            try {
                const doctorQueryOptions = {
                    fields: ['uid', 'name', 'field_specialite', 'status', 'roles'],
                    sort: { val: 'name', op: 'asc' },
                    filters: {
                        roles: { val: "docteur", op: "=" },
                        status: { val: 1, op: "=" }
                    },
                    values: {
                        field_specialite: ['nid', 'field_specialite_medicale', 'field_montant_consultation', 'title']
                    },
                    pager: 0,
                    offset: 100
                };
                await userStore.fetchUsers(doctorQueryOptions);
                doctorsLoaded.value = true;
            } catch (err) {
                toast.error('Erreur lors du chargement des médecins');
            } finally {
                loadingDoctors.value = false;
            }
        };

        const fetchPatients = async () => {
            try {
                await clientStore.fetchClients(patientQueryOptions.value);
            } catch (err) {
                toast.error('Erreur lors du chargement des patients');
            } finally {
                loadingPatients.value = false;
            }
        };

        const onSearchPatient = () => {
            loadingPatients.value = true;
            showPatientSuggestions.value = true;
            if (errors.patient) {
                errors.patient = '';
            }
            debouncedFetchPatients();
        };

        const debouncedFetchPatients = debounce(() => {
            updatePatientFilter('title', patientNameSearch.value, 'CONTAINS');
            fetchPatients();
        }, 600);

        const updatePatientFilter = (key, value, op = '=') => {
            if (!value || value.trim() === '') {
                delete patientQueryOptions.value.filters[key];
            } else {
                patientQueryOptions.value.filters[key] = { val: value, op };
            }
        };

        const selectPatient = (patient) => {
            selectedPatient.value = patient;
            form.field_patient = patient.nid;
            patientNameSearch.value = patient.title;
            showPatientSuggestions.value = false;
            if (errors.patient) {
                errors.patient = '';
            }
        };

        const selectNewPatient = (patient) => {
            if (patient) {
                const formattedPatient = {
                    nid: patient.nid || patient.id,
                    title: patient.title,
                    field_sexe: patient.field_sexe,
                    field_age: patient.field_age,
                    field_phone: patient.field_phone || ''
                };
                selectPatient(formattedPatient);
                toast.success('Patient sélectionné automatiquement');
            }
        };

        const clearSelectedPatient = () => {
            selectedPatient.value = null;
            form.field_patient = '';
            patientNameSearch.value = '';
            if (!form.field_patient) {
                errors.patient = 'Veuillez sélectionner un patient';
            }
        };

        const openPatientModal = () => {
            emit('open-patient');
        };

        const clearFieldError = (field) => {
            if (errors[field]) {
                errors[field] = '';
            }
        };

        const getPatientGenderLabel = (sexe) => {
            if (sexe === 'feminin') return 'Féminin';
            if (sexe === 'masculin') return 'Masculin';
            return 'Genre non spécifié';
        };

        const validateForm = () => {
            let isValid = true;

            errors.patient = '';
            errors.medecin = '';
            // errors.montant = '';

            if (!form.field_patient) {
                errors.patient = 'Veuillez sélectionner un patient';
                isValid = false;
            }

            if (!form.field_medecin) {
                errors.medecin = 'Veuillez sélectionner un médecin spécialiste';
                isValid = false;
            }

            // if (!form.field_montant) {
            //     errors.montant = 'Veuillez saisir le prix de consultation';
            //     isValid = false;
            // } else {
            //     const montant = parseFloat(form.field_montant);
            //     if (isNaN(montant) || montant <= 0) {
            //         errors.montant = 'Veuillez saisir un montant valide (supérieur à 0)';
            //         isValid = false;
            //     } else if (montant > 1000000) {
            //         errors.montant = 'Le montant ne peut pas dépasser 1 000 000 Ar';
            //         isValid = false;
            //     }
            // }

            return isValid;
        };

        const resetForm = () => {
            form.title = "rdv-" + Date.now();
            form.field_patient = '';
            form.field_notes = '';
            form.field_medecin = '';
            form.field_montant = '';
            form.field_poids = '';
            form.field_temperature = '';
            form.field_tension_arterielle = '';
            selectedPatient.value = null;
            patientNameSearch.value = '';
            errors.patient = '';
            errors.medecin = '';
            errors.montant = '';
        };

        const closeModal = () => {
            resetForm();
            emit('close-create-appointment');
        };

        const form = reactive({
            entity_type: "node",
            bundle: "rendez_vous_medical",
            title: "rdv-" + Date.now(),
            field_patient: '',
            field_notes: '',
            field_medecin: '',
            field_montant: '',
            field_app_status: 'pending',
            field_poids: '',
            field_temperature: '',
            field_tension_arterielle: '',
            status: 1,
        });

        const handleSave = async () => {
            if (!validateForm()) {
                const firstError = document.querySelector('.border-red-500');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            saving.value = true;

            try {
                const formDataToSave = {
                    ...form,
                    field_montant: parseFloat(form.field_montant)
                };

                await appointmentStore.createAppointment(formDataToSave);

                if (appointmentStore.error) {
                    toast.error(appointmentStore.error || 'Une erreur est survenue lors de la création du rendez-vous');
                    return;
                }

                toast.success('Rendez-vous créé avec succès !');

                // Émettre l'événement avant de fermer la modal
                emit('appointment-created');

                closeModal();
            } catch (error) {
                toast.error('Une erreur est survenue lors de la création du rendez-vous');
            } finally {
                saving.value = false;
            }
        };

        const filteredPatients = computed(() => {
            return clientStore.clients.rows || [];
        });

        // Médecins formatés avec leurs spécialités - filtre à partir du store partagé
        const formattedDoctors = computed(() => {
            const allUsers = userStore.users.rows || [];
            // Filtrer les médecins actifs avec rôle docteur
            const doctors = allUsers.filter(user =>
                user.roles &&
                user.roles.includes('docteur') &&
                user.status === '1'
            );
            return doctors;
        });

        const closeSuggestions = () => {
            setTimeout(() => {
                showPatientSuggestions.value = false;
            }, 200);
        };

        onMounted(async () => {
            await loadDoctorsOnce();
        });

        onUnmounted(() => {
            debouncedFetchPatients.cancel();
        });

        return {
            userStore,
            clientStore,
            form,
            errors,
            saving,
            loadingDoctors,
            getPatientGenderLabel,
            handleSave,
            validateForm,
            clearFieldError,
            selectedPatient,
            patientNameSearch,
            showPatientSuggestions,
            loadingPatients,
            filteredPatients,
            formattedDoctors,
            onSearchPatient,
            selectPatient,
            selectNewPatient,
            clearSelectedPatient,
            openPatientModal,
            closeSuggestions,
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
</style>