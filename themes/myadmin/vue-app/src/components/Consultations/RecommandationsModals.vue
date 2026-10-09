<template>
    <div>
        <div class="flex items-center justify-between mb-4">
            <h4 class="text-base font-medium text-gray-900">Services prescrits</h4>
            <button @click="isModalOpen = true" v-if="!isEdit"
                class="px-3 py-2 bg-primary text-white !rounded-button text-sm font-medium whitespace-nowrap flex items-center space-x-2 cursor-pointer">
                <div class="w-4 h-4 flex items-center justify-center">
                    <i class="ri-add-line"></i>
                </div>
                <span>Ajouter un service</span>
            </button>
        </div>
        <div class="space-y-3 mb-4" v-if="selectedServices.length">
            <div v-for="service in selectedServices" :key="service.nid"
                class="flex items-center justify-between p-3 border border-gray-200 !rounded-button">
                <div class="flex-1">
                    <h4 class="font-medium text-gray-900 text-xs">{{ service.title }}</h4>
                    <p class="text-xs text-gray-500">{{ Number(service.field_prix || 0).toLocaleString() }} Ar</p>
                </div>
                <div class="flex items-center">
                    <button @click="removeService(service.nid)" v-if="!isEdit"
                        class="text-red-500 hover:text-red-700 cursor-pointer">
                        <div class="w-5 h-5 flex items-center justify-center">
                            <i class="ri-delete-bin-line"></i>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 mb-4" v-if="selectedServices.length">
            <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">Total des services :</span>
                <span class="text-sm font-semibold text-primary">{{ serviceTotal.toLocaleString() }} Ar</span>
            </div>
        </div>
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Conseils
                    hygiéno-diététiques</label>
                <textarea rows="3" v-model="conseils"
                    class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Conseils sur l'alimentation, l'hygiène de vie, l'activité physique..."></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Précautions
                        particulières</label>
                    <textarea rows="3" v-model="precautions"
                        class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Précautions à prendre..."></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Signes d'alerte</label>
                    <textarea rows="3" v-model="signes"
                        class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Signes nécessitant une consultation urgente..."></textarea>
                </div>
            </div>
        </div>
        <!-- MOdal -->
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50" v-if="isModalOpen">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Ajouter un service</h3>
                            <button @click="isModalOpen = false"
                                class="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <div class="w-6 h-6 flex items-center justify-center">
                                    <i class="ri-close-line text-xl"></i>
                                </div>
                            </button>
                        </div>
                        <form class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Service <span
                                        class="text-red-500">*</span></label>
                                <div class="relative">
                                    <div
                                        class="w-4 h-4 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <i class="ri-search-line text-sm"></i>
                                    </div>
                                    <input type="text" v-model="searchKeywords" @input="serviceSearch"
                                        placeholder="Rechercher un service..."
                                        class="w-full pl-10 pr-4 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        autocomplete="off">
                                    <div v-if="showServiceList"
                                        class="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto z-10">
                                        <div v-for="service in serviceResults" :key="service.nid"
                                            @click="selectService(service)"
                                            class="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                                            <div class="flex items-center justify-between">
                                                <div class="flex-1">
                                                    <h5 class="text-xs font-medium text-gray-900">{{ service.title }}</h5>
                                                </div>
                                                <span class="text-xs font-semibold text-primary">{{
                                                    Number(service.field_prix || 0).toLocaleString() }} Ar</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p class="text-xs text-red-500" v-if="formError.nid">Sélectionnez un service</p>
                                <div class="flex items-center justify-between mt-2">
                                    <span class="text-xs text-gray-500">Seuls les services actifs sont proposés</span>
                                </div>
                            </div>
                            <div v-if="selectedService" class="p-2 bg-blue-50 rounded-lg border border-blue-200">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h4 class="text-sm font-medium text-blue-900">{{ selectedService.title }}</h4>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm font-semibold text-blue-900">{{
                                            Number(selectedService.field_prix || 0).toLocaleString() }} Ar</p>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div class="flex space-x-3 mt-6">
                            <button @click="isModalOpen = false"
                                class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button font-medium whitespace-nowrap cursor-pointer">
                                Annuler
                            </button>
                            <button @click="addSelectedService"
                                class="flex-1 px-4 py-2 bg-primary text-white hover:bg-blue-600 !rounded-button font-medium whitespace-nowrap cursor-pointer">
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive, ref, defineExpose } from 'vue';
import { getServices } from '../../services/service.js';
import { buildQueryParams } from '../../utils/queryBuilder.js';
import { toast } from 'vue-sonner';

