<template>
    <!-- Appointments Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Rendez-vous du jour</h3>
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <!-- Filtre par médecin -->
                    <div class="relative w-full sm:w-48">
                        <select v-model="selectedDoctorId" @change="filterByDoctor"
                            class="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm w-full bg-white">
                            <option value="">Tous les médecins</option>
                            <option v-for="doctor in userStore.users.rows" :key="doctor.uid" :value="doctor.uid">
                                Dr. {{ doctor.name }}
                            </option>
                        </select>
                        <div
                            class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                            <i class="ri-user-star-line text-gray-400"></i>
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
                                <h3 class="text-center text-gray-400 py-2 text-xs">Aucun patient trouvé avec ce mot-clé
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full mt-0">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ref
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Médecin
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Paramètres
                        </th>
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden">
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
                                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
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
                        <!-- Première colonne: Ref + Statut -->
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">{{ app.title }}</div>
                            <div class="text-sm font-medium text-gray-500">Le: {{ formatDate(null, app.created, 'short')
                            }}</div>
                            <!-- Badge de statut avec icône et couleur -->
                            <div class="mt-2">
                                <div :class="getStatusClass(app.field_app_status)"
                                    class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium">
                                    <i :class="getStatusIcon(app.field_app_status)" class="text-xs"></i>
                                    <span>{{ getStatusLabel(app.field_app_status) }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">{{ app.field_patient.title }}</div>
                            <div class="text-sm text-gray-500">
                                {{ getGenderLabel(app.field_patient?.field_sexe) }}
                                {{ app.field_patient?.field_age ? app.field_patient?.field_age + " ans" : "" }}
                                {{ app.field_patient?.field_phone ? " - " + app.field_patient?.field_phone : "" }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">Dr. {{ app.field_medecin.name }}</div>
                            <div class="text-sm text-yellow-700">{{ app.field_medecin?.field_specialite?.title }}</div>
                        </td>
                            <!-- Colonne Paramètres avec Poids, Température et Tension -->
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
                                    <span class="text-sm">Tension: {{ app.field_tension_arterielle }} mmHg</span>
                                </div>
                                <div v-else class="flex items-center gap-2 text-gray-400">
                                    <i class="ri-heart-pulse-line text-xs"></i>
                                    <span class="text-xs">Tension: --</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 hidden">
                            <button class="text-blue-600 hover:text-blue-900">
                                <div class="w-4 h-4 flex items-center justify-center"><i class="ri-edit-line"></i></div>
                            </button>
                            <button class="text-red-600 hover:text-red-900">
                                <div class="w-4 h-4 flex items-center justify-center"><i class="ri-delete-bin-line"></i>
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
                Affichage de {{ startIndex }} à {{ endIndex }} sur {{ appointmentStore.appointments.total || 0 }}
                rendez-vous
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
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { useAppointmentStore, useClientStore, useUserStore } from '../../stores/index';
import { debounce } from 'lodash';
import { formatDate } from '../../utils/formateDate.js';

export default {
    name: "AppointmentTable",
    setup() {
        const appointmentStore = useAppointmentStore();
        const clientStore = useClientStore();
        const userStore = useUserStore();

        // Filtre médecin
        const selectedDoctorId = ref('')

        // Pagination
        const perPage = 10;
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

        // Obtenir les timestamps pour aujourd'hui
        const getTodayTimestamps = () => {
            const today = new Date();
            const startDate = new Date(today);
            startDate.setHours(0, 0, 0, 0);
            const startTimestamp = Math.floor(startDate.getTime() / 1000);

            const endDate = new Date(today);
            endDate.setHours(23, 59, 59, 999);
            const endTimestamp = Math.floor(endDate.getTime() / 1000);

            return { start: startTimestamp, end: endTimestamp };
        };

        // Paramètres dynamiques de la requête pour les rendez-vous
        const todayTimestamps = getTodayTimestamps();
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
                'status',
                'created',
            ],
            sort: { val: 'nid', op: 'desc' },
            filters: {
                status: {
                    val: 1,
                    op: "="
                },
                created: {
                    val: [todayTimestamps.start, todayTimestamps.end],
                    op: "BETWEEN"
                }
            },
            values: {
                field_patient: ['title', 'nid', 'field_sexe', 'field_age', 'field_phone'],
                field_medecin: ['uid', 'name', 'field_specialite']
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
        const showList = ref(false);
        const selectedIndex = ref(null);
        const patientId = ref('');
        const searchContainer = ref(null);

        const getGenderLabel = (sexe) => {
            if (sexe === 'masculin') return 'Masculin -';
            if (sexe === 'feminin') return 'Féminin -';
            return '';
        };

        // ============================================================
        // FONCTIONS POUR L'AFFICHAGE DU STATUT
        // ============================================================

        /**
         * Retourne le libellé affiché pour un statut donné
         */
        const getStatusLabel = (status) => {
            const statusMap = {
                'pending': 'En attente',
                'in_process': 'En cours',
                'completed': 'Terminé',
                'cancelled': 'Annulé'
            };
            return statusMap[status] || status || 'Non défini';
        };

        /**
         * Retourne les classes CSS pour la couleur du badge selon le statut
         */
        const getStatusClass = (status) => {
            const classMap = {
                'pending': 'bg-yellow-100 text-yellow-800',
                'in_process': 'bg-blue-100 text-blue-800',
                'completed': 'bg-green-100 text-green-800',
                'cancelled': 'bg-red-100 text-red-800'
            };
            return classMap[status] || 'bg-gray-100 text-gray-800';
        };

        /**
         * Retourne l'icône Remix Icon correspondant au statut
         */
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
        // FIN DES FONCTIONS POUR LE STATUT
        // ============================================================

        const fetchAppointmentsData = async () => {
            tableLoading.value = true;
            try {
                await appointmentStore.fetchAppointments(appointmentQueryOptions.value);
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

        // Message personnalisé selon les filtres actifs
        const getEmptyMessage = () => {
            if (patientId.value) {
                return "Aucun rendez-vous trouvé pour ce patient aujourd'hui";
            }
            return "Aucun rendez-vous n'est disponible pour aujourd'hui";
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
                appointmentQueryOptions.value.pager = page - 1;
                await fetchAppointmentsData();

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
                appointmentQueryOptions.value.pager = currentPage.value - 1;
                await fetchAppointmentsData();

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
                await fetchAppointmentsData();

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
                delete appointmentQueryOptions.value.filters.field_patient;
                patientId.value = '';
                currentPage.value = 1;
                appointmentQueryOptions.value.pager = 0;
                fetchAppointmentsData();
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
            await fetchAppointmentsData();
        };

        const updateClientFilter = (key, value, op = '=') => {
            if (!value) delete clientQueryOptions.value.filters[key];
            else clientQueryOptions.value.filters[key] = { val: value, op };
        };

        const updateFilter = (key, value, op = '=') => {
            if (!value) delete appointmentQueryOptions.value.filters[key];
            else appointmentQueryOptions.value.filters[key] = { val: value, op };
        };

        const handleBlur = (event) => {
            setTimeout(() => {
                const activeElement = document.activeElement;
                if (searchContainer.value && !searchContainer.value.contains(activeElement)) {
                    showList.value = false;
                }
            }, 200);
        };

        // Filtre par médecin
        const filterByDoctor = () => {
            currentPage.value = 1;
            appointmentQueryOptions.value.pager = 0;

            if (selectedDoctorId.value) {
                updateFilter('field_medecin', selectedDoctorId.value, '=');
            } else {
                delete appointmentQueryOptions.value.filters.field_medecin;
            }

            fetchAppointmentsData();
        };

        // AppointmentTable
        const refreshAppointments = async () => {
            // Réinitialiser la page à 1
            currentPage.value = 1;
            appointmentQueryOptions.value.pager = 0;

            // Recharger les données
            await fetchAppointmentsData();
        };

        const loadDoctors = async () => {
            // Vérifier si les médecins sont déjà chargés
            if (userStore.users.rows && userStore.users.rows.length > 0) {
                return;
            }
        };

        onMounted(async () => {
            await loadDoctors();
            await fetchAppointmentsData();
        });

        return {
            appointmentStore,
            clientStore,
            userStore,
            getGenderLabel,
            // Recherche
            searchKeywordClient,
            searchByKeyword,
            filterByDoctor,
            selectedDoctorId,
            showList,
            loadingClients,
            selectedIndex,
            selectClient,
            handleBlur,
            handleFocus,
            searchContainer,
            formatDate,
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
            refreshAppointments,
            // Fonctions pour le statut
            getStatusLabel,
            getStatusClass,
            getStatusIcon,
        };
    }
}
</script>

<style scoped>
/* Assurer que la liste déroulante est bien positionnée */
.relative {
    position: relative;
}

.absolute {
    position: absolute;
}

.z-50 {
    z-index: 50;
}
</style>