<template>
    <!-- Contenu Principal -->
    <main class="px-6 py-8 max-w-7xl mx-auto">
        <!-- Titre et Actions Principales -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestion des Retours d'Articles</h1>
                <p class="text-gray-600">Gérez les retours d'articles de votre clinique</p>
            </div>
            <div class="flex flex-wrap gap-3 mt-4 lg:mt-0">
                <button @click="openAddModal"
                    class="px-4 py-2 bg-primary text-white !rounded-button font-medium text-sm whitespace-nowrap flex items-center space-x-2">
                    <div class="w-5 h-5 flex items-center justify-center">
                        <i class="ri-add-line"></i>
                    </div>
                    <span>Ajouter Retour</span>
                </button>
            </div>
        </div>

        <!-- Tableau Principal -->
        <RetourArticles :openModal="openSaveRetourModal" @close="openSaveRetourModal = false"
            :selectedRetourArticle="selectedRetourArticle" @addRetourArticle="handleAddRetourArticle" />
    </main>
</template>

<script>
import { reactive, ref } from 'vue';
import RetourArticles from '../components/retour_article/RetourArticles.vue';

export default {
    name: "ArticlesRetour",
    components: {
        RetourArticles
    },
    setup() {
        const openSaveRetourModal = ref(false);
        const selectedRetourArticle = ref(null);

        const openAddModal = () => {
            selectedRetourArticle.value = null;
            openSaveRetourModal.value = true;
        };

        const handleAddRetourArticle = () => {
            // La liste sera rafraîchie automatiquement par le composant enfant
        };

        return {
            openSaveRetourModal,
            selectedRetourArticle,
            openAddModal,
            handleAddRetourArticle
        }
    }
}
</script>

<style></style>