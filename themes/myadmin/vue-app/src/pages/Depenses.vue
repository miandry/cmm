<template>
    <main class="px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
                <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">Gestion des Dépenses</h1>
                <p class="text-sm sm:text-base text-gray-600">Liste des dépenses et création rapide</p>
            </div>
            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                <span class="text-xs sm:text-sm text-gray-600 hidden xs:inline">Filtre rapide :</span>
                <button @click="setPeriod('day')" :class="btnClass('day')"
                    class="text-xs sm:text-sm px-2 sm:px-3 py-1">Jour</button>
                <button @click="setPeriod('week')" :class="btnClass('week')"
                    class="text-xs sm:text-sm px-2 sm:px-3 py-1">Semaine</button>
                <button @click="setPeriod('month')" :class="btnClass('month')"
                    class="text-xs sm:text-sm px-2 sm:px-3 py-1">Mois</button>
                <button @click="openAddModal"
                    class="px-3 sm:px-4 py-2 bg-primary text-white rounded-md text-sm sm:text-base w-full sm:w-auto">
                    Ajouter Dépense
                </button>
            </div>
        </div>

        <!-- Filtres -->
        <div class="bg-white rounded-xl shadow-sm border p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div class="w-full sm:w-1/2 relative">
                    <input v-model="search" @input="handleSearch" placeholder="Rechercher par description"
                        class="w-full px-3 sm:px-4 py-2 bg-gray-50 border rounded-lg text-sm sm:text-base" />
                </div>

                <div class="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <span class="text-xs sm:text-sm text-gray-600">Date entre :</span>
                    <input type="date" v-model="dateStart" @change="applyDateFilter"
                        class="px-2 sm:px-3 py-1 sm:py-2 bg-gray-50 border rounded-md text-xs sm:text-sm flex-1 sm:flex-none" />
                    <span class="text-gray-400 hidden xs:inline">-</span>
                    <input type="date" v-model="dateEnd" @change="applyDateFilter"
                        class="px-2 sm:px-3 py-1 sm:py-2 bg-gray-50 border rounded-md text-xs sm:text-sm flex-1 sm:flex-none" />
                </div>
            </div>
        </div>

        <!-- Total -->
        <div class="mb-3 sm:mb-4">
            <div class="bg-white p-3 sm:p-4 rounded-md shadow-sm">
                <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                    <div>
                        <div class="text-xs sm:text-sm text-gray-500">Total (filtre actif)</div>
                        <div class="text-xl sm:text-2xl font-bold">Ar {{ formatNumber(totalAmount) }}</div>
                    </div>
                    <div class="text-xs sm:text-sm text-gray-500">Affichage: {{ depenseStore.depenses.total }} éléments
                    </div>
                </div>
            </div>
        </div>

        <!-- Tableau -->
        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-xs sm:text-sm">
                    <thead class="bg-gray-50 border-b">
                        <tr>
                            <th class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-500 uppercase">Description
                            </th>
                            <th
                                class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-500 uppercase hidden sm:table-cell">
                                Type</th>
                            <th class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-500 uppercase">Montant</th>
                            <th class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-500 uppercase">Date</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr v-for="item in depenseStore.depenses.rows" :key="item.nid" class="hover:bg-gray-50">
                            <td class="px-3 sm:px-6 py-2 sm:py-4 max-w-[120px] sm:max-w-none truncate">{{
                                item.field_description_depense }}</td>
                            <td class="px-3 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">{{
                                item.field_categorie_depense?.title || '-' }}</td>
                            <td class="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">{{
                                formatNumber(item.field_montant_depense) }} Ar</td>
                            <td class="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">{{ formatDate(null, item.created) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="px-3 sm:px-6 py-3 sm:py-4 border-t flex items-center justify-center">
                <div class="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                    <button @click="previousPage" :disabled="currentPage === 1"
                        class="px-2 sm:px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
                        ‹
                    </button>
                    <button v-for="p in visiblePages" :key="p" @click="goToPage(p)"
                        :class="{ 'bg-primary text-white': p === currentPage }"
                        class="px-2 sm:px-3 py-1 text-sm rounded border hover:bg-gray-50 min-w-[30px] sm:min-w-[36px]">
                        {{ p }}
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="px-2 sm:px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
                        ›
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h3 class="text-lg font-semibold mb-4">Nouvelle dépense</h3>
                <div class="space-y-3">
                    <div>
                        <label class="block text-sm text-gray-600 mb-1">Description</label>
                        <input v-model="form.field_description_depense"
                            class="w-full px-3 py-2 border rounded text-sm" />
                    </div>
                    <div>
                        <label class="block text-sm text-gray-600 mb-1">Montant</label>
                        <input v-model="form.field_montant_depense" type="number"
                            class="w-full px-3 py-2 border rounded text-sm" />
                    </div>
                    <div>
                        <label class="block text-sm text-gray-600 mb-1">Type dépense</label>
                        <select v-model="form.field_categorie_depense" class="w-full px-3 py-2 border rounded text-sm">
                            <option value="">Sélectionner</option>
                            <option v-for="cat in depenseStore.categories.rows" :key="cat.tid" :value="cat.tid">
                                {{ cat.name }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="mt-4 flex flex-col-reverse sm:flex-row justify-end gap-2">
                    <button @click="closeModal"
                        class="px-4 py-2 border rounded text-sm w-full sm:w-auto">Annuler</button>
                    <button @click="submit"
                        class="px-4 py-2 bg-primary text-white rounded text-sm w-full sm:w-auto">Enregistrer</button>
                </div>
            </div>
        </div>

    </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useDepenseStore } from '../stores/index.js';
import { formatDate } from '../utils/formateDate.js';

export default {
    setup() {
        const depenseStore = useDepenseStore();
        const perPage = 15;
        const currentPage = ref(1);
        const search = ref('');
        const dateStart = ref('');
        const dateEnd = ref('');
        const period = ref('day');
        const showModal = ref(false);
        const form = ref({
            entity_type: 'node',
            bundle: 'depenses',
            field_description_depense: '',
            field_montant_depense: '',
            field_categorie_depense: '',
            title: 'depense-' + Date.now()
        });

        const queryOptions = ref({
            fields: ['nid', 'title', 'field_description_depense', 'field_montant_depense', 'field_categorie_depense', 'created'],
            sort: { val: 'nid', op: 'desc' },
            filters: { status: { val: 1, op: '=' } },
            pager: 0,
            offset: perPage
        });

        // Helper function to convert date to Unix timestamp
        const toUnixTimestamp = (date) => {
            if (!date) return null;
            const d = new Date(date);
            return Math.floor(d.getTime() / 1000);
        };

        // Helper function to get start of day timestamp
        const getStartOfDay = (date) => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return Math.floor(d.getTime() / 1000);
        };

        // Helper function to get end of day timestamp
        const getEndOfDay = (date) => {
            const d = new Date(date);
            d.setHours(23, 59, 59, 999);
            return Math.floor(d.getTime() / 1000);
        };

        const fetch = async () => {
            await depenseStore.fetchDepenses(queryOptions.value);
            // fetch totals
            const all = await depenseStore.fetchAllForTotals(queryOptions.value);
            totalAmount.value = all.reduce((s, r) => s + Number(r.field_montant_depense || 0), 0);
        };

        onMounted(async () => {
            await depenseStore.fetchCategories({ fields: ['tid', 'name'], sort: { val: 'name', op: 'asc' }, pager: 0, offset: 1000 });
            await fetch();
        });

        const totalAmount = ref(0);

        const formatNumber = (v) => Number(v || 0).toLocaleString('fr-FR');

        const setPeriod = async (p) => {
            period.value = p;
            const now = new Date();
            let start;

            if (p === 'day') {
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            } else if (p === 'week') {
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                start = new Date(now.getFullYear(), now.getMonth(), diff);
            } else {
                start = new Date(now.getFullYear(), now.getMonth(), 1);
            }

            // Convertir les dates en timestamps Unix (secondes)
            const startTimestamp = getStartOfDay(start);
            const endTimestamp = getEndOfDay(now);

            queryOptions.value.filters.created = {
                val: [startTimestamp, endTimestamp],
                op: 'BETWEEN'
            };

            // Reset date inputs when using quick filters
            dateStart.value = '';
            dateEnd.value = '';

            queryOptions.value.pager = 0;
            currentPage.value = 1;
            await fetch();
        };

        const applyDateFilter = async () => {
            if (dateStart.value && dateEnd.value) {
                const startTimestamp = getStartOfDay(dateStart.value);
                const endTimestamp = getEndOfDay(dateEnd.value);

                queryOptions.value.filters.created = {
                    val: [startTimestamp, endTimestamp],
                    op: 'BETWEEN'
                };

                // Reset period when using custom date filter
                period.value = null;
            } else if (dateStart.value && !dateEnd.value) {
                // If only start date is set, filter from that date to now
                const startTimestamp = getStartOfDay(dateStart.value);
                const endTimestamp = getEndOfDay(new Date());

                queryOptions.value.filters.created = {
                    val: [startTimestamp, endTimestamp],
                    op: 'BETWEEN'
                };
                period.value = null;
            } else if (!dateStart.value && dateEnd.value) {
                // If only end date is set, filter from beginning to that date
                const startTimestamp = 0; // Unix epoch
                const endTimestamp = getEndOfDay(dateEnd.value);

                queryOptions.value.filters.created = {
                    val: [startTimestamp, endTimestamp],
                    op: 'BETWEEN'
                };
                period.value = null;
            } else {
                // If both are empty, remove the filter
                delete queryOptions.value.filters.created;
                period.value = 'day'; // Reset to default period
                await setPeriod('day');
                return;
            }

            queryOptions.value.pager = 0;
            currentPage.value = 1;
            await fetch();
        };

        const handleSearch = async () => {
            if (!search.value) {
                delete queryOptions.value.filters.field_description_depense;
            } else {
                queryOptions.value.filters.field_description_depense = { val: search.value, op: 'CONTAINS' };
            }
            queryOptions.value.pager = 0;
            await fetch();
        };

        const openAddModal = () => {
            form.value.field_description_depense = '';
            form.value.field_montant_depense = '';
            form.value.field_categorie_depense = '';
            showModal.value = true;
        };

        const closeModal = () => (showModal.value = false);

        const submit = async () => {
            const payload = { ...form.value };
            // for taxonomy reference expect array of tid objects
            if (payload.field_categorie_depense) {
                payload.field_categorie_depense = [{ tid: payload.field_categorie_depense }];
            }
            await depenseStore.createDepense(payload);
            closeModal();
            await fetch();
        };

        // Pagination
        const totalPages = computed(() => Math.ceil(depenseStore.depenses.total / perPage) || 1);
        const visiblePages = computed(() => {
            const pages = [];
            const total = totalPages.value;
            const cur = currentPage.value;
            if (total <= 3) { for (let i = 1; i <= total; i++) pages.push(i); }
            else { if (cur === 1) pages.push(1, 2, 3); else if (cur === total) pages.push(total - 2, total - 1, total); else pages.push(cur - 1, cur, cur + 1); }
            return pages;
        });

        const goToPage = async (p) => { currentPage.value = p; queryOptions.value.pager = p - 1; await fetch(); };
        const nextPage = async () => { if (currentPage.value < totalPages.value) { currentPage.value++; await goToPage(currentPage.value); } };
        const previousPage = async () => { if (currentPage.value > 1) { currentPage.value--; await goToPage(currentPage.value); } };

        const btnClass = (p) => p === period.value ? 'px-3 py-1 rounded bg-primary text-white' : 'px-3 py-1 rounded border';

        return {
            depenseStore,
            search,
            dateStart,
            dateEnd,
            formatNumber,
            formatDate,
            totalAmount,
            setPeriod,
            applyDateFilter,
            btnClass,
            openAddModal,
            showModal,
            form,
            closeModal,
            submit,
            currentPage,
            totalPages,
            visiblePages,
            goToPage,
            nextPage,
            previousPage,
            handleSearch,
        };
    }
}
</script>