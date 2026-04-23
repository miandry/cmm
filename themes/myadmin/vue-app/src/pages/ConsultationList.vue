<template>
    <main class="pt-20 p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Consultations Table -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Mes consultations</h3>
                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div class="relative w-full sm:w-64" ref="searchContainer">
                                <input type="text" placeholder="Rechercher par patient..." v-model="searchKeywordClient"
                                    @input="searchByKeyword" @focus="handleFocus" @blur="handleBlur"
                                    class="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm w-full">
                                <div
                                    class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                                    <i class="ri-search-line text-gray-400"></i>
                                </div>
                                <!-- Liste déroulante des patients -->
                                <div v-if="showList" @mousedown.prevent
                                    class="absolute z-50 max-h-48 overflow-y-auto border border-gray-300 rounded-lg bg-white w-full sm:w-64 mt-1 shadow-lg"
                                    style="top: 100%; left: 0;">
                                    <!-- Loader -->
                                    <div v-if="loadingClients" class="flex flex-col items-center justify-center py-6">
                                        <div
                                            class="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin">
                                        </div>
                                        <p class="text-center text-xs text-gray-600 mt-2">Chargement...</p>
                                    </div>
                                    <div v-else-if="clientStore.clients.rows.length" class="divide-y divide-gray-100">
                                        <div v-for="(client, index) in clientStore.clients.rows" :key="index" :class="[
                                            'flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 cursor-pointer',
                                            selectedIndex === index ? 'bg-blue-50 border-primary border-l-4' : ''
                                        ]" @click="selectClient(client.nid, client.title)">
                                            <div
                                                class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium uppercase">
                                                {{ client.title.slice(0, 2) }}
                                            </div>
                                            <div class="flex-1">
                                                <p class="text-sm font-medium text-gray-900">{{ client.title }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <h3 class="text-center text-gray-400 py-2 text-xs">Aucun patient trouvé avec ce
                                            mot-clé
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div class="relative w-full sm:w-48">
                                <input type="date" placeholder="Rechercher par date" @change="filterByDate"
                                    v-model="dateValue"
                                    class="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm w-full">
                                <div
                                    class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                                    <i class="ri-calendar-line text-gray-400"></i>
                                </div>
                            </div>
                            <select v-model="statusFilter" @change="filterByStatus"
                                class="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm w-full sm:w-40 bg-white">
                                <option value="">Tous les statuts</option>
                                <option value="completed">Payé</option>
                                <option value="draft">Non payé</option>
                                <option value="cancelled">Annulée</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full mt-0">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Réf
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Patient
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Motif
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Paramètres
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <!-- Loader du tableau -->
                            <tr v-if="tableLoading">
                                <td colspan="6" class="px-6 py-12 text-center">
                                    <div class="flex flex-col items-center justify-center">
                                        <div
                                            class="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-3">
                                        </div>
                                        <p class="text-sm text-gray-500">Chargement des consultations...</p>
                                    </div>
                                </td>
                            </tr>
                            <!-- Message quand aucun résultat -->
                            <tr
                                v-else-if="!consultationsStore.consultations.rows || consultationsStore.consultations.rows.length === 0">
                                <td colspan="6" class="px-6 py-12 text-center">
                                    <div class="flex flex-col items-center justify-center">
                                        <div
                                            class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <i class="ri-stethoscope-line text-2xl text-gray-400"></i>
                                        </div>
                                        <p class="text-sm font-medium text-gray-900 mb-1">Aucune consultation trouvée
                                        </p>
                                        <p class="text-xs text-gray-500">
                                            {{ getEmptyMessage() }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <!-- Liste des consultations -->
                            <tr v-else class="hover:bg-gray-50 cursor-pointer"
                                v-for="cons in consultationsStore.consultations.rows" :key="cons.nid"
                                @click="showConsultationDetails(cons.nid)">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{{ cons.title || cons.nid }}</div>
                                    <div class="text-sm text-gray-500">
                                        {{ formatDate(null, cons.created, 'short') }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">
                                        {{ cons.field_client?.title || 'Patient inconnu' }}
                                    </div>
                                    <div class="text-sm text-gray-500">
                                        {{ getGenderLabel(cons.field_client?.field_sexe) }}
                                        {{ cons.field_client?.field_age ? cons.field_client?.field_age + " ans" : "" }}
                                        {{ cons.field_client?.field_phone ? " - " + cons.field_client?.field_phone : ""
                                        }}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-sm text-gray-900 max-w-xs truncate">
                                        {{ cons.field_motif || '-' }}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="space-y-1">
                                        <div v-if="cons.field_temperature" class="text-sm text-gray-900">
                                            <i class="ri-thermometer-line text-gray-500 mr-1"></i>
                                            {{ cons.field_temperature }}°C
                                        </div>
                                        <div v-if="cons.field_tension_arterielle" class="text-sm text-gray-900">
                                            <i class="ri-heart-pulse-line text-gray-500 mr-1"></i>
                                            {{ cons.field_tension_arterielle }} mmHg
                                        </div>
                                        <div v-if="cons.field_poids" class="text-sm text-gray-900">
                                            <i class="ri-weight-line text-gray-500 mr-1"></i>
                                            {{ cons.field_poids }} kg
                                        </div>
                                        <div v-if="!cons.field_temperature && !cons.field_tension_arterielle && !cons.field_poids"
                                            class="text-sm text-gray-400 italic">
                                            Aucun paramètre
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="[
                                        'px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit',
                                        cons.field_consultation_status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : cons.field_consultation_status === 'cancelled'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-orange-100 text-orange-800'
                                    ]">
                                        <i :class="[
                                            cons.field_consultation_status === 'completed' ? 'ri-checkbox-circle-line' 
                                            : cons.field_consultation_status === 'cancelled' ? 'ri-close-circle-fill'
                                            : 'ri-time-line',
                                            'mr-1'
                                        ]"></i>
                                        {{ cons.field_consultation_status === 'completed' ? 'Payé' : cons.field_consultation_status === 'cancelled' ? 'Annulée' : 'Non payé' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button @click.stop="printOrdonnance(cons.nid)"
                                        class="text-green-600 hover:text-green-900 transition-colors"
                                        title="Imprimer l'ordonnance">
                                        <div class="w-5 h-5 flex items-center justify-center">
                                            <i class="ri-printer-line"></i>
                                        </div>
                                    </button>
                                    <button @click.stop="showConsultationDetails(cons.nid)"
                                        class="text-blue-600 hover:text-blue-900 transition-colors"
                                        title="Voir les détails">
                                        <div class="w-5 h-5 flex items-center justify-center">
                                            <i class="ri-eye-line"></i>
                                        </div>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                        Affichage de {{ startIndex }} à {{ endIndex }} sur {{ consultationsStore.consultations.total ||
                            0 }}
                        consultations
                    </div>
                    <div class="flex items-center space-x-2">
                        <!-- Previous -->
                        <button @click="previousPage" :disabled="currentPage === 1"
                            class="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <i class="ri-arrow-left-s-line"></i>
                        </button>

                        <!-- Pages -->
                        <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                            class="px-3 py-2 rounded-md transition-colors text-sm font-medium" :class="page === currentPage
                                ? 'bg-primary text-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'">
                            {{ page }}
                        </button>

                        <!-- Next -->
                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <i class="ri-arrow-right-s-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { debounce } from 'lodash';
import { formatDate } from '../utils/formateDate.js';
import { useConsultationStore, useClientStore } from '../stores/index.js';
import { useRouter } from 'vue-router';

export default {
    name: "AllConsultations",
    setup() {
        const consultationsStore = useConsultationStore();
        const clientStore = useClientStore();
        const router = useRouter();

        // Pagination
        const perPage = 15;
        const currentPage = ref(1);
        const totalPages = computed(() => Math.ceil((consultationsStore.consultations.total || 0) / perPage));

        // Calcul des indices affichés
        const startIndex = computed(() => {
            if (!consultationsStore.consultations.rows?.length) return 0;
            return ((currentPage.value - 1) * perPage) + 1;
        });

        const endIndex = computed(() => {
            if (!consultationsStore.consultations.rows?.length) return 0;
            const end = currentPage.value * perPage;
            return Math.min(end, consultationsStore.consultations.total || 0);
        });

        // État de chargement du tableau
        const tableLoading = ref(false);
        const loadingClients = ref(false);

        // Paramètres dynamiques de la requête pour les consultations
        const consultationQueryOptions = ref({
            fields: [
                'nid',
                'title',
                'field_motif',
                'field_temperature',
                'field_tension_arterielle',
                'field_client',
                'field_consultation_status',
                'field_rendez_vous',
                'created',
                'field_docteur',
                'field_poids',
            ],
            sort: { val: 'created', op: 'desc' },
            filters: {
                status: {
                    val: 1,
                    op: "="
                },
                field_docteur: {
                    val: window.APP_DATA.user.id,
                    op: "="
                },
            },
            values: {
                field_client: ['title', 'nid', 'field_sexe', 'field_age', 'field_phone']
            },
            pager: 0,
            offset: perPage
        });

        // Paramètres pour la recherche de patients
        const clientQueryOptions = ref({
            fields: [
                'nid',
                'title',
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

        // Variables pour les filtres
        const searchKeywordClient = ref('');
        const dateValue = ref('');
        const statusFilter = ref('');
        const showList = ref(false);
        const selectedIndex = ref(null);
        const patientId = ref('');
        const searchContainer = ref(null);

        const getGenderLabel = (sexe) => {
            if (sexe === 'masculin') return 'Masculin -';
            if (sexe === 'feminin') return 'Féminin -';
            return '';
        };

        const fetchConsultationsData = async () => {
            tableLoading.value = true;
            try {
                await consultationsStore.fetchConsultations(consultationQueryOptions.value);
            } finally {
                tableLoading.value = false;
            }
        };

        const fetchClients = async () => {
            loadingClients.value = true;
            try {
                await clientStore.fetchClients(clientQueryOptions.value);
            } finally {
                loadingClients.value = false;
            }
        };

        // Convertir une date au format YYYY-MM-DD en timestamp (début et fin de journée)
        const getDateRangeTimestamps = (dateString) => {
            if (!dateString) return null;

            const startDate = new Date(dateString);
            startDate.setHours(0, 0, 0, 0);
            const startTimestamp = Math.floor(startDate.getTime() / 1000);

            const endDate = new Date(dateString);
            endDate.setHours(23, 59, 59, 999);
            const endTimestamp = Math.floor(endDate.getTime() / 1000);

            return { start: startTimestamp, end: endTimestamp };
        };

        // Message personnalisé selon les filtres actifs
        const getEmptyMessage = () => {
            if (patientId.value && dateValue.value && statusFilter.value) {
                return "Aucune consultation trouvée pour ce patient à cette date avec ce statut";
            } else if (patientId.value && dateValue.value) {
                return "Aucune consultation trouvée pour ce patient à cette date";
            } else if (patientId.value && statusFilter.value) {
                return "Aucune consultation trouvée pour ce patient avec ce statut";
            } else if (dateValue.value && statusFilter.value) {
                return "Aucune consultation trouvée pour cette date avec ce statut";
            } else if (patientId.value) {
                return "Aucune consultation trouvée pour ce patient";
            } else if (dateValue.value) {
                return "Aucune consultation trouvée pour cette date";
            } else if (statusFilter.value) {
                const statusLabels = {
                    'completed': 'payée',
                    'draft': 'non payée',
                    'cancelled': 'annulée'
                };
                const label = statusLabels[statusFilter.value] || statusFilter.value;
                return `Aucune consultation ${label} trouvée`;
            }
            return "Aucune consultation n'est disponible pour le moment";
        };

        // Pages visibles (max 5 pages)
        const visiblePages = computed(() => {
            const pages = [];
            const total = totalPages.value;
            const current = currentPage.value;

            if (total <= 5) {
                for (let i = 1; i <= total; i++) pages.push(i);
            } else {
                if (current <= 3) {
                    pages.push(1, 2, 3, 4, '...', total);
                } else if (current >= total - 2) {
                    pages.push(1, '...', total - 3, total - 2, total - 1, total);
                } else {
                    pages.push(1, '...', current - 1, current, current + 1, '...', total);
                }
            }

            return pages;
        });

        // Actions de pagination
        const goToPage = async (page) => {
            if (page === '...') return;
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
                consultationQueryOptions.value.pager = page - 1;
                await fetchConsultationsData();

                // Scroll vers le tableau
                const el = document.querySelector('.bg-white.rounded-xl.shadow-sm');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };

        const nextPage = async () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
                consultationQueryOptions.value.pager = currentPage.value - 1;
                await fetchConsultationsData();

                const el = document.querySelector('.bg-white.rounded-xl.shadow-sm');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };

        const previousPage = async () => {
            if (currentPage.value > 1) {
                currentPage.value--;
                consultationQueryOptions.value.pager = currentPage.value - 1;
                await fetchConsultationsData();

                const el = document.querySelector('.bg-white.rounded-xl.shadow-sm');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };

        // Gestion du focus
        const handleFocus = () => {
            showList.value = true;
            if (searchKeywordClient.value.trim() !== '') {
                loadingClients.value = true;
                debouncedFetch();
            } else {
                clientStore.clients.rows = [];
            }
        };

        // Recherche par mot-clé (patient)
        const searchByKeyword = () => {
            if (searchKeywordClient.value.trim() !== '') {
                loadingClients.value = true;
                debouncedFetch();
            } else {
                showList.value = false;
                clientStore.clients.rows = [];
                delete consultationQueryOptions.value.filters.field_client;
                patientId.value = '';
                currentPage.value = 1;
                consultationQueryOptions.value.pager = 0;
                fetchConsultationsData();
            }
        };

        const debouncedFetch = debounce(async () => {
            if (searchKeywordClient.value.trim() === '') {
                loadingClients.value = false;
                return;
            }
            updateClientFilter('title', searchKeywordClient.value, 'CONTAINS');
            await fetchClients();
            loadingClients.value = false;
            showList.value = true;
        }, 500);

        const selectClient = async (nid, name) => {
            searchKeywordClient.value = name;
            patientId.value = nid;
            showList.value = false;
            updateFilter('field_client', patientId.value, '=');
            currentPage.value = 1;
            consultationQueryOptions.value.pager = 0;
            await fetchConsultationsData();
        };

        const updateClientFilter = (key, value, op = '=') => {
            if (!value) delete clientQueryOptions.value.filters[key];
            else clientQueryOptions.value.filters[key] = { val: value, op };
        };

        const updateFilter = (key, value, op = '=') => {
            if (!value) delete consultationQueryOptions.value.filters[key];
            else consultationQueryOptions.value.filters[key] = { val: value, op };
        };

        // Filtre par date avec gestion des timestamps
        const filterByDate = () => {
            consultationQueryOptions.value.pager = 0;
            currentPage.value = 1;

            if (dateValue.value) {
                const dateRange = getDateRangeTimestamps(dateValue.value);
                consultationQueryOptions.value.filters.created = {
                    val: [dateRange.start, dateRange.end],
                    op: "BETWEEN"
                };
            } else {
                delete consultationQueryOptions.value.filters.created;
            }

            fetchConsultationsData();
        };

        // Filtre par statut
        const filterByStatus = () => {
            consultationQueryOptions.value.pager = 0;
            currentPage.value = 1;

            if (statusFilter.value) {
                updateFilter('field_consultation_status', statusFilter.value, '=');
            } else {
                delete consultationQueryOptions.value.filters.field_consultation_status;
            }

            fetchConsultationsData();
        };

        const handleBlur = (event) => {
            setTimeout(() => {
                const activeElement = document.activeElement;
                if (searchContainer.value && !searchContainer.value.contains(activeElement)) {
                    showList.value = false;
                }
            }, 200);
        };

        // Redirection vers les détails de la consultation
        const showConsultationDetails = (consultationId) => {
            router.push({
                name: 'consultation.details',
                query: {
                    id: consultationId
                }
            });
        };

        // Impression de l'ordonnance
        const printOrdonnance = (nid) => {
            router.push({
                name: 'ordonnance',
                query: {
                    key: nid,
                }
            });
        };

        onMounted(async () => {
            await fetchConsultationsData();
        });

        return {
            consultationsStore,
            clientStore,
            formatDate,
            getGenderLabel,
            // Recherche
            searchKeywordClient,
            searchByKeyword,
            showList,
            loadingClients,
            selectedIndex,
            selectClient,
            handleBlur,
            handleFocus,
            searchContainer,
            // Filtres
            dateValue,
            statusFilter,
            filterByDate,
            filterByStatus,
            // État du tableau
            tableLoading,
            getEmptyMessage,
            // Pagination
            currentPage,
            totalPages,
            visiblePages,
            goToPage,
            nextPage,
            previousPage,
            startIndex,
            endIndex,
            // Actions
            showConsultationDetails,
            printOrdonnance,
        };
    }
}
</script>

<style scoped>
.bg-primary {
    background-color: #3b82f6;
}

.text-primary {
    color: #3b82f6;
}

.border-primary {
    border-color: #3b82f6;
}

/* Animation pour le spinner */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>