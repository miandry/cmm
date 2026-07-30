<template>
    <div>
        <PageLoader v-if="loader" />
        <form class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3" @submit.prevent="handleSaveArticle">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom du produit<span
                        class="text-red-500"> *</span></label>
                <input type="text" v-model="form.title"
                    class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder="Ex: Paracétamol 500mg">
                <p v-if="errors.title" class="text-red-500 text-xs mt-1">Le nom du produit est requis</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Type pack<span
                            class="text-red-500"> *</span></label>
                    <select v-model="form.field_type_pack"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                        <option value="">Sélectionner une type pack</option>
                        <option v-for="pack in articleStore.packs.rows" :key="pack.tid" :value="pack.tid">
                            {{ pack.name }}
                        </option>
                    </select>
                    <p v-if="errors.field_type_pack" class="text-red-500 text-xs mt-1">Le type du pack est requis</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nbr unité par pack<span
                            class="text-red-500"> *</span></label>
                    <input type="number" min="1" v-model="form.field_nombre_par_unite"
                        class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                    <p v-if="errors.field_nombre_par_unite" class="text-red-500 text-xs mt-1">Veuillez ajouter une
                        quantité supérieure à 0</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                    <select v-model="form.field_categorie"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                        <option value="">Sélectionner une catégorie</option>
                        <option v-for="cat in articleStore.categories.rows" :key="cat.tid" :value="cat.tid">
                            {{ cat.name }}
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Prix unitaire (Ar)<span
                            class="text-red-500"> *</span></label>
                    <input type="number" v-model="form.field_prix_unitaire" min="0"
                        class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        placeholder="0">
                    <p v-if="errors.field_prix_unitaire" class="text-red-500 text-xs mt-1">Veuillez ajouter un prix
                        supérieur à 0</p>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Posologie de référence</label>
                <textarea v-model="form.field_posologie"
                    class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    rows="3" placeholder="Description détaillée du produit"></textarea>
            </div>

            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Image du article</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div class="text-center mb-4">
                        <div class="w-40 h-40 mx-auto relative">
                            <div v-if="!imagePreview"
                                class="w-full h-full flex items-center justify-center bg-gray-100 rounded-button">
                                <i class="ri-image-line text-4xl text-gray-400"></i>
                            </div>
                            <div v-else>
                                <img :src="imagePreview" alt="Preview de l'image"
                                    class="w-full h-full object-cover object-top rounded-button">
                                <span
                                    class="border px-1 py-0 border-red-500 rounded-button cursor-pointer absolute top-0 right-0 bg-white"
                                    @click="removeImage">
                                    <i class="ri-close-line text-red-500 text-lg"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="text-center">
                        <button type="button"
                            class="!rounded-button bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                            @click="triggerFileInput">
                            <i v-if="!imagePreview" class="fas fa-camera w-4 h-4 mr-2"></i>
                            <i v-else class="fas fa-sync w-4 h-4 mr-2"></i>
                            {{ imagePreview ? 'Changer l\'image' : 'Ajouter une image' }}
                        </button>
                        <p v-if="imageName" class="text-xs text-gray-500 mt-2">
                            {{ imageName }} ({{ formatFileSize(imageSize) }})
                        </p>
                        <p v-else class="text-xs text-gray-500 mt-2">JPG, JPEG, PNG (max. 10MB)</p>
                        <input type="file" ref="fileInput" hidden @change="handleImageUpload"
                            accept=".jpg,.jpeg,.png">
                    </div>
                    <p v-if="imageError" class="text-red-500 text-xs text-center mt-2">{{ imageError }}</p>
                </div>
            </div>

            <div class="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <button type="button"
                    class="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button whitespace-nowrap"
                    @click.prevent="cancelAdd">
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
import { useArticleStore } from '../../stores/index.js';
import { getArticle } from '../../services/article.js';
import PageLoader from '../PageLoader.vue';
import { toast } from 'vue-sonner';

