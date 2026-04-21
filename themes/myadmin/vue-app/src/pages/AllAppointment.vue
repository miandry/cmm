<template>
    <main class="pt-20 p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Appointments Table -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Mes rendez-vous</h3>
                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <!-- Filtre par statut -->
                            <div class="relative w-full sm:w-48">
                                <select v-model="selectedStatusFilter" @change="filterByStatus"
                                    class="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm w-full bg-white">
                                    <option value="">Tous les statuts</option>
                                    <option value="pending">En attente</option>
                                    <option value="in_process">En cours</option>
                                    <option value="completed">Terminé</option>
                                    <option value="cancelled">Annulé</option>
                                </select>
                                <div
                                    class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                                    <i class="ri-filter-line text-gray-400"></i>
                                </div>
                            </div>
                            <div class="relative w-full sm:w-48" ref="searchContainer">
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
                        </div>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full mt-0">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ref
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Patient
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Paramètres
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Notes
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
                                <td colspan="5" class="px-6 py-12 text-center">
                                    <div class="flex flex-col items-center justify-center">
                                        <div
                                            class="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-3">
                                        </div>
                                        <p class="text-sm text-gray-500">Chargement des rendez-vous...</p>
                                    </div>
                                </td>
                            </tr>
                            <!-- Message quand aucun résultat -->
                            <tr
                                v-else-if="!appointmentStore.appointments.rows || appointmentStore.appointments.rows.length === 0">
                                <td colspan="5" class="px-6 py-12 text-center">
                                    <div class="flex flex-col items-center justify-center">
                                        <div
                                            class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <i class="ri-calendar-2-line text-2xl text-gray-400"></i>
                                        </div>
                                        <p class="text-sm font-medium text-gray-900 mb-1">Aucun rendez-vous trouvé</p>
                                        <p class="text-xs text-gray-500">
                                            {{ getEmptyMessage() }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <!-- Liste des rendez-vous -->
                            <tr v-else class="hover:bg-gray-50" v-for="app in appointmentStore.appointments.rows"
                                :key="app.nid">
                                <!-- Colonne Ref + Statut -->
                                <td class="px-6 py-4">
                                    <div class="text-sm font-medium text-gray-900">{{ app.title }}</div>
                                    <div class="text-sm font-medium text-gray-500">Le: {{ formatDate(null, app.created,
                                        'short') }}</div>
                                    <!-- Badge de statut avec icône et couleur -->
                                    <div class="mt-2">
                                        <div :class="getStatusClass(app.field_app_status)"
                                            class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium">
                                            <i :class="getStatusIcon(app.field_app_status)" class="text-xs"></i>
                                            <span>{{ getStatusLabel(app.field_app_status) }}</span>
                                        </div>
                                    </div>
                                </td>

                                <!-- Colonne Patient -->
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{{ app.field_patient?.title }}</div>
                                    <div class="text-sm text-gray-500">
                                        {{ getGenderLabel(app.field_patient?.field_sexe) }}
                                        {{ app.field_patient?.field_age ? app.field_patient?.field_age + " ans" : "" }}
                                        {{ app.field_patient?.field_phone ? " - " + app.field_patient?.field_phone : ""
                                        }}
                                    </div>
                                </td>

                                <!-- Colonne Paramètres (Poids, Température, Tension) -->
                                <td class="px-6 py-4 text-sm text-gray-900">
                                    <div class="space-y-1">
                                        <div v-if="app.field_poids" class="flex items-center gap-2">
                                            <i class="ri-weight-line text-gray-400 text-xs"></i>
                                            <span class="text-sm">Poids: {{ app.field_poids }} kg</span>
                                        </div>
                                        <div v-else class="flex items-center gap-2 text-gray-400">
                                            <i class="ri-weight-line text-xs"></i>
                                            <span class="text-xs">Poids: --</span>
                                        </div>

                                        <div v-if="app.field_temperature" class="flex items-center gap-2">
                                            <i class="ri-temperature-line text-gray-400 text-xs"></i>
                                            <span class="text-sm">Temp: {{ app.field_temperature }} °C</span>
                                        </div>
                                        <div v-else class="flex items-center gap-2 text-gray-400">
                                            <i class="ri-temperature-line text-xs"></i>
                                            <span class="text-xs">Temp: --</span>
                                        </div>

                                        <div v-if="app.field_tension_arterielle" class="flex items-center gap-2">
                                            <i class="ri-heart-pulse-line text-gray-400 text-xs"></i>
                                            <span class="text-sm">Tension: {{ app.field_tension_arterielle }}
                                                mmHg</span>
                                        </div>
                                        <div v-else class="flex items-center gap-2 text-gray-400">
                                            <i class="ri-heart-pulse-line text-xs"></i>
                                            <span class="text-xs">Tension: --</span>
                                        </div>
                                    </div>
                                </td>

                                <!-- Colonne Notes -->
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ app.field_notes || '---' }}
                                </td>

                                <!-- Colonne Actions -->
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                    <button @click.stop="openStatusModal(app)"
                                        class="text-amber-600 hover:text-amber-900 transition-colors"
                                        title="Changer le statut">
                                        <i class="ri-exchange-line text-lg"></i>
                                    </button>
                                    <button @click.stop="goToConsultation(app)" v-if="app.field_app_consultation"
                                        class="text-blue-600 hover:text-blue-900 transition-colors"
                                        title="Voir la consultation">
                                        <i class="ri-eye-line text-lg"></i>
                                    </button>
                                    <button @click.stop="goToConsultation(app)" v-else
                                        class="text-blue-600 hover:text-blue-900 transition-colors"
                                        title="Consulter le rendez-vous">
                                        <i class="ri-stethoscope-line text-lg"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                        Affichage de {{ startIndex }} à {{ endIndex }} sur {{ appointmentStore.appointments.total || 0
                        }}
                        rendez-vous
                    </div>
                    <div class="flex items-center space-x-2">
                        <button @click="previousPage" :disabled="currentPage === 1"
                            class="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <i class="ri-arrow-left-s-line"></i>
                        </button>
                        <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                            class="px-3 py-2 rounded-md transition-colors text-sm font-medium" :class="page === currentPage
                                ? 'bg-primary text-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'">
                            {{ page }}
                        </button>
                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <i class="ri-arrow-right-s-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal pour changer le statut - Version centrée -->
        <div v-if="showStatusModal" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen p-4">
                <!-- Overlay -->
                <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

                <!-- Modal content -->
                <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all">
                    <div class="px-6 pt-6 pb-4">
                        <div class="flex items-start justify-between">
                            <h3 class="text-lg font-medium leading-6 text-gray-900">
                                Changer le statut du rendez-vous
                            </h3>
                            <button @click="closeStatusModal" class="text-gray-400 hover:text-gray-500">
                                <i class="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <div class="mt-4">
                            <p class="text-sm text-gray-500 mb-4">
                                Référence: <span class="font-medium text-gray-900">{{ getAppointmentTitle() }}</span>
                            </p>
                            <div class="space-y-3">
                                <label
                                    class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    :class="{ 'border-primary bg-blue-50': selectedStatus === 'pending' }">
                                    <input type="radio" value="pending" v-model="selectedStatus"
                                        class="w-4 h-4 text-primary focus:ring-primary">
                                    <div class="ml-3 flex items-center gap-2">
                                        <i class="ri-time-line text-yellow-600"></i>
                                        <span class="text-sm text-gray-900">En attente</span>
                                    </div>
                                </label>
                                <label
                                    class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    :class="{ 'border-primary bg-blue-50': selectedStatus === 'in_process' }">
                                    <input type="radio" value="in_process" v-model="selectedStatus"
                                        class="w-4 h-4 text-primary focus:ring-primary">
                                    <div class="ml-3 flex items-center gap-2">
                                        <i class="ri-time-line text-blue-600"></i>
                                        <span class="text-sm text-gray-900">En cours</span>
                                    </div>
                                </label>
                                <label
                                    class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    :class="{ 'border-primary bg-green-50': selectedStatus === 'completed' }">
                                    <input type="radio" value="completed" v-model="selectedStatus"
                                        class="w-4 h-4 text-primary focus:ring-primary">
                                    <div class="ml-3 flex items-center gap-2">
                                        <i class="ri-checkbox-circle-line text-green-600"></i>
                                        <span class="text-sm text-gray-900">Terminé</span>
                                    </div>
                                </label>
                                <label
                                    class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    :class="{ 'border-primary bg-red-50': selectedStatus === 'cancelled' }">
                                    <input type="radio" value="cancelled" v-model="selectedStatus"
                                        class="w-4 h-4 text-primary focus:ring-primary">
                                    <div class="ml-3 flex items-center gap-2">
                                        <i class="ri-close-circle-line text-red-600"></i>
                                        <span class="text-sm text-gray-900">Annulé</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="px-6 py-4 bg-gray-50 sm:flex sm:flex-row-reverse gap-3 rounded-b-lg">
                        <button @click="updateStatus" :disabled="updatingStatus"
                            class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                            <i v-if="updatingStatus" class="ri-loader-4-line animate-spin mr-2"></i>
                            {{ updatingStatus ? 'Mise à jour...' : 'Enregistrer' }}
                        </button>
                        <button @click="closeStatusModal"
                            class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm">
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { onMounted, ref, computed, watch } from 'vue';
import { debounce } from 'lodash';
import { formatDate } from '../utils/formateDate.js';
import { useAppointmentStore, useClientStore } from '../stores/index.js';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

