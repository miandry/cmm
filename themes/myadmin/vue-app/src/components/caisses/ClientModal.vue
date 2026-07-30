<template>
    <!-- Customer Selection Modal -->
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Sélectionner un client</h3>
                        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
                            <div class="w-6 h-6 flex items-center justify-center">
                                <i class="ri-close-line text-xl"></i>
                            </div>
                        </button>
                    </div>
                    <div class="mb-4">
                        <div class="">
                            <div>
                                <div class="relative mb-3">
                                    <div
                                        class="w-4 h-4 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <i class="ri-search-line text-sm"></i>
                                    </div>
                                    <input type="text" v-model="clientNameSearch" @input="onSearch"
                                        placeholder="Rechercher un client..."
                                        class="w-full pl-10 pr-4 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                                </div>
                                <div class="max-h-48 overflow-y-auto border border-gray-300 !rounded-button">
                                    <div id="customer-list" class="divide-y divide-gray-100">

                                        <!-- Loader -->
                                        <div v-if="loading" class="flex flex-col items-center justify-center py-6">
                                            <div
                                                class="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin">
                                            </div>
                                            <p class="text-center text-xs text-gray-600 mt-2">Chargement...</p>
                                        </div>

                                        <!-- Liste des clients si non vide -->
                                        <div v-else-if="store.clients.rows.length > 0">
                                            <div v-for="(client, index) in store.clients.rows" :key="index" :class="[
                                                'flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 cursor-pointer customer-item border-t-0',
                                                selectedIndex === index ? 'bg-blue-50 border-primary border-l-4' : ''
                                            ]" @click="selectClient(client.nid, index)">
                                                <div
                                                    class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium uppercase">
                                                    {{ client.title.slice(0, 2) }}
                                                </div>
                                                <div class="flex-1">
                                                    <p class="text-sm font-medium text-gray-900">{{ client.title }}</p>
                                                    <p class="text-xs text-gray-500">{{ client.field_phone }}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Aucun client trouvé -->
                                        <div v-else-if="store.clients.rows.length <= 0 && clientNameSearch !== ''"
                                            class="flex flex-col items-center justify-center py-6 text-gray-500 text-xs">
                                            Aucun client trouvé.
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <button @click="$emit('open-add-customer-modal')"
                                class="w-full px-3 py-2 mt-3 border-2 border-dashed border-gray-300 hover:border-primary text-gray-600 hover:text-primary !rounded-button font-medium text-sm whitespace-nowrap flex items-center justify-center space-x-2">
                                <div class="w-4 h-4 flex items-center justify-center">
                                    <i class="ri-add-line"></i>
                                </div>
                                <span>Ajouter un nouveau client</span>
                            </button>
                        </div>
                    </div>
                    <div class="flex space-x-3">
                        <button @click="$emit('close')" :disabled="confirming"
                            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button font-medium whitespace-nowrap disabled:opacity-50">
                            Annuler
                        </button>
                        <button @click="confirmSelectedClient" :disabled="confirming || !selectedClientNid"
                            class="flex-1 px-4 py-2 bg-primary text-white hover:bg-blue-600 !rounded-button font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <i v-if="confirming" class="ri-loader-4-line animate-spin"></i>
                            <span>{{ confirming ? 'Chargement...' : 'Confirmer' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useClientStore } from '../../stores/index.js';
import { toast } from 'vue-sonner';
import { debounce } from 'lodash';

export default {
    name: "CustomerModal",
    setup(_, { emit }) {
        const store = useClientStore();
        const selectedClientNid = ref(null);
        const selectedIndex = ref(null);
        const clientNameSearch = ref('');
        const loading = ref(false);
        const confirming = ref(false);

        // Paramètres dynamiques de la requête
        const queryOptions = ref({
            fields: [
                'nid',
                'title',
                'field_phone',
                'field_assurance',
                'field_adresse',
                'field_age'
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
        })

        const fetchClients = async () => {
            await store.fetchClients(queryOptions.value);
            loading.value = false;
        }

        const confirmSelectedClient = async () => {
            if (confirming.value) {
                return;
            }
            if (!selectedClientNid.value) {
                toast.error("Veuillez sélectionner un client.")
                return
            }
            confirming.value = true;
            try {
                await store.fetchClient(selectedClientNid.value);
                if (store.error) {
                    toast.error("Une erreur est survenue lors de la sélection du client.")
                    return
                }
                toast.success('Client sélectionné avec succès !')
                emit('close')
            } catch (error) {
                toast.error("Une erreur est survenue lors de la sélection du client.")
            } finally {
                confirming.value = false;
            }
        }

        const onSearch = () => {
            loading.value = true;
            debouncedFetch();
        }

        const debouncedFetch = debounce(() => {
            updateFilter('title', clientNameSearch.value, 'CONTAINS');
            fetchClients();
        }, 600);

        const updateFilter = (key, value, op = '=') => {
            if (!value) delete queryOptions.value.filters[key]
            else queryOptions.value.filters[key] = { val: value, op }
        }

        const selectClient = (client, index) => {
            if (confirming.value || loading.value) {
                return;
            }
            selectedIndex.value = index
            selectedClientNid.value = client
        }

        // Charger les 5 premiers clients au montage du composant
        onMounted(async () => {
            loading.value = true;
            await fetchClients();
        })

        return {
            store,
            queryOptions,
            confirmSelectedClient,
            selectedClientNid,
            selectedIndex,
            clientNameSearch,
            onSearch,
            selectClient,
            loading,
            confirming,
        }
    }

}
</script>

<style>
.border-primary {
    border-color: rgb(59, 130, 246, 1) !important;
}

.border-t-0 {
    border-top-width: 0px !important;
}
</style>