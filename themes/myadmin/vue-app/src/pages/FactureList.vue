<template>
    <main class="pt-20 p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Invoices Table -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Liste des factures</h3>
                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div class="relative w-full sm:w-48">
                                <input type="text" placeholder="Rechercher par référence..."
                                    v-model="searchKeywordReference" @input="searchByReference"
                                    class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                                <div
                                    class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                                    <i class="ri-barcode-line text-gray-400"></i>
                                </div>
                            </div>
                            <div class="relative w-full sm:w-48">
                                <input type="text" placeholder="Rechercher par patient..."
                                    v-model="searchKeywordPatient" @input="searchByKeyword"
                                    class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                                <div
                                    class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                                    <i class="ri-search-line text-gray-400"></i>
                                </div>
                            </div>
                            <div class="relative w-full sm:w-48">
                                <input type="date" placeholder="Rechercher par date" @change="filterByDate"
                                    v-model="dateValue"
                                    class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm">
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
                                    Réf.
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Patient
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Montant total
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
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
                                        <p class="text-sm text-gray-500">Chargement des factures...</p>
                                    </div>
                                </td>
                            </tr>
                            <!-- Message quand aucun résultat -->
                            <tr v-else-if="!invoiceStore.invoices.rows || invoiceStore.invoices.rows.length === 0">
                                <td colspan="5" class="px-6 py-12 text-center">
                                    <div class="flex flex-col items-center justify-center">
                                        <div
                                            class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <i class="ri-file-text-line text-2xl text-gray-400"></i>
                                        </div>
                                        <p class="text-sm font-medium text-gray-900 mb-1">Aucune facture trouvée</p>
                                        <p class="text-xs text-gray-500">
                                            {{ getEmptyMessage() }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <!-- Liste des factures -->
                            <tr v-else class="hover:bg-gray-50" v-for="invoice in invoiceStore.invoices.rows"
                                :key="invoice.nid">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{{ invoice.field_reference_facture ||
                                        'N/A' }}</div>
                                    <div class="text-sm text-gray-500">
                                        {{ formatDate(invoice.field_date_facture, '', "short") }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{{ invoice.field_patient_nom || 'N/A'
                                    }}</div>
                                    <div class="text-sm text-gray-500">Âge: {{ invoice.field_patient_age ?
                                        invoice.field_patient_age + ' ans' : 'N/A' }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex flex-col gap-2">
                                        <!-- Badge pour le statut de paiement -->
                                        <span :class="getStatusBadgeClass(invoice.field_status_invoice)"
                                            class="px-2 py-1 text-xs font-medium rounded-full w-fit">
                                            {{ invoice.field_status_invoice == 1 ? 'Payé' : 'Non payé' }}
                                        </span>
                                        <!-- Badge pour le type -->
                                        <span :class="getTypeBadgeClass(invoice.field_type)"
                                            class="px-2 py-1 text-xs font-medium rounded-full w-fit capitalize">
                                            {{ invoice.field_type || 'N/A' }}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span class="font-medium">
                                        {{
                                            (parseInt(invoice.field_total_vente || 0) + (parseInt(invoice?.field_montant_cons) || 0)).toLocaleString('fr-MG', { style: 'currency', currency: 'MGA' }) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <router-link :to="{ name: 'facture-details', query: { invoice: invoice.nid } }"
                                        class="text-primary hover:text-blue-900 inline-flex">
                                        <div class="w-4 h-4 flex items-center justify-center">
                                            <i class="ri-eye-line"></i>
                                        </div>
                                    </router-link>
                                    <!-- <button class="text-blue-600 hover:text-blue-900"
                                        @click.stop="goToFacture(invoice)">
                                        <div class="w-4 h-4 flex items-center justify-center">
                                            <i class="ri-printer-line"></i>
                                        </div>
                                    </button> -->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                        Affichage de {{ startIndex }} à {{ endIndex }} sur {{ invoiceStore.invoices.total || 0 }}
                        factures
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
import { useRouter } from 'vue-router';
import { debounce } from 'lodash';
import { formatDate } from '../utils/formateDate.js';
import { useInvoiceStore } from '../stores/index.js';

export default {
    name: "FactureList",
    setup() {
        const router = useRouter();
        const invoiceStore = useInvoiceStore();

        // Pagination
        const perPage = 15;
        const currentPage = ref(1);
        const totalPages = computed(() => Math.ceil((invoiceStore.invoices.total || 0) / perPage));

        // Calcul des indices affichés
        const startIndex = computed(() => {
            if (!invoiceStore.invoices.rows?.length) return 0;
            return ((currentPage.value - 1) * perPage) + 1;
        });

        const endIndex = computed(() => {
            if (!invoiceStore.invoices.rows?.length) return 0;
            const end = currentPage.value * perPage;
            return Math.min(end, invoiceStore.invoices.total || 0);
        });

        // État de chargement du tableau
        const tableLoading = ref(false);

        // Paramètres dynamiques de la requête pour les factures
        const invoiceQueryOptions = ref({
            fields: [
                'nid',
                'field_commande',
                'field_date_facture',
                'field_patient_nom',
                'field_reference_facture',
                'field_patient_age',
                'field_type',
                'field_total_vente',
                'field_status_invoice',
                'field_montant_cons',
                'nid'
            ],
            sort: { val: 'nid', op: 'desc' },
            filters: {
                status: {
                    val: 1,
                    op: "="
                }
            },
            pager: 0,
            offset: perPage
        });

        // Variables pour la recherche
        const searchKeywordPatient = ref('');
        const searchKeywordReference = ref('');
        const dateValue = ref('');

        const fetchInvoicesData = async () => {
            tableLoading.value = true;
            try {
                await invoiceStore.fetchInvoices(invoiceQueryOptions.value);
            } finally {
                tableLoading.value = false;
            }
        };

        // Redirection vers la page facture (maintenant sur le bouton imprimante)
        const goToFacture = (invoice) => {
            // Récupérer le nid de la commande (field_commande.nid)
            const commandeNid = invoice.field_commande?.nid;
            const invoiceNid = invoice.nid;

            if (commandeNid && invoiceNid) {
                router.push({
                    path: '/facture',
                    query: {
                        key: commandeNid,
                        invoice: invoiceNid
                    }
                });
            } else {
                console.error('Informations manquantes pour la redirection:', {
                    commandeNid,
                    invoiceNid
                });
            }
        };

        // Fonction pour obtenir la classe CSS du badge selon le statut de paiement
        const getStatusBadgeClass = (status) => {
            if (status == 1) {
                return 'bg-green-100 text-green-800';
            } else {
                return 'bg-red-100 text-red-800';
            }
        };

        // Fonction pour obtenir la classe CSS du badge selon le type
        const getTypeBadgeClass = (type) => {
            if (type === 'caisse') {
                return 'bg-blue-100 text-blue-800';
            } else if (type === 'ordonnance') {
                return 'bg-purple-100 text-purple-800';
            }
            return 'bg-gray-100 text-gray-800';
        };

        // Message personnalisé selon les filtres actifs
        const getEmptyMessage = () => {
            if (searchKeywordReference.value && searchKeywordPatient.value && dateValue.value) {
                return "Aucune facture trouvée pour cette référence, ce patient et cette date";
            } else if (searchKeywordReference.value && searchKeywordPatient.value) {
                return "Aucune facture trouvée pour cette référence et ce patient";
            } else if (searchKeywordReference.value && dateValue.value) {
                return "Aucune facture trouvée pour cette référence et cette date";
            } else if (searchKeywordPatient.value && dateValue.value) {
                return "Aucune facture trouvée pour ce patient à cette date";
            } else if (searchKeywordReference.value) {
                return "Aucune facture trouvée pour cette référence";
            } else if (searchKeywordPatient.value) {
                return "Aucune facture trouvée pour ce patient";
            } else if (dateValue.value) {
                return "Aucune facture trouvée pour cette date";
            }
            return "Aucune facture n'est disponible pour le moment";
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
                invoiceQueryOptions.value.pager = page - 1;
                await fetchInvoicesData();

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
                invoiceQueryOptions.value.pager = currentPage.value - 1;
                await fetchInvoicesData();

                const el = document.querySelector('.bg-white.rounded-xl.shadow-sm');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };

        const previousPage = async () => {
            if (currentPage.value > 1) {
                currentPage.value--;
                invoiceQueryOptions.value.pager = currentPage.value - 1;
                await fetchInvoicesData();

                const el = document.querySelector('.bg-white.rounded-xl.shadow-sm');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };

        // Recherche par référence facture
        const searchByReference = debounce(async () => {
            if (searchKeywordReference.value.trim() !== '') {
                updateFilter('field_reference_facture', searchKeywordReference.value, 'CONTAINS');
            } else {
                delete invoiceQueryOptions.value.filters.field_reference_facture;
            }
            currentPage.value = 1;
            invoiceQueryOptions.value.pager = 0;
            await fetchInvoicesData();
        }, 500);

        // Recherche par nom patient
        const searchByKeyword = debounce(async () => {
            if (searchKeywordPatient.value.trim() !== '') {
                updateFilter('field_patient_nom', searchKeywordPatient.value, 'CONTAINS');
            } else {
                delete invoiceQueryOptions.value.filters.field_patient_nom;
            }
            currentPage.value = 1;
            invoiceQueryOptions.value.pager = 0;
            await fetchInvoicesData();
        }, 500);

        const updateFilter = (key, value, op = '=') => {
            if (!value) delete invoiceQueryOptions.value.filters[key];
            else invoiceQueryOptions.value.filters[key] = { val: value, op };
        };

        // Filtre par date
        const filterByDate = () => {
            invoiceQueryOptions.value.pager = 0;
            currentPage.value = 1;

            if (dateValue.value) {
                invoiceQueryOptions.value.filters.field_date_facture = {
                    val: dateValue.value,
                    op: "="
                };
            } else {
                delete invoiceQueryOptions.value.filters.field_date_facture;
            }

            fetchInvoicesData();
        };

        onMounted(async () => {
            await fetchInvoicesData();
        });

        return {
            invoiceStore,
            // Recherche
            searchKeywordPatient,
            searchByKeyword,
            searchKeywordReference,
            searchByReference,
            // Filtre date
            dateValue,
            filterByDate,
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
            // Redirection
            goToFacture,
            // Badges
            getStatusBadgeClass,
            getTypeBadgeClass
        };
    }
}
</script>