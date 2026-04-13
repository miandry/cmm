<template>
    <div>

        <!-- Modal for Specialite - docteur -->
        <div v-if="showSpecialitiesModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-bold text-gray-800">Gestion des Spécialités</h2>
                        <button @click="closeSpecialitiesModal" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <!-- Tabs -->
                    <div class="border-b border-gray-200 mb-6">
                        <nav class="flex gap-4">
                            <button @click="activeTab = 'add'; resetForm()" :class="[
                                'px-4 py-2 font-medium transition-colors relative',
                                activeTab === 'add'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-gray-500 hover:text-gray-700'
                            ]">
                                Ajouter une spécialité
                            </button>
                            <button @click="activeTab = 'list'; fetchSpecialities()" :class="[
                                'px-4 py-2 font-medium transition-colors relative',
                                activeTab === 'list'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-gray-500 hover:text-gray-700'
                            ]">
                                Liste des spécialités
                            </button>
                        </nav>
                    </div>

                    <!-- Tab Content: Ajouter une spécialité -->
                    <div v-if="activeTab === 'add'">
                        <form @submit.prevent="saveSpecialty" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Nom de la spécialité <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.title" type="text" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Ex: Cardiologie, Pédiatrie, etc.">
                                <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Montant de consultation (Ar) <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.field_montant_consultation" type="number" required min="0"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Ex: 50000">
                                <p v-if="errors.amount" class="text-red-500 text-xs mt-1">{{ errors.amount }}</p>
                            </div>

                            <!-- Message d'erreur/succès -->
                            <div v-if="formMessage" :class="[
                                'p-3 rounded-lg text-sm',
                                formMessageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            ]">
                                {{ formMessage }}
                            </div>

                            <div class="flex gap-3 pt-4">
                                <button type="button" @click="closeSpecialitiesModal"
                                    class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" :disabled="saving"
                                    class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
                                    {{ saving ? 'Enregistrement...' : 'Ajouter la spécialité' }}
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Tab Content: Liste des spécialités -->
                    <div v-if="activeTab === 'list'">
                        <!-- Loading state -->
                        <div v-if="loading" class="text-center py-8">
                            <i class="fas fa-spinner fa-spin text-2xl text-primary mb-2"></i>
                            <p class="text-gray-500">Chargement des spécialités...</p>
                        </div>

                        <!-- Empty state -->
                        <div v-else-if="specialityStore.specialities.rows?.length === 0"
                            class="text-center py-8 text-gray-500">
                            <i class="fas fa-stethoscope text-3xl mb-2 text-gray-300"></i>
                            <p>Aucune spécialité enregistrée</p>
                            <button @click="activeTab = 'add'" class="mt-3 text-primary hover:underline text-sm">
                                Ajouter une spécialité
                            </button>
                        </div>

                        <!-- Liste des spécialités -->
                        <div v-else class="space-y-3">
                            <div v-for="specialty in specialityStore.specialities.rows" :key="specialty.nid"
                                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div class="flex-1">
                                    <h3 class="font-semibold text-gray-800">{{ specialty.title }}</h3>
                                    <p class="text-sm text-gray-600">
                                        {{ Number(specialty.field_montant_consultation).toLocaleString('fr-FR') }} Ar
                                    </p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button @click="openEditModal(specialty)"
                                        class="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-colors"
                                        title="Modifier">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Pagination -->
                        <div v-if="totalPages > 1"
                            class="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                            <div class="text-sm text-gray-500">
                                Affichage de {{ startIndex }} à {{ endIndex }} sur {{ specialityStore.specialities.total
                                    ||
                                    0 }}
                                spécialités
                            </div>
                            <div class="flex items-center space-x-2">
                                <button @click="previousPage" :disabled="currentPage === 1"
                                    class="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                                    class="px-3 py-2 rounded-md transition-colors text-sm font-medium" :class="page === currentPage
                                        ? 'bg-primary text-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'">
                                    {{ page }}
                                </button>
                                <button @click="nextPage" :disabled="currentPage === totalPages"
                                    class="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal d'édition -->
        <div v-if="showEditModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-bold text-gray-800">Modifier la spécialité</h2>
                        <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <form @submit.prevent="updateSpecialty" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Nom de la spécialité <span class="text-red-500">*</span>
                            </label>
                            <input v-model="editForm.title" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Montant de consultation (Ar) <span class="text-red-500">*</span>
                            </label>
                            <input v-model="editForm.field_montant_consultation" type="number" required min="0"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>

                        <div v-if="editMessage" :class="[
                            'p-3 rounded-lg text-sm',
                            editMessageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        ]">
                            {{ editMessage }}
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="button" @click="closeEditModal"
                                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                Annuler
                            </button>
                            <button type="submit" :disabled="updating"
                                class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                                <i v-if="updating" class="fas fa-spinner fa-spin mr-2"></i>
                                {{ updating ? 'Mise à jour...' : 'Mettre à jour' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { ref, reactive, computed, defineEmits } from 'vue';
import { useSpecialityStore } from '../stores/index.js';
import { toast } from 'vue-sonner';

export default {
    name: 'DocteurSpecialities',
    emits: ['specialities-updated'],
    setup(props, { emit }) {
        // Store de spécialité
        const specialityStore = useSpecialityStore();

        // Paramètres de requête
        const perPage = 15;
        const currentPage = ref(1);

        const specialityQueryOptions = ref({
            fields: [
                'nid',
                'title',
                'status',
                'created',
                'field_montant_consultation',
            ],
            sort: { val: 'title', op: 'ASC' },
            filters: {
                status: {
                    val: 1,
                    op: "="
                },
            },
            pager: 0,
            offset: perPage,
        });

        // État du modal principal
        const showSpecialitiesModal = ref(false);
        const activeTab = ref('add');
        const loading = ref(false);
        const saving = ref(false);
        const updating = ref(false);

        // Formulaire d'ajout
        const form = reactive({
            entity_type: "node",
            bundle: "specialite_docteur",
            status: 1,
            title: '',
            field_montant_consultation: '',
        });

        // Erreurs du formulaire
        const errors = reactive({
            title: '',
            amount: ''
        });

        // Messages
        const formMessage = ref('');
        const formMessageType = ref('success');

        // Édition
        const showEditModal = ref(false);
        const editForm = reactive({
            nid: '',
            title: '',
            field_montant_consultation: ''
        });
        const editMessage = ref('');
        const editMessageType = ref('success');

        // Pagination
        const totalPages = computed(() => Math.ceil((specialityStore.specialities.total || 0) / perPage));

        const startIndex = computed(() => {
            if (!specialityStore.specialities.rows?.length) return 0;
            return ((currentPage.value - 1) * perPage) + 1;
        });

        const endIndex = computed(() => {
            if (!specialityStore.specialities.rows?.length) return 0;
            const end = currentPage.value * perPage;
            return Math.min(end, specialityStore.specialities.total || 0);
        });

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

        // Mettre à jour une spécialité dans le store localement
        const updateSpecialtyInStore = (nid, updatedData) => {
            const index = specialityStore.specialities.rows.findIndex(s => s.nid == nid);
            if (index !== -1) {
                // Mettre à jour les données localement
                specialityStore.specialities.rows[index] = {
                    ...specialityStore.specialities.rows[index],
                    title: updatedData.title,
                    field_montant_consultation: updatedData.field_montant_consultation
                };
            }
        };

        // Fonctions de pagination
        const goToPage = async (page) => {
            if (page === '...') return;
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
                specialityQueryOptions.value.pager = page - 1;
                await fetchSpecialities();
            }
        };

        const nextPage = async () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
                specialityQueryOptions.value.pager = currentPage.value - 1;
                await fetchSpecialities();
            }
        };

        const previousPage = async () => {
            if (currentPage.value > 1) {
                currentPage.value--;
                specialityQueryOptions.value.pager = currentPage.value - 1;
                await fetchSpecialities();
            }
        };

        // Récupérer les spécialités
        const fetchSpecialities = async () => {
            loading.value = true;
            try {
                await specialityStore.fetchSpecialities(specialityQueryOptions.value);
            } catch (error) {
                console.error('Erreur lors du chargement des spécialités:', error);
                toast.error('Erreur lors du chargement des spécialités');
            } finally {
                loading.value = false;
            }
        };

        // Valider le formulaire d'ajout
        const validateForm = () => {
            let isValid = true;
            errors.title = '';
            errors.amount = '';

            if (!form.title.trim()) {
                errors.title = 'Le nom de la spécialité est requis';
                isValid = false;
            }

            if (!form.field_montant_consultation) {
                errors.amount = 'Le montant de consultation est requis';
                isValid = false;
            } else if (form.field_montant_consultation <= 0) {
                errors.amount = 'Le montant doit être supérieur à 0';
                isValid = false;
            }

            return isValid;
        };

        // Valider le formulaire d'édition
        const validateEditForm = () => {
            let isValid = true;

            if (!editForm.title.trim()) {
                editMessageType.value = 'error';
                editMessage.value = 'Le nom de la spécialité est requis';
                isValid = false;
            } else if (!editForm.field_montant_consultation || editForm.field_montant_consultation <= 0) {
                editMessageType.value = 'error';
                editMessage.value = 'Le montant de consultation doit être supérieur à 0';
                isValid = false;
            }

            return isValid;
        };

        // Réinitialiser le formulaire
        const resetForm = () => {
            form.title = '';
            form.field_montant_consultation = '';
            errors.title = '';
            errors.amount = '';
            formMessage.value = '';
        };

        // Fonction unifiée pour sauvegarder (création ou mise à jour)
        const saveSpecialtyData = async (payload, isEdit = false) => {
            try {
                await specialityStore.saveSpecialityData(payload);

                if (!specialityStore.error) {
                    if (isEdit) {
                        // Mettre à jour localement sans requête
                        updateSpecialtyInStore(payload.nid, {
                            title: payload.title,
                            field_montant_consultation: payload.field_montant_consultation
                        });

                        editMessageType.value = 'success';
                        editMessage.value = 'Spécialité mise à jour avec succès !';

                        setTimeout(() => {
                            closeEditModal();
                            toast.success('Spécialité mise à jour avec succès');
                        }, 1000);
                    } else {
                        formMessageType.value = 'success';
                        formMessage.value = 'Spécialité ajoutée avec succès !';
                        resetForm();

                        setTimeout(() => {
                            activeTab.value = 'list';
                            currentPage.value = 1;
                            specialityQueryOptions.value.pager = 0;
                            fetchSpecialities();
                            formMessage.value = '';
                        }, 1000);
                    }
                    return true;
                } else {
                    const errorMsg = specialityStore.error || 'Une erreur est survenue';
                    if (isEdit) {
                        editMessageType.value = 'error';
                        editMessage.value = errorMsg;
                    } else {
                        formMessageType.value = 'error';
                        formMessage.value = errorMsg;
                    }
                    return false;
                }
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
                const errorMsg = error.response?.data?.message || 'Une erreur est survenue';
                if (isEdit) {
                    editMessageType.value = 'error';
                    editMessage.value = errorMsg;
                } else {
                    formMessageType.value = 'error';
                    formMessage.value = errorMsg;
                }
                return false;
            }
        };

        // Sauvegarder une nouvelle spécialité
        const saveSpecialty = async () => {
            if (!validateForm()) return;

            saving.value = true;
            formMessage.value = '';

            const payload = {
                ...form,
                title: form.title,
                field_specialite_medicale: form.title,
            };

            const success = await saveSpecialtyData(payload, false);
            if (success) {
                // Émettre l'événement pour notifier UserManager
                emit('specialities-updated');
            }
            saving.value = false;
        };

        // Ouvrir le modal d'édition
        const openEditModal = (specialty) => {
            editForm.nid = specialty.nid;
            editForm.title = specialty.title;
            editForm.field_montant_consultation = specialty.field_montant_consultation;
            editMessage.value = '';
            showEditModal.value = true;
        };

        // Fermer le modal d'édition
        const closeEditModal = () => {
            showEditModal.value = false;
            editForm.nid = '';
            editForm.title = '';
            editForm.field_montant_consultation = '';
            editMessage.value = '';
        };

        // Mettre à jour une spécialité
        const updateSpecialty = async () => {
            if (!validateEditForm()) return;

            updating.value = true;
            editMessage.value = '';

            const payload = {
                entity_type: "node",
                bundle: "specialite_docteur",
                nid: editForm.nid,
                title: editForm.title,
                field_montant_consultation: editForm.field_montant_consultation,
                field_specialite_medicale: editForm.title,
                status: 1,
            };

            const success = await saveSpecialtyData(payload, true);
            if (success) {
                // Émettre l'événement pour notifier UserManager
                emit('specialities-updated');
            }
            updating.value = false;
        };

        // Ouvrir le modal principal
        const openSpecialitiesModal = () => {
            showSpecialitiesModal.value = true;
            activeTab.value = 'add';
            resetForm();
            formMessage.value = '';
        };

        // Fermer le modal principal
        const closeSpecialitiesModal = () => {
            showSpecialitiesModal.value = false;
            activeTab.value = 'add';
            resetForm();
        };

        return {
            // Store
            specialityStore,
            // État du modal
            showSpecialitiesModal,
            activeTab,
            loading,
            saving,
            updating,
            // Formulaire
            form,
            errors,
            formMessage,
            formMessageType,
            // Édition
            showEditModal,
            editForm,
            editMessage,
            editMessageType,
            // Pagination
            currentPage,
            totalPages,
            visiblePages,
            startIndex,
            endIndex,
            // Méthodes
            fetchSpecialities,
            saveSpecialty,
            resetForm,
            openEditModal,
            closeEditModal,
            updateSpecialty,
            openSpecialitiesModal,
            closeSpecialitiesModal,
            goToPage,
            nextPage,
            previousPage,
        };
    }
}
</script>

<style scoped>
/* Styles supplémentaires si nécessaire */
</style>