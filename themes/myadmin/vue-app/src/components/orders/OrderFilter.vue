<template>
    <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Gestion des commandes</h2>

        <!-- SEARCH -->
        <div class="flex flex-col md:flex-row gap-4 mb-4">
            <div class="w-full md:w-1/2 relative">
                <div class="relative">
                    <div
                        class="w-5 h-5 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <i class="ri-search-line text-sm"></i>
                    </div>

                    <input type="text" v-model="searchKeywordClient" @input="searchByKeyword" @focus="showList = true"
                        @blur="handleBlur" placeholder="Rechercher une commande."
                        class="w-full pl-10 pr-4 py-3 border border-gray-200 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                </div>
                <div v-if="showList" @mousedown.prevent
                    class="max-h-48 overflow-y-auto border border-gray-300 !rounded-button bg-white absolute right-0 left-0">

                    <!-- Loader -->
                    <div v-if="loading" class="flex flex-col items-center justify-center py-6">
                        <div class="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin">
                        </div>
                        <p class="text-center text-xs text-gray-600 mt-2">Chargement...</p>
                    </div>
                    <div v-else-if="clientStore.clients.rows.length" class="divide-y divide-gray-100">
                        <div v-for="(client, index) in clientStore.clients.rows" :key="index" :class="[
                            'flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 cursor-pointer customer-item border-t-0',
                            selectedIndex === index ? 'bg-blue-50 border-primary border-l-4' : ''
                        ]" @click="selectClient(client.nid, client.title)">
                            <div
                                class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium uppercase ">
                                {{ client.title.slice(0, 2) }}
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900">{{ client.title }}</p>
                                <p class="text-xs text-gray-500">{{ client.field_phone }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <h3 class="text-center text-gray-400 py-2">Aucun client trouvé avec ce mot-clé</h3>
                    </div>
                </div>
            </div>
            <div class="w-full md:w-1/2">
                <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span class="text-xs text-gray-500 whitespace-nowrap">Date entre</span>
                    <input type="date" v-model="dateStart"
                        class="w-full px-3 py-3 border border-gray-200 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <span class="text-xs text-gray-400 text-center">et</span>
                    <input type="date" v-model="dateEnd"
                        class="w-full px-3 py-3 border border-gray-200 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <button v-if="dateStart || dateEnd" type="button" @click="clearDates"
                        class="px-3 py-3 text-xs text-gray-500 hover:text-gray-700 whitespace-nowrap"
                        title="Effacer les dates">
                        <i class="ri-close-circle-line text-base"></i>
                    </button>
                </div>
            </div>

        </div>

        <!-- FILTER BUTTONS -->
        <div class="flex space-x-2 overflow-x-auto mb-3">
            <button v-for="btn in statusOptions" :key="btn.value" @click="changeStatus(btn.value)" :class="[
                'px-4 py-2 text-sm font-medium whitespace-nowrap !rounded-button filter-btn',
                status === btn.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]">
                {{ btn.label }}
            </button>
        </div>

        <div class="flex space-x-2 overflow-x-auto mb-6">
            <button v-for="btn in caisseOptions" :key="btn.value" @click="changeCaisseType(btn.value)" :class="[
                'px-4 py-2 text-sm font-medium whitespace-nowrap !rounded-button filter-btn flex items-center gap-1.5',
                caisseType === btn.value
                    ? btn.activeClass
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]">
                <i :class="btn.icon"></i>
                {{ btn.label }}
            </button>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useClientStore } from '../../stores';
import { debounce } from 'lodash';
export default {
    name: 'OrderFilter',
    emits: ['on-search', 'on-filter', 'on-date-filter', 'on-caisse-filter'],

    setup(_, { emit }) {

        const status = ref('all');
        const caisseType = ref('all');
        const clientStore = useClientStore();
        const clientId = ref('');
        const searchKeywordClient = ref('');
        const dateStart = ref('');
        const dateEnd = ref('');
        const showList = ref(false);
        const loading = ref(false)
        const queryOptions = ref({
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
            offset: 20
        })

        const statusOptions = [
            { value: 'all', label: 'Toutes' },
            { value: 'payed', label: 'Payé' },
            { value: 'unpayed', label: 'Non payé' },
            { value: 'cancel', label: 'Annulée' }
        ];

        const caisseOptions = [
            { value: 'all', label: 'Toutes les caisses', icon: 'ri-store-2-line', activeClass: 'bg-gray-800 text-white' },
            { value: 'caisse', label: 'Caisse médicaments', icon: 'ri-capsule-line', activeClass: 'bg-blue-600 text-white' },
            { value: 'caisse-services', label: 'Caisse services', icon: 'ri-service-line', activeClass: 'bg-teal-600 text-white' },
        ];

        const fetchClients = async () => {
            await clientStore.fetchClients(queryOptions.value);
        }

        const searchByKeyword = () => {
            loading.value = true;
            debouncedFetch();
        }

        const debouncedFetch = debounce(async () => {
            updateFilter('title', searchKeywordClient.value, 'CONTAINS')
            await fetchClients();
            loading.value = false;
        }, 600);

        const selectClient = async (nid, name) => {
            searchKeywordClient.value = name;
            clientId.value = nid;
            showList.value = false;
            emit('on-search', clientId.value);
        }

        const updateFilter = (key, value, op = '=') => {
            if (!value) delete queryOptions.value.filters[key]
            else queryOptions.value.filters[key] = { val: value, op }
        }

        const applyDateFilter = () => {
            if (!dateStart.value && !dateEnd.value) {
                emit('on-date-filter', { start: '', end: '' });
                return;
            }
            if (dateStart.value && dateEnd.value) {
                emit('on-date-filter', { start: dateStart.value, end: dateEnd.value });
            }
        };

        const clearDates = () => {
            dateStart.value = '';
            dateEnd.value = '';
            emit('on-date-filter', { start: '', end: '' });
        };

        watch([dateStart, dateEnd], applyDateFilter);

        const changeStatus = (value) => {
            status.value = value;
            emit('on-filter', value);
        };

        const changeCaisseType = (value) => {
            caisseType.value = value;
            emit('on-caisse-filter', value);
        };

        const handleBlur = async () => {
            // délai court pour laisser le clic se déclencher avant de cacher
            if (searchKeywordClient.value === '') {
                emit('on-search', '');
            }
            setTimeout(() => showList.value = false, 100);
        };

        return {
            searchKeywordClient,
            searchByKeyword,
            status,
            caisseType,
            statusOptions,
            caisseOptions,
            changeStatus,
            changeCaisseType,
            clientStore,
            handleBlur,
            showList,
            selectClient,
            applyDateFilter,
            clearDates,
            dateStart,
            dateEnd,
            loading
        };
    }
};
</script>