export default {
    name: "SaveArticle",
    components: {
        PageLoader
    },
    props: {
        articleId: {
            type: [Number, String],
            default: null,
        },
        cancelTo: {
            type: String,
            default: '/stocks',
        },
        successTo: {
            type: String,
            default: '/stocks',
        },
    },
    setup(props) {
        const router = useRouter();
        const articleStore = useArticleStore();
        const loader = ref(false)
        const fileInput = ref(null)
        const isEdit = computed(() => Boolean(props.articleId))

        const imagePreview = ref(null)
        const imageName = ref('')
        const imageSize = ref(0)
        const imageError = ref('')
        const base64Image = ref(null)

        const form = reactive({
            entity_type: "node",
            bundle: "article",
            title: "",
            field_categorie: "",
            field_prix_unitaire: "",
            field_quantite_stock: 0,
            field_posologie: "",
            field_type_pack: "",
            status: 1,
            field_nombre_par_unite: 1,
        })

        const errors = reactive({
            title: false,
            field_prix_unitaire: false,
            field_quantite_stock: false,
            field_nombre_par_unite: false,
            field_type_pack: false,
        });

        const triggerFileInput = () => {
            fileInput.value.click()
        }

        const validateImage = (file) => {
            imageError.value = ''
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
            if (!allowedTypes.includes(file.type)) {
                imageError.value = 'Format non supporté. Utilisez JPG, JPEG ou PNG.'
                return false
            }
            const maxSize = 10 * 1024 * 1024
            if (file.size > maxSize) {
                imageError.value = 'L\'image est trop volumineuse (max 10MB).'
                return false
            }
            return true
        }

        const handleImageUpload = (event) => {
            const file = event.target.files[0]
            if (!file) return

            if (!validateImage(file)) {
                event.target.value = ""
                return
            }

            imageName.value = file.name
            imageSize.value = file.size

            const reader = new FileReader()
            reader.onload = (e) => {
                const result = e.target.result
                imagePreview.value = result
                base64Image.value = result
            }
            reader.onerror = () => {
                imageError.value = 'Erreur lors de la lecture du fichier'
                event.target.value = ""
                imageName.value = ''
                imageSize.value = 0
            }
            reader.readAsDataURL(file)
        }

        const removeImage = () => {
            imagePreview.value = null
            imageName.value = ''
            imageSize.value = 0
            base64Image.value = null
            imageError.value = ''
            if (fileInput.value) {
                fileInput.value.value = ""
            }
        }

        const formatFileSize = (bytes) => {
            if (bytes === 0) return '0 Bytes'
            const k = 1024
            const sizes = ['Bytes', 'KB', 'MB', 'GB']
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
        }

        const resolveTaxonomyId = (field) => {
            if (!field) return '';
            if (typeof field === 'number' || typeof field === 'string') return field;
            return field.tid || field.target_id || '';
        }

        const loadArticle = async () => {
            if (!props.articleId) return;

            try {
                loader.value = true;
                const response = await getArticle(props.articleId, 'fields[]=nid&fields[]=title&fields[]=status&fields[]=field_categorie&fields[]=field_prix_unitaire&fields[]=field_quantite_stock&fields[]=field_posologie&fields[]=field_type_pack&fields[]=field_nombre_par_unite&fields[]=field_image');
                const article = response.data;

                form.title = article.title || '';
                form.field_categorie = resolveTaxonomyId(article.field_categorie);
                form.field_prix_unitaire = article.field_prix_unitaire ?? '';
                form.field_quantite_stock = article.field_quantite_stock ?? 0;
                form.field_posologie = article.field_posologie || '';
                form.field_type_pack = resolveTaxonomyId(article.field_type_pack);
                form.field_nombre_par_unite = article.field_nombre_par_unite ?? 1;
                form.status = article.status ?? 1;

                const imageUrl = article.field_image?.image?.url;
                if (imageUrl) {
                    imagePreview.value = imageUrl;
                }
            } catch (error) {
                toast.error('Impossible de charger le produit.');
                router.push(props.cancelTo);
            } finally {
                loader.value = false;
            }
        };

        const validateForm = () => {
            let isValid = true;
            errors.title = false;
            errors.field_prix_unitaire = false;
            errors.field_type_pack = false;
            errors.field_nombre_par_unite = false;

            if (!form.title || form.title.trim() === "") {
                errors.title = true;
                isValid = false;
            }

            if (!form.field_prix_unitaire || Number(form.field_prix_unitaire) <= 0) {
                errors.field_prix_unitaire = true;
                isValid = false;
            }

            if (!form.field_nombre_par_unite || Number(form.field_nombre_par_unite) <= 0) {
                errors.field_nombre_par_unite = true;
                isValid = false;
            }

            if (form.field_type_pack == "") {
                errors.field_type_pack = true;
                isValid = false;
            }

            return isValid;
        };

        const handleSaveArticle = async () => {
            if (!validateForm()) {
                return;
            }

            try {
                loader.value = true

                const payload = {
                    entity_type: "node",
                    bundle: "article",
                    title: form.title,
                    field_categorie: form.field_categorie || "",
                    field_prix_unitaire: parseFloat(form.field_prix_unitaire),
                    field_quantite_stock: parseInt(form.field_quantite_stock),
                    field_posologie: form.field_posologie || "",
                    field_type_pack: form.field_type_pack,
                    status: form.status ?? 1,
                    field_nombre_par_unite: form.field_nombre_par_unite || 1,
                    ...(base64Image.value && { field_image: base64Image.value }),
                    ...(isEdit.value && props.articleId ? { nid: Number(props.articleId) } : {}),
                }

                Object.keys(payload).forEach(key => {
                    if (payload[key] === "" || payload[key] === null || payload[key] === undefined) {
                        delete payload[key]
                    }
                })

                await articleStore.createArticle(payload)

                if (articleStore.error) {
                    toast.error("Une erreur est survenue lors de l'enregistrement.")
                    return
                }

                toast.success(isEdit.value ? 'Article mis à jour avec succès' : 'Article enregistré avec succès')
                router.push(props.successTo)
            } catch (error) {
                toast.error("Une erreur est survenue lors de l'enregistrement.")
            } finally {
                loader.value = false
            }
        }

        const cancelAdd = () => {
            router.push(props.cancelTo)
        }

        const categoryQueryOptions = ref({
            fields: ['tid', 'name'],
            sort: { val: 'name', op: 'asc' },
            pager: 0,
            offset: 1000
        })

        const fetchCategories = async () => {
            try {
                await articleStore.fetchCategories(categoryQueryOptions.value)
            } catch (error) {
                console.error("une erreur c'est produit lors de la chargment des données")
            }
        }

        const packQueryOptions = ref({
            fields: ['tid', 'name'],
            sort: { val: 'name', op: 'asc' },
            filters: {
                status: { val: 1, op: "=" }
            },
            pager: 0,
            offset: 1000
        })

        const fetchPacks = async () => {
            try {
                await articleStore.fetchTypePack(packQueryOptions.value)
            } catch (error) {
                console.error("une erreur c'est produit lors de la chargment des données")
            }
        }

        onMounted(async () => {
            await fetchCategories();
            await fetchPacks();
            await loadArticle();
        })

        return {
            form,
            handleSaveArticle,
            errors,
            loader,
            cancelAdd,
            isEdit,
            articleStore,
            fileInput,
            imagePreview,
            imageName,
            imageSize,
            imageError,
            triggerFileInput,
            handleImageUpload,
            removeImage,
            formatFileSize
        };
    }
}
</script>
