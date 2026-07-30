<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Choisir un praticien</h3>
                            <p v-if="cartItem?.title" class="text-xs text-gray-500 mt-1">{{ cartItem.title }}</p>
                        </div>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600" :disabled="confirming || saving">
                            <i class="ri-close-line text-xl"></i>
                        </button>
                    </div>

                    <div v-if="!showNewForm">
                        <div class="relative mb-3">
                            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <i class="ri-search-line text-sm"></i>
                            </div>
                            <input type="text" v-model="searchKeyword" @input="onSearch"
                                placeholder="Rechercher un praticien..."
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        </div>

                        <div class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg mb-3">
                            <div v-if="loading" class="flex flex-col items-center justify-center py-6">
                                <i class="ri-loader-4-line animate-spin text-primary text-2xl"></i>
                                <p class="text-xs text-gray-500 mt-2">Chargement...</p>
                            </div>
                            <div v-else-if="filteredPraticiens.length">
                                <div v-for="(praticien, index) in filteredPraticiens" :key="praticien.nid"
                                    @click="selectPraticien(praticien.nid, index)"
                                    class="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    :class="selectedIndex === index ? 'bg-blue-50 border-l-4 border-primary' : ''">
                                    <div class="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-medium uppercase">
                                        {{ (praticien.title || '?').slice(0, 2) }}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 truncate">{{ praticien.title }}</p>
                                        <p class="text-xs text-gray-500 truncate">
                                            {{ getTypeLabel(praticien.field_type_praticien) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="py-6 text-center text-xs text-gray-500">
                                Aucun praticien trouvé.
                            </div>
                        </div>

                        <button type="button" @click="showNewForm = true"
                            class="w-full px-3 py-2 mb-4 border-2 border-dashed border-gray-300 hover:border-primary text-gray-600 hover:text-primary rounded-lg font-medium text-sm flex items-center justify-center gap-2">
                            <i class="ri-add-line"></i>
                            Ajouter un nouveau praticien
                        </button>

                        <div class="flex space-x-3">
                            <button type="button" @click="closeModal" :disabled="confirming"
                                class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium disabled:opacity-50">
                                Annuler
                            </button>
                            <button type="button" @click="confirmSelection" :disabled="confirming || !selectedNid"
                                class="flex-1 px-4 py-2 bg-primary text-white hover:bg-blue-600 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                                <i v-if="confirming" class="ri-loader-4-line animate-spin"></i>
                                <span>{{ confirming ? 'En cours...' : 'Confirmer' }}</span>
                            </button>
                        </div>
                    </div>

                    <form v-else @submit.prevent="submitNewPraticien" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                            <input v-model="newForm.title" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Ex: Dr. Rakoto Jean">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                            <select v-model="newForm.field_type_praticien" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="">Sélectionner un type</option>
                                <option v-for="type in serviceStore.typePraticiens.rows" :key="type.tid" :value="type.tid">
                                    {{ type.name || type.title }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                            <input v-model="newForm.field_phone" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Ex: 034 00 000 00">
                        </div>
                        <div class="flex space-x-3 pt-2">
                            <button type="button" @click="showNewForm = false" :disabled="saving"
                                class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium disabled:opacity-50">
                                Retour
                            </button>
                            <button type="submit" :disabled="saving || !newForm.title.trim() || !newForm.field_type_praticien"
                                class="flex-1 px-4 py-2 bg-secondary text-white hover:bg-green-600 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                                <i v-if="saving" class="ri-loader-4-line animate-spin"></i>
                                <span>{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { debounce } from 'lodash';
import { toast } from 'vue-sonner';
import { useServiceStore } from '../../stores/index.js';

export default {
    name: 'PraticienSelectModal',
    props: {
        cartItem: {
            type: Object,
            default: null,
        },
    },
    emits: ['close', 'selected'],
    setup(props, { emit }) {
        const serviceStore = useServiceStore();
        const searchKeyword = ref('');
        const selectedNid = ref(null);
        const selectedIndex = ref(null);
        const loading = ref(false);
        const confirming = ref(false);
        const saving = ref(false);
        const showNewForm = ref(false);

        const newForm = reactive({
            title: '',
            field_type_praticien: '',
            field_phone: '',
        });

        const baseOptions = computed(() => {
            if (!props.cartItem) {
                return serviceStore.praticiens.rows || [];
            }
            return serviceStore.getPractitionerOptions(props.cartItem);
        });

        const filteredPraticiens = computed(() => {
            const keyword = searchKeyword.value.trim().toLowerCase();
            if (!keyword) {
                return baseOptions.value;
            }
            return baseOptions.value.filter((row) =>
                (row.title || '').toLowerCase().includes(keyword),
            );
        });

        const getTypeLabel = (field) => {
            if (!field) return '—';
            if (typeof field === 'string' || typeof field === 'number') {
                const found = serviceStore.typePraticiens.rows.find(
                    (row) => String(row.tid) === String(field),
                );
                return found?.name || found?.title || '—';
            }
            return field.name || field.title || '—';
        };

        const loadPraticiens = async () => {
            loading.value = true;
            try {
                await serviceStore.fetchPraticiens({
                    fields: ['nid', 'title', 'field_type_praticien', 'field_phone', 'field_actif', 'status'],
                    filters: {
                        status: { val: 1, op: '=' },
                        field_actif: { val: 1, op: '=' },
                    },
                    values: {
                        field_type_praticien: ['tid', 'name', 'title'],
                    },
                    sort: { val: 'title', op: 'asc' },
                    pager: 0,
                    offset: 500,
                });
            } finally {
                loading.value = false;
            }
        };

        const onSearch = debounce(() => {
            // Local filter only.
        }, 300);

        const selectPraticien = (nid, index) => {
            if (confirming.value) return;
            selectedNid.value = nid;
            selectedIndex.value = index;
        };

        const confirmSelection = () => {
            if (!selectedNid.value || confirming.value) return;
            const praticien = filteredPraticiens.value.find(
                (row) => String(row.nid) === String(selectedNid.value),
            ) || baseOptions.value.find((row) => String(row.nid) === String(selectedNid.value));

            if (!praticien) {
                toast.error('Praticien introuvable.');
                return;
            }

            confirming.value = true;
            emit('selected', praticien);
            confirming.value = false;
            emit('close');
        };

        const submitNewPraticien = async () => {
            if (saving.value || !newForm.title.trim() || !newForm.field_type_praticien) {
                return;
            }

            saving.value = true;
            try {
                const response = await serviceStore.createPraticien({
                    entity_type: 'node',
                    bundle: 'praticien',
                    title: newForm.title.trim(),
                    field_type_praticien: newForm.field_type_praticien,
                    field_phone: newForm.field_phone.trim(),
                    field_actif: 1,
                    status: 1,
                });

                if (!response?.data?.status || !response?.data?.item) {
                    toast.error('Impossible de créer le praticien.');
                    return;
                }

                const praticien = {
                    nid: response.data.item,
                    title: newForm.title.trim(),
                };

                await loadPraticiens();
                emit('selected', praticien);
                toast.success('Praticien ajouté.');
                emit('close');
            } catch (error) {
                toast.error('Une erreur est survenue lors de la création.');
            } finally {
                saving.value = false;
            }
        };

        const closeModal = () => {
            if (confirming.value || saving.value) return;
            emit('close');
        };

        watch(
            () => props.cartItem,
            (item) => {
                if (!item) return;
                selectedNid.value = item.field_praticien || null;
                const options = serviceStore.getPractitionerOptions(item);
                selectedIndex.value = options.findIndex(
                    (row) => String(row.nid) === String(item.field_praticien),
                );
                if (selectedIndex.value < 0) selectedIndex.value = null;
            },
            { immediate: true },
        );

        onMounted(async () => {
            await Promise.all([
                loadPraticiens(),
                serviceStore.fetchTypePraticiens({
                    fields: ['tid', 'name', 'title'],
                    sort: { val: 'name', op: 'asc' },
                    pager: 0,
                    offset: 100,
                }),
            ]);
        });

        return {
            serviceStore,
            searchKeyword,
            selectedNid,
            selectedIndex,
            loading,
            confirming,
            saving,
            showNewForm,
            newForm,
            filteredPraticiens,
            getTypeLabel,
            onSearch,
            selectPraticien,
            confirmSelection,
            submitNewPraticien,
            closeModal,
        };
    },
};
</script>
