<template>
    <!-- Customer Selection Modal -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50">
        <div class="flex items-center justify-center min-h-screen p-4 w-full">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Historique des consultations</h3>
                        <button @click="closeHistoryModal" class="text-gray-400 hover:text-gray-600">
                            <div class="w-6 h-6 flex items-center justify-center">
                                <i class="ri-close-line text-xl"></i>
                            </div>
                        </button>
                    </div>
                    <div class="mb-4">
                        <div class="relative mb-3">
                            <div
                                class="w-4 h-4 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <i class="ri-search-line text-sm"></i>
                            </div>
                            <input type="text" placeholder="Rechercher une consultation" v-model="searchKeyword"
                                @input="onSearch"
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                        </div>
                    </div>
                    <!-- Loader -->
                    <div v-if="loading" class="flex flex-col items-center justify-center py-6">
                        <div class="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin">
                        </div>
                        <p class="text-center text-xs text-gray-600 mt-2">Chargement...</p>
                    </div>
                    <div v-else>
                        <div class="space-y-1 max-h-48 overflow-y-auto"
                            v-if="consultationsStore.consultations.rows.length">
                            <div v-for="cons in consultationsStore.consultations.rows" :key="cons.nid"
                                @click="showConsultationDetails(cons)" class="p-2 rounded-lg cursor-pointer"
                                :class="[cons.field_consultation_status == 'draft' ? 'bg-orange-100 hover:bg-orange-200' : 'bg-green-100 hover:bg-green-200']">
                                <div class="flex items-center justify-between mb-1 gap-4">
                                    <span class="text-xs flex-1 two-lines font-medium text-gray-900">{{ cons.field_motif
                                        }}</span>
                                    <p class="text-xs text-green-500"
                                        v-if="cons.field_consultation_status == 'completed'">
                                        <i class="ri-checkbox-circle-line"></i> Payé
                                    </p>
                                    <p class="text-xs text-orange-500" v-else><i class="ri-time-line"></i> Non payé</p>
                                </div>
                                <div class="flex items-center justify-between mb-1">
                                    <p class="text-xs text-gray-600">
                                        <span>{{ cons.field_temperature }}°C </span>
                                        <span> - {{ cons.field_tension_arterielle }} mmHg</span>
                                    </p>
                                    <p>
                                        <span @click.stop="print(cons.nid)" title="Imprimer ordonnance"
                                            class="cursor-pointer mr-2 text-green-600"><i
                                                class="ri-printer-line"></i></span>
                                        <span class="text-xs text-gray-500"> {{ formatDate(null, cons.created, 'short')
                                            }}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="text-center text-gray-300 py-4">
                                Aucun consulatations
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useConsultationStore } from '../../stores/index.js';
import { formatDate } from '../../utils/formateDate.js';
import { useRouter } from 'vue-router';
import { debounce } from 'lodash';

export default {
    name: "AllHistory",
    props: {
        clientId: {
            type: Number,
            required: true
        }
    },
    emits: ['closeHistory'],
    setup(props, { emit }) {
        const consultationsStore = useConsultationStore();
        const loading = ref(false)
        const searchKeyword = ref('')
        const router = useRouter()
        // Paramètres dynamiques de la requête
        const queryOptions = ref({
            fields: [
                'nid',
                'title',
                'field_motif',
                'field_temperature',
                'field_tension_arterielle',
                'field_client',
                'created',
                'field_consultation_status'
            ],
            sort: { val: 'nid', op: 'desc' },
            filters: {
                status: {
                    val: 1,
                    op: "="
                }
            },
            pager: 0,
            offset: 1000
        })

        const fetchConsultations = async () => {
            loading.value = true;
            await consultationsStore.fetchConsultations(queryOptions.value);
            loading.value = false;
        }


        const updateFilter = (key, value, op = "=") => {
            if (value === null || value === undefined || value === '') {
                delete queryOptions.value.filters[key];
            } else {
                queryOptions.value.filters[key] = { val: value, op };
            }
        }

        watch(
            () => props.clientId,
            async (newVal) => {
                if (!newVal) return;
                console.log("Client ID changed:", newVal);
                updateFilter('field_client', newVal, "=");
                await fetchConsultations();
            },
            { immediate: true }
        );

        const onSearch = () => {
            loading.value = true;
            debouncedFetch();
        }

        const debouncedFetch = debounce(() => {
            updateFilter('field_motif', searchKeyword.value, 'CONTAINS');
            fetchConsultations()
        }, 600);

        const closeHistoryModal = () => {
            searchKeyword.value = "";
            queryOptions.value.offset = 5;
            updateFilter('field_client', props.clientId, "=");
            updateFilter('field_motif', searchKeyword.value, 'CONTAINS');
            fetchConsultations()
            emit('closeHistory')
        }

        const showConsultationDetails = (consultation) => {
            router.push({
                name: 'consultation.details',
                query: {
                    id: consultation.nid
                }
            });
        };

        const print = (nid) => {
            router.push({
                name: 'ordonnance',
                query: {
                    key: nid,
                }
            })
        }

        return {
            consultationsStore,
            formatDate,
            loading,
            searchKeyword,
            onSearch,
            closeHistoryModal,
            showConsultationDetails,
            print,
        }
    }
}
</script>

<style></style>