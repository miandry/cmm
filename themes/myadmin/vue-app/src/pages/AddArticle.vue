<template>
    <main class="px-6 py-8 max-w-3xl mx-auto">
        <div class="mb-6">
            <router-link to="/stocks" class="text-sm text-primary hover:underline mb-2 inline-block">
                ← Retour au stock
            </router-link>
            <h1 class="text-2xl font-bold text-gray-900">Ajouter un Produit</h1>
            <p class="text-sm text-gray-500 mt-1">
                Créez un nouvel article dans le catalogue de la clinique.
            </p>
        </div>
        <SaveArticle />
    </main>
</template>

<script>
import SaveArticle from '../components/stocks/SaveArticle.vue';

export default {
    name: 'AddArticle',
    components: {
        SaveArticle,
    },
};
</script>
