<template>
    <div>
        <PageLoader v-if="loader" />
        <form class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4" @submit.prevent="handleSave">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nom du service<span class="text-red-500"> *</span>
                </label>
                <input type="text" v-model="form.title"
                    class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder="Ex: Consultation générale">
                <p v-if="errors.title" class="text-red-500 text-xs mt-1">Le nom du service est requis</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                    <div class="flex gap-2">
                        <select v-model="form.field_category"
                            class="flex-1 px-3 py-2.5 bg-white border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                            <option value="">Sélectionner une catégorie</option>
                            <option v-for="cat in serviceStore.categories.rows" :key="cat.tid" :value="cat.tid">
                                {{ cat.name || cat.title }}
                            </option>
                        </select>
                        <button type="button" @click="showNewCategory = !showNewCategory"
                            class="px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 whitespace-nowrap">
                            <i class="ri-add-line"></i>
                            Nouvelle
                        </button>
                    </div>
                    <div v-if="showNewCategory" class="mt-2 flex gap-2">
                        <input type="text" v-model="newCategoryName"
                            class="flex-1 px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            placeholder="Nom de la nouvelle catégorie"
                            @keyup.enter.prevent="addCategory">
                        <button type="button" @click="addCategory" :disabled="savingCategory || !newCategoryName.trim()"
                            class="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 whitespace-nowrap">
                            <i v-if="savingCategory" class="ri-loader-4-line animate-spin"></i>
                            <span v-else>Ajouter</span>
                        </button>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tarif (Ar)</label>
                    <input type="number" min="0" v-model="form.field_prix"
                        class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        placeholder="Optionnel">
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea v-model="form.field_description" rows="4"
                    class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder="Description détaillée de la prestation"></textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Instructions de préparation</label>
                <textarea v-model="form.field_preparation" rows="3"
                    class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder="Ex: à jeun"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="form.field_actif" class="rounded border-gray-300 text-primary focus:ring-primary">
                    <span class="text-sm text-gray-700">Actif (visible à la vente)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="formPublished" class="rounded border-gray-300 text-primary focus:ring-primary">
                    <span class="text-sm text-gray-700">Publié</span>
                </label>
            </div>

            <div class="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <button type="button"
                    class="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button whitespace-nowrap"
                    @click.prevent="cancel">
                    Annuler
                </button>
                <button type="submit"
                    class="px-6 py-2 bg-secondary text-white hover:bg-green-600 !rounded-button whitespace-nowrap">
                    {{ isEdit ? 'Mettre à jour' : 'Enregistrer' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useServiceStore } from '../../stores/index.js';
import { getService } from '../../services/service.js';
import PageLoader from '../PageLoader.vue';

export default {
    name: 'SaveService',
    components: { PageLoader },
    props: {
        serviceId: {
            type: [Number, String],
            default: null,
        },
        cancelTo: {
            type: String,
            default: '/services',
        },
        successTo: {
            type: String,
            default: '/services',
        },
    },
    setup(props) {
        const router = useRouter();
        const serviceStore = useServiceStore();
        const loader = ref(false);
        const isEdit = computed(() => Boolean(props.serviceId));
        const showNewCategory = ref(false);
        const newCategoryName = ref('');
        const savingCategory = ref(false);

        const form = reactive({
            entity_type: 'node',
            bundle: 'service',
            title: '',
            field_category: '',
            field_description: '',
            field_prix: '',
            field_preparation: '',
            field_actif: true,
            status: 1,
        });

        const errors = reactive({
            title: false,
        });

        const formPublished = computed({
            get: () => Number(form.status) === 1,
            set: (value) => {
                form.status = value ? 1 : 0;
            },
        });

        const resolveTaxonomyId = (field) => {
            if (!field) return '';
            if (typeof field === 'number' || typeof field === 'string') return field;
            return field.tid || field.target_id || '';
        };

        const loadService = async () => {
            if (!props.serviceId) return;

            try {
                loader.value = true;
                const params = [
                    'fields[]=nid',
                    'fields[]=title',
                    'fields[]=status',
                    'fields[]=field_category',
                    'fields[]=field_description',
                    'fields[]=field_prix',
                    'fields[]=field_preparation',
                    'fields[]=field_actif',
                ].join('&');
                const response = await getService(props.serviceId, params);
                const service = response.data;

                form.title = service.title || '';
                form.field_category = resolveTaxonomyId(service.field_category);
                form.field_description = service.field_description || '';
                form.field_prix = service.field_prix ?? '';
                form.field_preparation = service.field_preparation || '';
                form.field_actif = Boolean(Number(service.field_actif));
                form.status = service.status ?? 1;
            } catch (error) {
                toast.error('Impossible de charger le service.');
                router.push(props.cancelTo);
            } finally {
                loader.value = false;
            }
        };

        const validateForm = () => {
            errors.title = !form.title || form.title.trim() === '';
            return !errors.title;
        };

        const handleSave = async () => {
            if (!validateForm()) {
                return;
            }

            try {
                loader.value = true;

                const payload = {
                    entity_type: 'node',
                    bundle: 'service',
                    title: form.title.trim(),
                    field_category: form.field_category || '',
                    field_description: form.field_description || '',
                    field_prix: form.field_prix !== '' ? parseFloat(form.field_prix) : '',
                    field_preparation: form.field_preparation || '',
                    field_actif: form.field_actif ? 1 : 0,
                    status: form.status ?? 1,
                    ...(isEdit.value && props.serviceId ? { nid: Number(props.serviceId) } : {}),
                };

                Object.keys(payload).forEach((key) => {
                    if (payload[key] === '' || payload[key] === null || payload[key] === undefined) {
                        delete payload[key];
                    }
                });

                const response = await serviceStore.saveServiceItem(payload);
                if (!response?.data?.status) {
                    toast.error('Une erreur est survenue lors de l\'enregistrement.');
                    return;
                }

                toast.success(isEdit.value ? 'Service mis à jour avec succès.' : 'Service enregistré avec succès.');
                router.push(props.successTo);
            } catch (error) {
                toast.error('Une erreur est survenue lors de l\'enregistrement.');
            } finally {
                loader.value = false;
            }
        };

        const cancel = () => {
            router.push(props.cancelTo);
        };

        const addCategory = async () => {
            const name = newCategoryName.value.trim();
            if (!name) {
                return;
            }

            const exists = serviceStore.categories.rows.some(
                (cat) => (cat.name || cat.title || '').toLowerCase() === name.toLowerCase(),
            );
            if (exists) {
                toast.error('Cette catégorie existe déjà.');
                return;
            }

            try {
                savingCategory.value = true;
                const response = await serviceStore.createCategory(name);
                if (!response?.data?.status || !response?.data?.item) {
                    toast.error('Impossible de créer la catégorie.');
                    return;
                }

                const tid = response.data.item;
                await serviceStore.fetchCategories(categoryQueryOptions);
                form.field_category = tid;
                newCategoryName.value = '';
                showNewCategory.value = false;
                toast.success('Catégorie ajoutée.');
            } catch (error) {
                toast.error('Une erreur est survenue lors de la création de la catégorie.');
            } finally {
                savingCategory.value = false;
            }
        };

        const categoryQueryOptions = {
            fields: ['tid', 'name', 'title'],
            sort: { val: 'name', op: 'asc' },
            pager: 0,
            offset: 1000,
        };

        onMounted(async () => {
            await serviceStore.fetchCategories(categoryQueryOptions);
            await loadService();
        });

        return {
            serviceStore,
            form,
            formPublished,
            errors,
            loader,
            isEdit,
            showNewCategory,
            newCategoryName,
            savingCategory,
            handleSave,
            cancel,
            addCategory,
        };
    },
};
</script>
