<template>
    <div class="flex flex-col h-full">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Détails du Patient</h3>
            <button @click="closePannel" class="text-gray-400 hover:text-gray-600">
                <div class="w-6 h-6 flex items-center justify-center">
                    <i class="ri-close-line text-xl"></i>
                </div>
            </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4" v-if="client && client.nid">
            <div>
                <div class="space-y-6">
                    <div class="text-center">
                        <div
                            class="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-medium mx-auto mb-4 uppercase">
                            {{ client.title.slice(0, 2) }}
                        </div>
                        <h4 class="text-xl font-semibold text-gray-900 capitalize">{{ client.title }}</h4>
                        <p class="text-sm text-gray-500 hidden">#0001</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-gray-600">Âge</span>
                            <p class="font-medium" v-if="client.field_age">{{ client.field_age }} ans</p>
                            <p class="font-medium" v-else>Non renseigner</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Sexe</span>
                            <p class="font-medium" v-if="client.field_sexe && client.field_sexe == 'masculin'">
                                Masculin
                            </p>
                            <p class="font-medium" v-else-if="client.field_sexe && client.field_sexe == 'feminin'">
                                Féminin
                            </p>
                            <p class="font-medium" v-else>
                                Non renseigner
                            </p>

                        </div>
                        <div>
                            <span class="text-gray-600">Téléphone</span>
                            <p class="font-medium" v-if="client.field_phone">{{ client.field_phone }}</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Email</span>
                            <p class="text-sm font-medium" v-if="client.field_email">{{ client.field_email }}</p>
                            <p class="text-sm font-medium" v-else>Non renseigner</p>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <span class="text-sm text-gray-600">Adresse</span>
                            <p class="text-sm font-medium" v-if="client.field_adresse">{{ client.field_adresse }}</p>
                            <p class="text-sm font-medium" v-else>Non renseigner</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-600">Contact d'urgence</span>
                            <p class="text-sm font-medium" v-if="client.field_contact_d_urgence">{{
                                client.field_contact_d_urgence }}</p>
                            <p class="text-sm font-medium" v-else>Non renseigner</p>

                        </div>
                    </div>
                    <div class="border-t border-gray-200 pt-4">
                        <h5 class="text-sm font-semibold text-gray-900 mb-3">Informations médicales</h5>
                        <div class="space-y-3">
                            <div>
                                <span class="text-sm text-gray-600">Allergies</span>
                                <p class="text-sm font-medium text-red-600" v-if="client.field_allergies">{{
                                    client.field_allergies }}</p>
                                <p class="text-sm font-medium text-gray-900" v-else>Aucun</p>
                            </div>
                            <div v-if="client.field_assurance">
                                <span class="text-sm text-gray-600">Assurance</span>
                                <div class="flex items-center space-x-1"
                                    v-if="client.field_assurance && client.field_assurance == 1">
                                    <div class="w-2 h-2 bg-secondary rounded-full"></div>
                                    <span class="text-xs font-medium text-secondary ">Oui</span>
                                </div>
                                <div class="flex items-center space-x-1"
                                    v-if="client.field_assurance && client.field_assurance == 0">
                                    <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span class="text-xs font-medium text-red-500 ">Non</span>
                                </div>
                            </div>
                            <div v-if="client.field_notes_medicales">
                                <span class="text-sm text-gray-600">Notes médicales</span>
                                <p class="text-sm font-medium">{{
                                    client.field_notes_medicales }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="p-3 border-b border-gray-200">
                        <div class="flex justify-between">
                            <h3 class="text-sm font-semibold text-gray-900 mb-3">Historique médical</h3>
                            <span class="text-xs text-primary" v-if="consultationsStore.consultations.rows.length > 5">voir plus</span>
                        </div>
                        <div class="space-y-1 max-h-48 overflow-y-auto"
                            v-if="consultationsStore.consultations.rows.length">
                            <div v-for="cons in consultationsStore.consultations.rows" :key="cons.nid"
                                @click="editConsultation(cons)" class="p-2 rounded-lg cursor-pointer"
                                :class="[cons.field_consultation_status == 'draft' ? 'bg-orange-100 hover:bg-orange-200' : 'bg-green-100 hover:bg-green-200']">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-xs flex-1 two-lines font-medium text-gray-900">{{ cons.field_motif
                                        }}</span>
                                    <p class="text-xs text-green-500"
                                        v-if="cons.field_consultation_status == 'completed'"><i
                                            class="ri-checkbox-circle-line"></i> Payé</p>
                                    <p class="text-xs text-orange-500" v-else><i class="ri-time-line"></i> Non payé</p>
                                </div>
                                <div class="flex items-center justify-between mb-1">
                                    <p class="text-xs text-gray-600">
                                        <span>{{ cons.field_temperature }}°C </span>
                                        <span> - {{ cons.field_tension_arterielle }} mmHg</span>
                                    </p>
                                    <span class="text-xs text-gray-500"> {{ formatDate(null, cons.created, 'short')
                                        }}</span>
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
        <div class="p-4 border-t border-gray-200 space-y-2">
            <button @click="createConsultation"
                class="w-full py-2 bg-primary text-white !rounded-button font-medium text-sm whitespace-nowrap flex items-center justify-center space-x-2"
                style="transform: scale(1);">
                <div class="w-4 h-4 flex items-center justify-center">
                    <i class="ri-calendar-line"></i>
                </div>
                <span>Programmer consultation</span>
            </button>
            <button @click="sendClient"
                class="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 !rounded-button font-medium text-sm whitespace-nowrap flex items-center justify-center space-x-2">
                <div class="w-4 h-4 flex items-center justify-center">
                    <i class="ri-edit-line"></i>
                </div>
                <span>Modifier informations</span>
            </button>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useConsultationStore } from '../../stores/index.js';
import { formatDate } from '../../utils/formateDate.js';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

export default {
    name: 'Details',
    props: {
        clientToShow: {
            type: Object,
            required: true
        }
    },
    emits: ['closePannel', 'sendClient'],
    setup(props, { emit }) {
        const client = ref({});
        const consultationsStore = useConsultationStore();
        const router = useRouter();
        const closePannel = () => {
            emit('closePannel')
        }

        // historique

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
        watch(
            () => props.clientToShow,
            (newClient) => {
                client.value = newClient;
                updateFilter('field_client', newClient.nid, "=");
                fetchConsultations(queryOptions.value);
            },
            { immediate: true, deep: true }
        );

        function sendClient() {
            emit('sendClient', client.value);
        }

        function createConsultation() {
            router.push({
                name: 'consultations',
                query: {
                    client: client.value.nid
                }
            });
        }

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

        return {
            client,
            closePannel,
            consultationsStore,
            formatDate,
            sendClient,
            createConsultation,
            editConsultation,
        }
    }
}
</script>

<style></style>