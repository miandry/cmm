<template>
    <main class="px-6 py-8 max-w-3xl mx-auto">
        <div class="mb-6">
            <router-link to="/articles" class="text-sm text-primary hover:underline mb-2 inline-block">
                ← Retour au catalogue
            </router-link>
            <h1 class="text-2xl font-bold text-gray-900">Modifier le produit</h1>
            <p class="text-sm text-gray-500 mt-1">
                Mettez à jour les informations de l'article #{{ articleId }}.
            </p>
        </div>
        <SaveArticle v-if="articleId" :article-id="articleId" cancel-to="/articles" success-to="/articles" />
    </main>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SaveArticle from '../components/stocks/SaveArticle.vue';

export default {
    name: 'EditArticle',
    components: {
        SaveArticle,
    },
    setup() {
        const route = useRoute();
        const articleId = computed(() => Number(route.params.id) || null);

        return { articleId };
    },
};
</script>
