<template>
    <!-- Modal Ajout/Modification Produit -->
    <div>
        <PageLoader v-if="loader" />
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="px-6 py-2 border-b border-gray-200 flex items-center justify-between">
                <h3 class="text-lg font-bold text-gray-900">Ajouter un Produit</h3>
                <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors" @click="$emit('close')">
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
                <div class="">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                        <div class="relative">
                            <select v-model="form.field_categorie"
                                class="w-full px-3 py-2 bg-white border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                                <option value="">Sélectionner une catégorie</option>
                                <option v-for="cat in categories" :key="cat.tid" :value="cat.tid">
                                    {{ cat.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Prix unitaire (Ar)<span
                                class="text-red-500"> *</span></label>
                        <input type="number" v-model="form.field_prix_unitaire"
                            class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            placeholder="0">
                        <p v-if="errors.field_prix_unitaire" class="text-red-500 text-xs">Veuillez ajouter un prix
                            supérieur à 0</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Quantité initiale<span
                                class="text-red-500"> *</span></label>
                        <input type="number" min="1" v-model="form.field_quantite_stock"
                            class="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                        <p v-if="errors.field_quantite_stock" class="text-red-500 text-xs">Veuillez ajouter une quantité
                            supérieure à 0</p>
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
                                    <img src="https://readdy.ai/api/search-image?query=Vitamin%20C%20tablets%20in%20modern%20pharmacy%20bottle%20with%20orange%20label%2C%20clean%20medical%20background%2C%20professional%20pharmaceutical%20product%20photography%2C%20soft%20natural%20lighting%2C%20clinical%20and%20sterile%20aesthetic&amp;width=200&amp;height=200&amp;seq=vitaminc1&amp;orientation=squarish"
                                        alt="Vitamin C 1000mg" class="w-full h-full object-cover object-top rounded-button">
                                    <span class="border px-1 py-0 border-red-500 rounded-button cursor-pointer absolute top-0 right-0">
                                        <i class="ri-close-line text-red-500 text-lg"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="text-center">
                                <button type="button"
                                    class="!rounded-button bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition-colors cursor-pointer">
                                    <i class="fas fa-camera w-4 h-4 mr-2"></i>
                                    Ajouter une image
                                </button>
                                <p class="text-xs text-gray-500 mt-2">
                                    JPG, JPEG, PNG (max. 5MB)
                                </p>
                                <input type="file" name="" hidden>
                            </div>
                        </div>
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
import { reactive, ref } from 'vue';
import { useArticleStore } from '../../stores/index.js';
import PageLoader from '../PageLoader.vue';
import { toast } from 'vue-sonner';

export default {
    name: "SaveStock",
    components: {
        PageLoader
    },
    props: {
        categories: {
            type: Array,
            required: true
        }
    },
    emits: ['addArticle', 'close'],
    setup(props, { emit }) {
        const articleStore = useArticleStore();
        const loader = ref(false)
        const form = reactive({
            entity_type: "node",
            bundle: "article",
            title: "",
            field_categorie: "",
            field_prix_unitaire: "",
            field_quantite_stock: 1,
            field_posologie: "",
        })
        // field_image: ""

        // ---- OBJET DES ERREURS ----
        const errors = reactive({
            title: false,
            field_prix_unitaire: false,
            field_quantite_stock: false,
        });


        // ---- VALIDATION ----
        const validateForm = () => {
            let isValid = true;

            // Reset erreurs
            errors.title = false;
            errors.field_prix_unitaire = false;
            errors.field_quantite_stock = false;

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

            // Quantité > 0
            if (
                !form.field_quantite_stock ||
                Number(form.field_quantite_stock) <= 0
            ) {
                errors.field_quantite_stock = true;
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
                await articleStore.createArticle(form)
                if (articleStore.error) {
                    toast.error("Une erreur est survenue lors de l'enregistrement.")
                    return
                }
                toast.success("Article enregistré avec succès")
                emit('addArticle');
                emit('close');
                resetForm();
            } catch (error) {
                console.log("Une erreur est survenue lors de l'enregstrement")
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
        }

        const cancelAdd = () => {
            emit('close');
            resetForm()
        }

        return {
            form,
            handleSaveArticle,
            errors,
            loader,
            cancelAdd
        };
    }
}
</script>

<style></style>