export default {
    name: "AllAppointment",
    setup() {
        const appointmentStore = useAppointmentStore();
        const clientStore = useClientStore();
        const router = useRouter();

        // Modal status
        const showStatusModal = ref(false);
        const selectedAppointment = ref(null);
        const selectedStatus = ref('');
        const updatingStatus = ref(false);

        // Filtre statut
        const selectedStatusFilter = ref('pending');

        // Pagination
        const perPage = 20;
        const currentPage = ref(1);
        const totalPages = computed(() => Math.ceil((appointmentStore.appointments.total || 0) / perPage));

        // Calcul des indices affichés
        const startIndex = computed(() => {
            if (!appointmentStore.appointments.rows?.length) return 0;
            return ((currentPage.value - 1) * perPage) + 1;
        });

        const endIndex = computed(() => {
            if (!appointmentStore.appointments.rows?.length) return 0;
            const end = currentPage.value * perPage;
            return Math.min(end, appointmentStore.appointments.total || 0);
        });

        // État de chargement du tableau
        const tableLoading = ref(false);
        const loadingClients = ref(false);

        // Paramètres dynamiques de la requête pour les rendez-vous
        const appointmentQueryOptions = ref({
            fields: [
                'nid',
                'title',
                'field_patient',
                'field_notes',
                'field_medecin',
                'field_montant',
                'field_poids',
                'field_temperature',
                'field_tension_arterielle',
                'field_app_status',
                'field_app_consultation',
                'status',
                'created',
            ],
            sort: { val: 'nid', op: 'desc' },
            filters: {
                status: {
                    val: 1,
                    op: "="
                },
                field_medecin: {
                    val: window.APP_DATA.user.id,
                    op: "="
                },
                field_app_status: {
                    val: 'pending',
                    op: "="
                },
            },
            values: {
                field_patient: ['title', 'nid', 'field_sexe', 'field_age', 'field_phone'],
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

        // Variables pour la recherche
        const searchKeywordClient = ref('');
        const dateValue = ref('');
        const showList = ref(false);
        const selectedIndex = ref(null);
        const patientId = ref('');
        const searchContainer = ref(null);

        // ============================================================
        // FONCTIONS POUR L'AFFICHAGE DU STATUT
        // ============================================================

        const getStatusLabel = (status) => {
            const statusMap = {
                'pending': 'En attente',
                'in_process': 'En cours',
                'completed': 'Terminé',
                'cancelled': 'Annulé'
            };
            return statusMap[status] || status || 'Non défini';
        };

        const getStatusClass = (status) => {
            const classMap = {
                'pending': 'bg-yellow-100 text-yellow-800',
                'in_process': 'bg-blue-100 text-blue-800',
                'completed': 'bg-green-100 text-green-800',
                'cancelled': 'bg-red-100 text-red-800'
            };
            return classMap[status] || 'bg-gray-100 text-gray-800';
        };

        const getStatusIcon = (status) => {
            const iconMap = {
                'pending': 'ri-time-line',
                'in_process': 'ri-time-line',
                'completed': 'ri-checkbox-circle-line',
                'cancelled': 'ri-close-circle-line'
            };
            return iconMap[status] || 'ri-question-line';
        };

        // ============================================================

        const getGenderLabel = (sexe) => {
            if (sexe === 'masculin') return 'Masculin -';
            if (sexe === 'feminin') return 'Féminin -';
            return '';
        };

        const fetchAppointmentsData = async (append = false) => {
            tableLoading.value = true;
            try {
                await appointmentStore.fetchAppointments(appointmentQueryOptions.value, append);
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

        const getEmptyMessage = () => {
            if (patientId.value && dateValue.value) {
                return "Aucun rendez-vous trouvé pour ce patient à cette date";
            } else if (patientId.value) {
                return "Aucun rendez-vous trouvé pour ce patient";
            } else if (dateValue.value) {
                return "Aucun rendez-vous trouvé pour cette date";
            } else if (selectedStatusFilter.value) {
                return `Aucun rendez-vous avec le statut "${getStatusLabel(selectedStatusFilter.value)}"`;
            }
            return "Aucun rendez-vous n'est disponible pour le moment";
        };

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

        const goToPage = async (page) => {
            if (page === '...') return;
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
                appointmentQueryOptions.value.pager = page - 1;
                await fetchAppointmentsData(false);
                const el = document.querySelector('.bg-white.rounded-xl.shadow-sm');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };

        const nextPage = async () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
                appointmentQueryOptions.value.pager = currentPage.value - 1;
                await fetchAppointmentsData(false);
                const el = document.querySelector('.bg-white.rounded-xl.shadow-sm');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };

        const previousPage = async () => {
            if (currentPage.value > 1) {
                currentPage.value--;
                appointmentQueryOptions.value.pager = currentPage.value - 1;
                await fetchAppointmentsData(false);
                const el = document.querySelector('.bg-white.rounded-xl.shadow-sm');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };

        const handleFocus = () => {
            showList.value = true;
            if (searchKeywordClient.value.trim() !== '') {
                loadingClients.value = true;
                debouncedFetch();
            } else {
                clientStore.clients.rows = [];
            }
        };

        const searchByKeyword = () => {
            if (searchKeywordClient.value.trim() !== '') {
                loadingClients.value = true;
                debouncedFetch();
            } else {
                showList.value = false;
                clientStore.clients.rows = [];
                delete appointmentQueryOptions.value.filters.field_patient;
                patientId.value = '';
                currentPage.value = 1;
                appointmentQueryOptions.value.pager = 0;
                fetchAppointmentsData(false);
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
            updateFilter('field_patient', patientId.value, '=');
            currentPage.value = 1;
            appointmentQueryOptions.value.pager = 0;
            await fetchAppointmentsData(false);
        };

        const updateClientFilter = (key, value, op = '=') => {
            if (!value) delete clientQueryOptions.value.filters[key];
            else clientQueryOptions.value.filters[key] = { val: value, op };
        };

        const updateFilter = (key, value, op = '=') => {
            if (!value) delete appointmentQueryOptions.value.filters[key];
            else appointmentQueryOptions.value.filters[key] = { val: value, op };
        };

        const filterByDate = () => {
            appointmentQueryOptions.value.pager = 0;
            currentPage.value = 1;
            if (dateValue.value) {
                const dateRange = getDateRangeTimestamps(dateValue.value);
                appointmentQueryOptions.value.filters.created = {
                    val: [dateRange.start, dateRange.end],
                    op: "BETWEEN"
                };
            } else {
                delete appointmentQueryOptions.value.filters.created;
            }
            fetchAppointmentsData(false);
        };

        // Filtre par statut
        const filterByStatus = () => {
            appointmentQueryOptions.value.pager = 0;
            currentPage.value = 1;

            if (selectedStatusFilter.value) {
                updateFilter('field_app_status', selectedStatusFilter.value, '=');
            } else {
                delete appointmentQueryOptions.value.filters.field_app_status;
            }

            fetchAppointmentsData(false);
        };

        const handleBlur = (event) => {
            setTimeout(() => {
                const activeElement = document.activeElement;
                if (searchContainer.value && !searchContainer.value.contains(activeElement)) {
                    showList.value = false;
                }
            }, 200);
        };

        const goToConsultation = async (appointment) => {
            if (!appointment?.field_app_consultation) {
                await appointmentStore.createAppointment({
                    entity_type: "node",
                    bundle: "rendez_vous_medical",
                    nid: appointment.nid,
                    field_app_status: 'in_process'
                });
                if (appointmentStore.error) {
                    toast.error('Un problème est survenu. Veuillez réessayer.');
                    return;
                }
                router.push({
                    path: '/consultations',
                    query: {
                        appointment: appointment.nid,
                    }
                });
            } else {
                router.push({
                    name: 'consultation.details',
                    query: {
                        id: appointment.field_app_consultation.nid
                    }
                });
            }
        };

        // Récupérer le titre du rendez-vous sélectionné
        const getAppointmentTitle = () => {
            if (!selectedAppointment.value) return '';
            const appointment = appointmentStore.appointments.rows.find(a => a.nid === selectedAppointment.value);
            return appointment?.title || selectedAppointment.value;
        };

        // Gestion du modal de statut
        const openStatusModal = (appointment) => {
            selectedAppointment.value = appointment.nid;
            selectedStatus.value = appointment.field_app_status || 'pending';
            showStatusModal.value = true;
        };

        const closeStatusModal = () => {
            showStatusModal.value = false;
            selectedAppointment.value = null;
            selectedStatus.value = '';
        };

        const updateStatus = async () => {
            if (!selectedAppointment.value || !selectedStatus.value) return;

            updatingStatus.value = true;
            try {
                const updateData = {
                    entity_type: "node",
                    bundle: "rendez_vous_medical",
                    nid: selectedAppointment.value,
                    field_app_status: selectedStatus.value
                };

                await appointmentStore.createAppointment(updateData);

                // Mettre à jour localement
                const appointment = appointmentStore.appointments.rows.find(a => a.nid === selectedAppointment.value);
                if (appointment) {
                    appointment.field_app_status = selectedStatus.value;
                }

                closeStatusModal();
            } catch (error) {
                console.error('Erreur lors de la mise à jour du statut:', error);
            } finally {
                updatingStatus.value = false;
            }
        };

        onMounted(async () => {
            await fetchAppointmentsData();
        });

        return {
            appointmentStore,
            clientStore,
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
            dateValue,
            filterByDate,
            formatDate,
            tableLoading,
            getEmptyMessage,
            currentPage,
            totalPages,
            visiblePages,
            goToPage,
            nextPage,
            previousPage,
            startIndex,
            endIndex,
            goToConsultation,
            // Statut
            getStatusLabel,
            getStatusClass,
            getStatusIcon,
            // Filtre statut
            selectedStatusFilter,
            filterByStatus,
            // Modal
            showStatusModal,
            selectedAppointment,
            selectedStatus,
            updatingStatus,
            openStatusModal,
            closeStatusModal,
            updateStatus,
            getAppointmentTitle,
        };
    }
}
</script>

<style scoped>
.relative {
    position: relative;
}

.absolute {
    position: absolute;
}

.z-50 {
    z-index: 50;
}

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