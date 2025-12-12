<template>
    <div class="p-3 border-b border-gray-200">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Historique médical</h3>
        <div class="space-y-1 max-h-48 overflow-y-auto" v-if="consultationsStore.consultations.rows.length">
            <div v-for="cons in consultationsStore.consultations.rows" :key="cons.nid"
                class="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-xs flex-1 two-lines font-medium text-gray-900">{{ cons.field_motif }}</span>
                    <span class="text-xs text-gray-500">  {{ formatDate(null, cons.created, 'short') }}</span>
                </div>
                <p class="text-xs text-gray-600">
                    <span>{{ cons.field_temperature }}°C </span>
                    <span> - {{ cons.field_tension_arterielle }} mmHg</span>
                </p>
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
import { watch, ref } from 'vue';
import { useClientStore, useConsultationStore } from '../../stores/index.js';
import { formatDate } from '../../utils/formateDate.js';

export default {
    name: "Historique",
    setup() {
        const patienStore = useClientStore();
        const consultationsStore = useConsultationStore();
        const consultationNid = ref('');
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
            ],
            sort: { val: 'nid', op: 'desc' },
            filters: {},
            pager: 0,
            offset: 15
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
                if (newNid) {
                    consultationNid.value = newNid;
                    updateFilter('field_client', newNid, "=" );
                    fetchConsultations(queryOptions.value);
                }
            },
            { immediate: true } // Lance immédiatement si client.nid existe déjà
        );

        return {
            consultationsStore,
            formatDate,
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