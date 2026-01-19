<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Navigation -->
    <header class="fixed top-0 left-0 right-0 bg-white shadow-sm z-30 h-16">
      <div class="flex items-center justify-between px-4 h-full">
        <a
          href="https://readdy.ai/home/94cc7f3d-45d6-4a9a-bf66-24e4e5c176da/a4b04e20-e031-4b8f-9aaa-d283d761de80"
          data-readdy="true"
          class="cursor-pointer"
        >
          <button
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i class="fas fa-arrow-left w-5 h-5 text-gray-600"></i>
          </button>
        </a>
        <h1 class="text-lg font-semibold text-gray-900">
          Ajouter un Nouveau Produit
        </h1>
        <div class="w-9"></div>
      </div>
    </header>
    <!-- Main Content -->
    <main class="pt-20 pb-32 px-4">
      <div class="max-w-md mx-auto">
        <form @submit.prevent="saveProduct" class="space-y-6">
          <!-- Product Name -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-900">
              Nom du produit <span class="text-red-500">*</span>
            </label>
            <input
              v-model="productForm.name"
              type="text"
              placeholder="Entrez le nom du produit"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
            <p class="text-xs text-gray-500">
              Le nom doit être unique dans le système
            </p>
          </div>
          <!-- Category -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-900">
              Catégorie <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <button
                type="button"
                @click="showCategoryDropdown = !showCategoryDropdown"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg text-left text-sm bg-white cursor-pointer flex items-center justify-between"
              >
                <span :class="{ 'text-gray-400': !productForm.category }">
                  {{ productForm.category || 'Sélectionner une catégorie' }}
                </span>
                <i class="fas fa-chevron-down w-4 h-4 text-gray-400"></i>
              </button>
              <div
                v-if="showCategoryDropdown"
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
              >
                <div
                  v-for="category in categories"
                  :key="category"
                  @click="selectCategory(category)"
                  class="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                >
                  {{ category }}
                </div>
              </div>
            </div>
            <p class="text-xs text-gray-500">
              Choisissez la catégorie appropriée
            </p>
          </div>
          <!-- Price -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-900">
              Prix unitaire <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="productForm.price"
                type="number"
                min="0"
                placeholder="0"
                class="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
              <span
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
                >Ar</span
              >
            </div>
            <p class="text-xs text-gray-500">Prix en Ariary (sans décimales)</p>
          </div>
          <!-- Description -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-900"
              >Description</label
            >
            <textarea
              v-model="productForm.description"
              rows="4"
              placeholder="Décrivez les caractéristiques du produit..."
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            ></textarea>
            <p class="text-xs text-gray-500">
              Informations détaillées sur le produit
            </p>
          </div>
          <!-- Image Upload -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-900"
              >Image du produit</label
            >
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div v-if="!productForm.image" class="text-center">
                <img
                  src="https://readdy.ai/api/search-image?query=Upload%20image%20icon%2C%20cloud%20upload%20symbol%2C%20minimalist%20design%2C%20gray%20color%2C%20simple%20line%20art%2C%20centered%20composition%2C%20isolated%20on%20white%20background%2C%20modern%20interface%20element&width=64&height=64&seq=upload001&orientation=squarish"
                  alt="Upload"
                  class="w-16 h-16 mx-auto mb-4 opacity-50"
                />
                <button
                  type="button"
                  @click="selectImage"
                  class="!rounded-button bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <i class="fas fa-camera w-4 h-4 mr-2"></i>
                  Ajouter une image
                </button>
                <p class="text-xs text-gray-500 mt-2">
                  JPG, PNG ou GIF (max. 5MB)
                </p>
              </div>
              <div v-else class="text-center">
                <img
                  :src="productForm.image"
                  alt="Aperçu produit"
                  class="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                />
                <button
                  type="button"
                  @click="removeImage"
                  class="!rounded-button bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700 transition-colors cursor-pointer"
                >
                  <i class="fas fa-trash w-4 h-4 mr-2"></i>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
    <!-- Fixed Bottom Buttons -->
    <div
      class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4"
    >
      <div class="max-w-md mx-auto grid grid-cols-2 gap-3">
        <a
          href="https://readdy.ai/home/94cc7f3d-45d6-4a9a-bf66-24e4e5c176da/a4b04e20-e031-4b8f-9aaa-d283d761de80"
          data-readdy="true"
          class="cursor-pointer"
        >
          <button
            class="!rounded-button w-full py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Annuler
          </button>
        </a>
        <button
          @click="saveProduct"
          class="!rounded-button w-full py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <i class="fas fa-save w-4 h-4 mr-2"></i>
          Enregistrer
        </button>
      </div>
    </div>
    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl p-6 max-w-sm w-full">
        <div class="text-center">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-check text-green-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Produit ajouté !
          </h3>
          <p class="text-gray-600 mb-6">
            Le produit a été enregistré avec succès dans votre inventaire.
          </p>
          <button
            @click="closeSuccessModal"
            class="!rounded-button w-full py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
const showCategoryDropdown = ref(false);
const showSuccessModal = ref(false);
const categories = [
  "Électronique",
  "Vêtements",
  "Alimentation",
  "Mobilier",
  "Livres",
  "Sport & Loisirs",
  "Beauté & Santé",
  "Automobile",
  "Jardin",
  "Autres",
];
const productForm = reactive({
  name: "",
  category: "",
  price: "",
  description: "",
  image: "",
});
const selectCategory = (category: string) => {
  productForm.category = category;
  showCategoryDropdown.value = false;
};
const selectImage = () => {
  // Simulate image selection
  productForm.image =
    "https://readdy.ai/api/search-image?query=Modern%20smartphone%20product%20photography%2C%20sleek%20design%2C%20professional%20lighting%2C%20clean%20white%20background%2C%20high%20quality%20commercial%20product%20shot%2C%20centered%20composition%2C%20detailed%20texture%2C%20premium%20electronics&width=400&height=400&seq=product001&orientation=squarish";
};
const removeImage = () => {
  productForm.image = "";
};
const saveProduct = () => {
  // Validate required fields
  if (!productForm.name || !productForm.category || !productForm.price) {
    return;
  }
  // Simulate saving
  showSuccessModal.value = true;
};
const closeSuccessModal = () => {
  showSuccessModal.value = false;
  // Reset form
  Object.keys(productForm).forEach((key) => {
    productForm[key as keyof typeof productForm] = "";
  });
};
</script>

<style scoped>
.\!rounded-button {
  border-radius: 8px;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
