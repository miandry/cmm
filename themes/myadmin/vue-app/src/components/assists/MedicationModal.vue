<template>
    <!-- Medication Selection Modal -->
    <div v-show="show" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 md:p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div class="p-4 md:p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Sélectionner un médicament</h3>
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
                                <input type="text" v-model="medicationNameSearch" @input="onSearch"
                                    placeholder="Rechercher un médicament..."
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                            </div>

                            <div class="max-h-64 overflow-y-auto border border-gray-300 !rounded-button">
                                <div id="medication-list" class="divide-y divide-gray-100">

                                    <!-- Loader -->
                                    <div v-if="loading" class="flex flex-col items-center justify-center py-6">
                                        <div
                                            class="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin">
                                        </div>
                                        <p class="text-center text-xs text-gray-600 mt-2">Chargement...</p>
                                    </div>

                                    <!-- Liste des médicaments si non vide -->
                                    <div v-else-if="store.articles.rows.length > 0">
                                        <div v-for="(medication, index) in store.articles.rows" :key="index" :class="[
                                            'flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 cursor-pointer medication-item border-t-0',
                                            selectedIndex === index ? 'bg-blue-50 border-primary border-l-4' : ''
                                        ]" @click="selectMedication(medication, index)">
                                            <div
                                                class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium uppercase">
                                                <i class="ri-capsule-line text-sm"></i>
                                            </div>
                                            <div class="flex-1">
                                                <p class="text-sm font-medium text-gray-900">
                                                    {{ medication.title }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Aucun médicament trouvé -->
                                    <div v-else-if="store.articles.rows.length <= 0 && medicationNameSearch !== ''"
                                        class="flex flex-col items-center justify-center py-6 text-gray-500 text-xs">
                                        Aucun médicament trouvé.
                                    </div>

                                    <!-- Aucune recherche effectuée -->
                                    <div v-if="medicationNameSearch === '' && !loading && store.articles.rows.length === 0"
                                        class="flex flex-col items-center justify-center py-6 text-gray-500 text-xs">
                                        <i class="ri-capsule-line text-2xl mb-2"></i>
                                        <p>Commencez à taper pour rechercher un médicament</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex space-x-3">
                        <button @click="closeModal"
                            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button font-medium whitespace-nowrap">
                            Annuler
                        </button>
                        <button @click="confirmSelectedMedication" :disabled="!selectedMedication"
                            class="flex-1 px-4 py-2 bg-primary text-white hover:bg-blue-600 !rounded-button font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                            Confirmer
                        </button>
                    </div>
                </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useArticleStore } from '../../stores/index.js';
import { toast } from 'vue-sonner';
import { debounce } from 'lodash';

export default {
    name: "MedicationModal",
    props: {
        show: {
            type: Boolean,
            required: true
        }
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {
        const store = useArticleStore();

        // États pour la recherche
        const selectedMedication = ref(null);
        const selectedIndex = ref(null);
        const medicationNameSearch = ref('');
        const loading = ref(false);

        // Paramètres dynamiques de la requête
        const queryOptions = ref({
            fields: [
                'nid',
                'title',
            ],
            sort: { val: 'title', op: 'asc' },
            filters: {},
            pager: 0,
            offset: 50
        });

        const fetchMedications = async () => {
            await store.fetchArticles(queryOptions.value);
            loading.value = false;
        };

        const confirmSelectedMedication = async () => {
            if (!selectedMedication.value) {
                toast.warning('Veuillez sélectionner un médicament');
                return;
            }

            // Formater les données pour le composant parent
            const medicationData = {
                nid: selectedMedication.value.nid,
                name: selectedMedication.value.title,
            };

            emit('save', medicationData);
            emit('close');
        };

        const onSearch = () => {
            if (medicationNameSearch.value.length >= 2) {
                loading.value = true;
                debouncedFetch();
            } else if (medicationNameSearch.value === '') {
                // Réinitialiser les résultats si le champ est vide
                queryOptions.value.filters = {};
                fetchMedications();
            }
        };

        const debouncedFetch = debounce(() => {
            updateFilter('title', medicationNameSearch.value, 'CONTAINS');
            fetchMedications();
        }, 600);

        const updateFilter = (key, value, op = '=') => {
            if (!value) delete queryOptions.value.filters[key];
            else queryOptions.value.filters[key] = { val: value, op };
        };

        const selectMedication = (medication, index) => {
            selectedMedication.value = medication;
            selectedIndex.value = index;
        };

        // Fermeture modale
        const closeModal = () => {
            selectedMedication.value = null;
            selectedIndex.value = null;
            medicationNameSearch.value = '';
            queryOptions.value.filters = {};
            emit('close');
        };

        return {
            store,
            selectedMedication,
            selectedIndex,
            medicationNameSearch,
            loading,
            onSearch,
            selectMedication,
            confirmSelectedMedication,
            closeModal,
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

.medication-item {
    transition: all 0.2s ease;
}

.medication-item:hover {
    background-color: #f9fafb;
}
</style>