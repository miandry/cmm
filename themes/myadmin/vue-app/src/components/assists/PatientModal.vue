<template>
    <!-- Patient Selection Modal -->
    <div v-show="show" class="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Sélectionner un patient</h3>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                            <div class="w-6 h-6 flex items-center justify-center">
                                <i class="ri-close-line text-xl"></i>
                            </div>
                        </button>
                    </div>

                    <div class="mb-4">
                        <div>
                            <div class="relative mb-3">
                                <div
                                    class="w-4 h-4 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <i class="ri-search-line text-sm"></i>
                                </div>
                                <input type="text" v-model="patientNameSearch" @input="onSearch"
                                    placeholder="Rechercher un patient..."
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                            </div>

                            <div class="max-h-64 overflow-y-auto border border-gray-300 !rounded-button">
                                <div id="patient-list" class="divide-y divide-gray-100">

                                    <!-- Loader -->
                                    <div v-if="loading" class="flex flex-col items-center justify-center py-6">
                                        <div
                                            class="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin">
                                        </div>
                                        <p class="text-center text-xs text-gray-600 mt-2">Chargement...</p>
                                    </div>

                                    <!-- Liste des patients si non vide -->
                                    <div v-else-if="store.clients.rows.length > 0">
                                        <div v-for="(patient, index) in store.clients.rows" :key="index" :class="[
                                            'flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 cursor-pointer patient-item border-t-0',
                                            selectedIndex === index ? 'bg-blue-50 border-primary border-l-4' : ''
                                        ]" @click="selectPatient(patient, index)">
                                            <div
                                                class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium uppercase">
                                                {{ patient.title?.slice(0, 2) || 'P' }}
                                            </div>
                                            <div class="flex-1">
                                                <p class="text-sm font-medium text-gray-900">
                                                    {{ patient.title }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Aucun patient trouvé -->
                                    <div v-else-if="store.clients.rows.length <= 0 && patientNameSearch !== ''"
                                        class="flex flex-col items-center justify-center py-6 text-gray-500 text-xs">
                                        Aucun patient trouvé.
                                    </div>

                                    <!-- Aucune recherche effectuée -->
                                    <div v-if="patientNameSearch === '' && !loading && store.clients.rows.length === 0"
                                        class="flex flex-col items-center justify-center py-6 text-gray-500 text-xs">
                                        <i class="ri-user-search-line text-2xl mb-2"></i>
                                        <p>Commencez à taper pour rechercher un patient</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex space-x-3">
                        <button @click="confirmSelectedPatient" :disabled="!selectedPatient"
                            class="flex-1 px-4 py-2 bg-primary text-white hover:bg-blue-600 !rounded-button font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                            Confirmer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useClientStore } from '../../stores/index.js';
import { toast } from 'vue-sonner';
import { debounce } from 'lodash';

export default {
    name: "PatientModal",
    props: {
        show: {
            type: Boolean,
            required: true
        }
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {
        const store = useClientStore();

        // États pour la recherche
        const selectedPatient = ref(null);
        const selectedIndex = ref(null);
        const patientNameSearch = ref('');
        const loading = ref(false);

        // Paramètres dynamiques de la requête
        const queryOptions = ref({
            fields: [
                'nid',
                'title',
                'field_age',
                'field_sexe',
                'field_allergies',
            ],
            sort: { val: 'title', op: 'asc' },
            filters: {},
            pager: 0,
            offset: 50
        });

        const fetchPatients = async () => {
            await store.fetchClients(queryOptions.value);
            loading.value = false;
        };

        const confirmSelectedPatient = async () => {
            if (!selectedPatient.value) {
                toast.warning('Veuillez sélectionner un patient');
                return;
            }

            loading.value = true;
            await store.fetchClients(selectedPatient.value);
            loading.value = false;

            if (store.error) {
                toast.error("Une erreur est survenue lors de la sélection du patient.");
                return;
            }
            
            // Formater les données pour le composant parent
            const patientData = {
                nid: selectedPatient.value.nid,
                name: selectedPatient.value.title || '',
                age: selectedPatient.value.field_age || null,
                gender: selectedPatient.value.field_sexe || '',
                allergies: selectedPatient.value.field_allergies || '',
            };

            emit('save', patientData);
            emit('close');
        };

        const onSearch = () => {
            if (patientNameSearch.value.length >= 2) {
                loading.value = true;
                debouncedFetch();
            } else if (patientNameSearch.value === '') {
                // Réinitialiser les résultats si le champ est vide
                queryOptions.value.filters = {};
                fetchPatients();
            }
        };

        const debouncedFetch = debounce(() => {
            updateFilter('title', patientNameSearch.value, 'CONTAINS');
            fetchPatients();
        }, 600);

        const updateFilter = (key, value, op = '=') => {
            if (!value) delete queryOptions.value.filters[key];
            else queryOptions.value.filters[key] = { val: value, op };
        };

        const selectPatient = (patient, index) => {
            selectedPatient.value = patient;
            selectedIndex.value = index;
        };

        // Fermeture modale principale
        const closeModal = () => {
            selectedPatient.value = null;
            selectedIndex.value = null;
            patientNameSearch.value = '';
            queryOptions.value.filters = {};
            emit('close');
        };

        return {
            store,
            selectedPatient,
            selectedIndex,
            patientNameSearch,
            loading,
            onSearch,
            selectPatient,
            confirmSelectedPatient,
            closeModal
        };
    }
};
</script>

<style>
.border-primary {
    border-color: rgb(59, 130, 246, 1) !important;
}

.border-t-0 {
    border-top-width: 0px !important;
}

.patient-item {
    transition: all 0.2s ease;
}

.patient-item:hover {
    background-color: #f9fafb;
}
</style>