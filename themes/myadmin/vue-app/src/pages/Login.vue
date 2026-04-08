<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center mb-4 text-white text-2xl">
          <i class="ri-heart-pulse-fill"></i>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connexion
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Accédez à votre espace de gestion pharmaceutique
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
            <input id="username" name="username" type="text" autocomplete="username" required v-model="username"
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Votre identifiant">
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required
              v-model="password"
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="••••••••">
          </div>
        </div>

        <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="ri-error-warning-fill text-red-400"></i>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Erreur de connexion
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ authStore.error }}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i v-if="!authStore.loading" class="ri-lock-line text-blue-300 group-hover:text-blue-200"></i>
              <i v-else class="ri-loader-4-line animate-spin text-blue-300"></i>
            </span>
            {{ authStore.loading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const username = ref('');
    const password = ref('');

    // Fonction pour déterminer la route de redirection selon le rôle
    const getRedirectPath = (user) => {
      if (!user || !user.roles || user.roles.length === 0) {
        return '/caisse'; // fallback par défaut
      }

      // Vérifier les rôles par ordre de priorité (du plus haut niveau au plus bas)
      if (user.roles.includes('administrator') ||
        user.roles.includes('webmaster') ||
        user.roles.includes('gerant')) {
        return '/dashboard';
      }

      if (user.roles.includes('docteur')) {
        return '/rendez-vous';
      }

      if (user.roles.includes('caissier')) {
        return '/caisse';
      }

      if (user.roles.includes('assistant')) {
        return '/assist/dashboard';
      }

      // Fallback par défaut
      return '/caisse';
    };

    const handleLogin = async () => {
      if (!username.value || !password.value) {
        toast.error('Veuillez remplir tous les champs');
        return;
      }

      try {
        // Appel de la fonction login du store
        const result = await authStore.login(username.value, password.value);

        if (result === true) {
          // Récupérer l'utilisateur après connexion
          const user = authStore.user;

          // Déterminer la route de redirection selon le rôle
          const redirectPath = getRedirectPath(user);

          // Rediriger vers la page appropriée
          router.push(redirectPath);

        }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
      }
    };

    return {
      authStore,
      username,
      password,
      handleLogin
    };
  }
}
</script>