export default {
    name: 'RecommandationsModals',
    setup() {
        const isModalOpen = ref(false);
        const isEdit = ref(false);
        const showServiceList = ref(false);
        const serviceResults = ref([]);
        const selectedService = ref(null);
        const selectedServices = ref([]);
        const conseils = ref('');
        const precautions = ref('');
        const signes = ref('');
        const searchKeywords = ref('');
        const serviceTotal = computed(() => selectedServices.value.reduce(
            (total, service) => total + (Number(service.field_prix) || 0), 0
        ));
        const formError = reactive({
            nid: false,
        })

        const serviceQueryOptions = ref({
            fields: [
                'nid',
                'title',
                'field_prix',
                'status',
                'field_actif',
            ],
            sort: { val: 'title', op: 'asc' },
            filters: {
                status: {
                    val: 1,
                    op: "="
                },
                field_actif: {
                    val: 1,
                    op: "="
                }
            },
            pager: 0,
            offset: 20
        })

        const serviceSearch = async () => {
            const keyword = searchKeywords.value.trim();
            showServiceList.value = Boolean(keyword);
            selectedService.value = null;
            formError.nid = false;
            if (!keyword) {
                serviceResults.value = [];
                return;
            }
            serviceQueryOptions.value.filters.title = { val: keyword, op: 'CONTAINS' };
            try {
                const query = buildQueryParams(serviceQueryOptions.value);
                const response = await getServices(query);
                serviceResults.value = response.data?.rows || [];
            } catch (error) {
                console.error('Erreur lors du chargement des services', error);
                serviceResults.value = [];
            }
        }

        const selectService = (service) => {
            selectedService.value = service;
            searchKeywords.value = service.title;
            showServiceList.value = false;
        }

        function resetForm() {
            showServiceList.value = false;
            serviceResults.value = [];
            selectedService.value = null;
            searchKeywords.value = '';
            formError.nid = false;
        }

        const addSelectedService = () => {
            if (!selectedService.value) {
                formError.nid = true;
                return;
            }
            const service = selectedService.value;
            if (selectedServices.value.some((item) => String(item.nid) === String(service.nid))) {
                toast.error('Ce service est déjà ajouté.');
                return;
            }
            selectedServices.value.push({
                nid: service.nid,
                title: service.title,
                field_prix: Number(service.field_prix) || 0,
            });
            resetForm();
            isModalOpen.value = false;
        }

        const removeService = (nid) => {
            selectedServices.value = selectedServices.value.filter(
                (service) => String(service.nid) !== String(nid)
            );
        };

        function getRecommandationData() {
            return {
                conseil: conseils.value,
                precautions: precautions.value,
                signes: signes.value,
                services: selectedServices.value,
            }
        }

        function resetAll() {
            resetForm();
            selectedServices.value = [];
            conseils.value = "";
            precautions.value = "";
            signes.value = "";
        }

        function setData(services = [], otherFields = {}) {
            resetAll();
            conseils.value = otherFields.conseil || '';
            precautions.value = otherFields.precaution || '';
            signes.value = otherFields.signe || '';

            selectedServices.value = (services || []).map((service) => {
                const reference = service.field_service || service;
                return {
                    nid: reference.nid || reference.target_id || service.target_id,
                    title: reference.title || service.title || 'Service',
                    field_prix: Number(reference.field_prix ?? service.field_prix) || 0,
                };
            }).filter((service) => service.nid);
            isEdit.value = selectedServices.value.length > 0;
        }

        defineExpose({
            getRecommandationData,
            resetAll,
            setData,
        })


        return {
            isModalOpen,
            serviceSearch,
            serviceResults,
            showServiceList,
            selectService,
            selectedService,
            selectedServices,
            serviceTotal,
            formError,
            addSelectedService,
            searchKeywords,
            removeService,
            conseils,
            precautions,
            signes,
            getRecommandationData,
            resetAll,
            setData,
            isEdit
        }

    }
}
</script>

<style></style>