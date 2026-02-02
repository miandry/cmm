<template>
  <div class="article-card" @click="addToCart">
    <div class="aspect-square mb-1 rounded-md overflow-hidden">
      <img :src="getOptimizedImage()" :alt="article.title" class="w-full h-full object-cover object-top" loading="lazy"
        width="400" height="400">
    </div>
    <h3 class="font-bold text-gray-900 mb-1 text-xs line-clamp-2" style="height: 35px;">{{ article.title }}</h3>
    <div class="mb-1">
      <p class="text-sm font-semibold text-primary price-display">{{ article.field_prix_unitaire }} Ar</p>
      <p class="text-xs text-gray-500 insurance-price hidden">Prix assurance: {{ article.field_nombre_par_unite }} Ar
      </p>
    </div>
    <div class="flex items-center justify-between" v-if="article.field_quantite_stock > 10">
      <span class="text-xs text-secondary font-medium truncate">
        En stock : {{ article.field_quantite_stock }}
      </span>
      <div class="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
    </div>

    <div class="flex items-center justify-between" v-else-if="article.field_quantite_stock > 0">
      <span class="text-xs text-orange-500 font-medium">
        En stock : {{ article.field_quantite_stock }}
      </span>
      <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
    </div>

    <div class="flex items-center justify-between" v-else>
      <span class="text-xs text-red-500 font-medium">Rupture de stock</span>
      <div class="w-3 h-3 bg-red-500 rounded-full"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',

  props: {
    article: {
      type: Object,
      required: true
    }
  },

  emits: ['add-to-cart'],

  setup(props, { emit }) {

    function addToCart() {
      emit('add-to-cart', props.article)
    }

    function getOptimizedImage() {
      const originalUrl = props.article.field_image?.image?.url
      const defaultImage = '/sites/default/files/2025-12/defaultProductImagePng.png'

      // Si pas d'image, retourner l'image par défaut
      if (!originalUrl) {
        return defaultImage
      }

      try {
        // Nettoyer l'URL si elle contient des caractères bizarres
        let cleanUrl = originalUrl;
        
        // Si l'URL contient des caractères comme %3D ( = ), décoder d'abord
        if (cleanUrl.includes('%3D')) {
          cleanUrl = decodeURIComponent(cleanUrl);
        }
        
        // Extraire seulement la partie après /sites/default/files/
        const match = cleanUrl.match(/\/sites\/default\/files\/(.+)$/);
        if (match) {
          const filePath = match[1];
          // Recoder proprement pour l'URL
          const encodedPath = encodeURIComponent(filePath);
          return `https://images.weserv.nl/?url=${window.location.origin}/sites/default/files/${encodedPath}&w=400&h=400&output=webp&q=80&fit=cover`;
        }
        
        // Sinon, utiliser l'URL originale
        return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=400&h=400&output=webp&q=80&fit=cover`;
      } catch (error) {
        console.error('Erreur optimisation image:', error);
        return defaultImage;
      }
    }

    return {
      addToCart,
      getOptimizedImage
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card:active {
  transform: scale(0.98);
}

.article-card {
  /* max-width: 145px; */
  /* min-width: 140px; */
}
</style>