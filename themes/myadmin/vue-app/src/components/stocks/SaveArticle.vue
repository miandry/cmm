<template>
    <!-- Modal Ajout/Modification Produit -->
    <div>
        <PageLoader v-if="loader" />
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="px-6 py-2 border-b border-gray-200 flex items-center justify-between">
                <h3 class="text-lg font-bold text-gray-900">Ajouter un Produit</h3>
                <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    @click="$emit('closeArticleModal')">
                    <div class="w-6 h-6 flex items-center justify-center">
                        <i class="ri-close-line"></i>
                    </div>
                </button>
            </div>
            <form class="p-6 space-y-3">
                <div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nom du produit<span
                                class="text-red-500"> *</span></label>
                        <input type="text" v-model="form.title"
                            class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            placeholder="Ex: Paracétamol 500mg">
                        <p v-if="errors.title" class="text-red-500 text-xs">Le nom du produit est requis</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2 ">Type pack<span
                                class="text-red-500"> *</span></label>
                        <div class="relative">
                            <select v-model="form.field_type_pack"
                                class="w-full px-3 py-2.5 bg-white border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                                <option value="">Sélectionner une type pack</option>
                                <option v-for="pack in articleStore.packs.rows" :key="pack.tid" :value="pack.tid">
                                    {{ pack.name }}
                                </option>
                            </select>
                            <p v-if="errors.field_type_pack" class="text-red-500 text-xs">Le type du pack est requis</p>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2 ">Nbr unité par pack<span
                                class="text-red-500"> *</span></label>
                        <input type="number" min="1" v-model="form.field_nombre_par_unite"
                            class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                        <p v-if="errors.field_nombre_par_unite" class="text-red-500 text-xs">Veuillez ajouter une
                            quantité
                            supérieure à 0</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                            <div class="relative">
                                <select v-model="form.field_categorie"
                                    class="w-full px-3 py-2.5 bg-white border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                                    <option value="">Sélectionner une catégorie</option>
                                    <option v-for="cat in articleStore.categories.rows" :key="cat.tid" :value="cat.tid">
                                        {{ cat.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Prix unitaire (Ar)<span
                                class="text-red-500"> *</span></label>
                        <input type="number" v-model="form.field_prix_unitaire" min="0"
                            class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            placeholder="0">
                        <p v-if="errors.field_prix_unitaire" class="text-red-500 text-xs">Veuillez ajouter un prix
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
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Image du article
                    </label>

                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div>
                            <div class="text-center mb-4">
                                <div class="w-40 h-40 mx-auto relative">
                                    <!-- Placeholder quand pas d'image -->
                                    <div v-if="!imagePreview"
                                        class="w-full h-full flex items-center justify-center bg-gray-100 rounded-button">
                                        <i class="ri-image-line text-4xl text-gray-400"></i>
                                    </div>
                                    <!-- Preview quand image -->
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
                                <p v-else class="text-xs text-gray-500 mt-2">
                                    JPG, JPEG, PNG (max. 10MB)
                                </p>
                                <input type="file" ref="fileInput" hidden @change="handleImageUpload"
                                    accept=".jpg,.jpeg,.png">
                            </div>
                        </div>
                        <p v-if="imageError" class="text-red-500 text-xs text-center mt-2">{{ imageError }}</p>
                    </div>
                </div>
                <div class="flex items-center justify-end space-x-4 pt-4">
                    <button type="button"
                        class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 !rounded-button whitespace-nowrap"
                        @click.prevent="cancelAdd">
                        Annuler
                    </button>
                    <button @click.prevent="handleSaveArticle"
                        class="flex-1 px-4 py-2 bg-secondary text-white hover:bg-green-600 !rounded-button whitespace-nowrap">
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import { useArticleStore } from '../../stores/index.js';
import PageLoader from '../PageLoader.vue';
import { toast } from 'vue-sonner';

export default {
    name: "SaveArticle",
    components: {
        PageLoader
    },
    props: {
        categories: {
            type: Array,
            required: true
        }
    },
    emits: ['closeArticleModal'],
    setup(props, { emit }) {
        const articleStore = useArticleStore();
        const loader = ref(false)
        const fileInput = ref(null)

        // Variables pour l'image
        const imagePreview = ref(null)
        const imageName = ref('')
        const imageSize = ref(0)
        const imageError = ref('')
        const base64Image = ref(null) // null au lieu de string vide

        const form = reactive({
            entity_type: "node",
            bundle: "article",
            title: "",
            field_categorie: "",
            field_prix_unitaire: "",
            field_quantite_stock: 1,
            field_posologie: "",
            field_type_pack: "",
            status: 1,
            field_nombre_par_unite: 1,
            // field_image sera ajouté dynamiquement seulement si une image existe
        })

        // ---- OBJET DES ERREURS ----
        const errors = reactive({
            title: false,
            field_prix_unitaire: false,
            field_quantite_stock: false,
            field_nombre_par_unite: false,
            field_type_pack: false,
        });

        // ---- FONCTIONS POUR L'IMAGE ----
        const triggerFileInput = () => {
            fileInput.value.click()
        }

        const validateImage = (file) => {
            // Réinitialiser l'erreur
            imageError.value = ''

            // Vérifier le type de fichier
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
            if (!allowedTypes.includes(file.type)) {
                imageError.value = 'Format non supporté. Utilisez JPG, JPEG ou PNG.'
                return false
            }

            // Vérifier la taille (10Mo max)
            const maxSize = 10 * 1024 * 1024 // 10MB en bytes
            if (file.size > maxSize) {
                imageError.value = 'L\'image est trop volumineuse (max 10MB).'
                return false
            }

            return true
        }

        const handleImageUpload = (event) => {
            const file = event.target.files[0]
            if (!file) return

            // Validation
            if (!validateImage(file)) {
                // Réinitialiser l'input
                event.target.value = ""
                return
            }

            // Sauvegarder les informations du fichier
            imageName.value = file.name
            imageSize.value = file.size

            // Utiliser FileReader pour lire l'image en base64
            const reader = new FileReader()
            reader.onload = (e) => {
                // Le résultat est déjà un data URL (base64 avec préfixe)
                const result = e.target.result
                imagePreview.value = result
                base64Image.value = result // Stocker le base64 complet
            }

            reader.onerror = () => {
                imageError.value = 'Erreur lors de la lecture du fichier'
                // Réinitialiser
                event.target.value = ""
                imageName.value = ''
                imageSize.value = 0
            }

            reader.readAsDataURL(file)

            // Ne pas réinitialiser l'input ici pour garder la valeur
        }

        const removeImage = () => {
            imagePreview.value = null
            imageName.value = ''
            imageSize.value = 0
            base64Image.value = null
            imageError.value = ''

            // Réinitialiser l'input file
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

        // ---- VALIDATION ----
        const validateForm = () => {
            let isValid = true;

            // Reset erreurs
            errors.title = false;
            errors.field_prix_unitaire = false;
            errors.field_type_pack = false;

            // Nom requis
            if (!form.title || form.title.trim() === "") {
                errors.title = true;
                isValid = false;
            }

            // Prix > 0
            if (
                !form.field_prix_unitaire ||
                Number(form.field_prix_unitaire) <= 0
            ) {
                errors.field_prix_unitaire = true;
                isValid = false;
            }

            // nbr par boite > 0
            if (
                !form.field_nombre_par_unite ||
                Number(form.field_nombre_par_unite) <= 0
            ) {
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

                // Préparer les données à envoyer, similaire à votre exemple
                const newArticle = {
                    entity_type: "node",
                    bundle: "article",
                    title: form.title,
                    field_categorie: form.field_categorie || "",
                    field_prix_unitaire: parseFloat(form.field_prix_unitaire),
                    field_quantite_stock: parseInt(form.field_quantite_stock),
                    field_posologie: form.field_posologie || "",
                    field_type_pack: form.field_type_pack,
                    status: 1,
                    field_nombre_par_unite: form.field_nombre_par_unite || 1,
                    // Ajouter l'image en base64 seulement si elle existe
                    ...(base64Image.value && { field_image: base64Image.value })
                }

                // Nettoyer les valeurs vides
                Object.keys(newArticle).forEach(key => {
                    if (newArticle[key] === "" || newArticle[key] === null || newArticle[key] === undefined) {
                        delete newArticle[key]
                    }
                })

                await articleStore.createArticle(newArticle)

                if (articleStore.error) {
                    toast.error("Une erreur est survenue lors de l'enregistrement.")
                    return
                }

                toast.success("Article enregistré avec succès")
                cancelAdd();
            } catch (error) {
                toast.error("Une erreur est survenue lors de l'enregistrement.")
            } finally {
                loader.value = false
            }
        }

        function resetForm() {
            form.title = "";
            form.field_categorie = "";
            form.field_prix_unitaire = "";
            form.field_quantite_stock = 1;
            form.field_posologie = "";
            form.field_nombre_par_unite = 1;
            removeImage() // Réinitialiser aussi l'image
        }

        const cancelAdd = () => {
            emit('closeArticleModal');
            resetForm()
        }

        const categoryQueryOptions = ref({
            fields: [
                'tid',
                'name',
            ],
            sort: { val: 'name', op: 'asc' },
            pager: 0,
            offset: 1000
        })

        const fetchCategories = async (append = false) => {
            try {
                await articleStore.fetchCategories(categoryQueryOptions.value)
            } catch (error) {
                console.error("une erreur c'est produit lors de la chargment des données")
            }
        }

        const packQueryOptions = ref({
            fields: [
                'tid',
                'name',
            ],
            sort: { val: 'name', op: 'asc' },
            pager: 0,
            offset: 1000
        })

        const fetchPacks = async (append = false) => {
            try {
                await articleStore.fetchTypePack(packQueryOptions.value)
            } catch (error) {
                console.error("une erreur c'est produit lors de la chargment des données")
            }
        }


        onMounted(async () => {
            await fetchCategories();
            await fetchPacks();
        })

        return {
            form,
            handleSaveArticle,
            errors,
            loader,
            cancelAdd,
            articleStore,
            // Image upload
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