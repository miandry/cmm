<template>
    <div class="p-3 border-b border-gray-200">
        <div class="flex justify-between">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Historique médical</h3>
            <span class="text-xs text-primary" v-if="consultationsStore.consultations.rows.length > 5"
                @click="showAllHistory(consultationsStore.consultations.rows[0].field_client.nid)">voir plus</span> 
        </div>
        <div class="space-y-1 max-h-48 overflow-y-auto" v-if="consultationsStore.consultations.rows.length">
            <div v-for="cons in consultationsStore.consultations.rows" :key="cons.nid" @click="editConsultation(cons)"
                class="p-2 rounded-lg cursor-pointer"
                :class="[cons.field_consultation_status == 'draft' ? 'bg-orange-100 hover:bg-orange-200' : 'bg-green-100 hover:bg-green-200']">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-xs flex-1 two-lines font-medium text-gray-900">{{ cons.field_motif }}</span>
                    <p class="text-xs text-green-500" v-if="cons.field_consultation_status == 'completed'"><i
                            class="ri-checkbox-circle-line"></i> Achevé</p>
                    <p class="text-xs text-orange-500" v-else><i class="ri-time-line"></i> Non Achevé</p>
                </div>
                <div class="flex items-center justify-between mb-1">
                    <p class="text-xs text-gray-600">
                        <span>{{ cons.field_temperature }}°C </span>
                        <span> - {{ cons.field_tension_arterielle }} mmHg</span>
                    </p>
                    <span class="text-xs text-gray-500"> {{ formatDate(null, cons.created, 'short') }}</span>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="text-center text-gray-300 py-4">
                Aucun consulatations
            </div>
        </div>
    </div>
</template>

<script>
import { watch, ref, onMounted } from 'vue';
import { useClientStore, useConsultationStore } from '../../stores/index.js';
import { formatDate } from '../../utils/formateDate.js';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

export default {
    name: "Historique",
    emits: ['openHistory'],
    setup(_, { emit }) {
        const patienStore = useClientStore();
        const consultationsStore = useConsultationStore();
        const consultationNid = ref('');
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
            filters: {},
            pager: 0,
            offset: 5
        })

        const fetchConsultations = async () => {
            await consultationsStore.fetchConsultations(queryOptions.value);
        }

        const updateFilter = (key, value, op = "=") => {
            if (value === null || value === undefined || value === '') {
                delete queryOptions.value.filters[key];
            } else {
                queryOptions.value.filters[key] = { val: value, op };
            }
        }

        // Watch sur le nid du client
        watch(
            () => patienStore.client?.nid,
            (newNid) => {
                if (newNid == undefined) {
                    consultationsStore.consultationsReset();
                } else {
                    consultationNid.value = newNid;
                    updateFilter('field_client', newNid, "=");
                    fetchConsultations();
                }
            },
            { immediate: true } // Lance immédiatement si client.nid existe déjà
        );

        // edit consulatation
        const editConsultation = (consultation) => {
            if (consultation.field_consultation_status == "draft") {
                router.push({
                    name: 'consultation.edit',
                    params: {
                        id: consultation.nid
                    }
                });
                toast("Consultation chargé.", { class: "!bg-orange-100 !text-orange-700", });
            } else {
                toast("Consultation déja payé.", { class: "!bg-green-100 !text-green-700", });
            }
        };

        const showAllHistory = (clientId) => {
            emit('openHistory', clientId);
        }

        return {
            consultationsStore,
            formatDate,
            editConsultation,
            showAllHistory
        }
    },
}
</script>

<style>
.two-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* limite à 2 lignes */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>