<template>
    <div class="bg-slate-50 font-sans antialiased flex items-center justify-center min-h-screen p-4">
        <div class="max-w-4xl w-full bg-white rounded-3xl profile-card overflow-hidden border border-slate-200/80">

            <!-- En-tête "Mon Profil" + sous-titre -->
            <div class="px-8 pt-8 pb-2">
                <h1 class="text-2xl font-semibold text-slate-800 tracking-tight">Mon Profil</h1>
                <p class="text-sm text-slate-500 mt-0.5">Gérez vos informations personnelles</p>
            </div>

            <!-- Ligne de séparation fine -->
            <hr class="border-slate-200 mx-8 mt-2 mb-4">

            <!-- Contenu principal : deux colonnes -->
            <div class="flex flex-col lg:flex-row gap-8 p-8 pt-2">

                <!-- COLONNE GAUCHE (photo / identité) -->
                <div class="lg:w-1/3 w-full">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 border border-white flex items-center justify-center text-indigo-700 text-xl font-semibold shadow-sm">
                            {{ userInitials }}
                        </div>
                        <div>
                            <div class="font-semibold text-lg text-slate-800">{{ userName }}</div>
                            <div class="text-sm text-slate-500 flex items-center gap-1">
                                <i class="far fa-envelope text-xs"></i> {{ displayEmail }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- COLONNE DROITE -->
                <div class="lg:w-2/3 w-full space-y-6">
                    <div>
                        <h2
                            class="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1">
                            <i class="fas fa-lock text-xs"></i> Sécurité
                        </h2>
                        <p class="text-xs text-slate-500 mb-4 -mt-1">Gérez votre mot de passe</p>

                        <!-- Formulaire mot de passe -->
                        <div class="space-y-4">
                            <!-- Mot de passe actuel -->
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Mot de passe actuel</label>
                                <div class="relative">
                                    <input v-model="form.current_password"
                                        :type="showCurrentPassword ? 'text' : 'password'"
                                        class="w-full border border-slate-200 rounded-xl py-3 px-4 text-sm bg-slate-50/50 focus:bg-white focus:border-indigo-300 transition placeholder:text-slate-300"
                                        placeholder="Entrez votre mot de passe actuel"
                                        :class="{ 'border-red-300': errors.current_password }"
                                        @input="validateField('current_password')"
                                        @blur="validateField('current_password')">
                                    <button type="button" @click="showCurrentPassword = !showCurrentPassword"
                                        class="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                                        <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                    </button>
                                </div>
                                <p v-if="errors.current_password" class="text-xs text-red-500 mt-1 ml-1">
                                    {{ errors.current_password }}
                                </p>
                            </div>

                            <!-- Nouveau mot de passe -->
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Nouveau mot de
                                    passe</label>
                                <div class="relative">
                                    <input v-model="form.new_password" :type="showNewPassword ? 'text' : 'password'"
                                        class="w-full border border-slate-200 rounded-xl py-3 px-4 text-sm bg-slate-50/50 focus:bg-white focus:border-indigo-300 transition placeholder:text-slate-300"
                                        placeholder="Entrez votre nouveau mot de passe"
                                        :class="{ 'border-red-300': errors.new_password }"
                                        @input="validateField('new_password')" @blur="validateField('new_password')">
                                    <button type="button" @click="showNewPassword = !showNewPassword"
                                        class="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                                        <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                    </button>
                                </div>
                                <p class="text-xs text-slate-400 mt-1.5 ml-1 flex items-center gap-1">
                                    <i class="fas fa-info-circle text-[10px]"></i>
                                    Le mot de passe doit contenir au moins 6 caractères
                                </p>
                                <p v-if="errors.new_password" class="text-xs text-red-500 mt-1 ml-1">
                                    {{ errors.new_password }}
                                </p>
                            </div>

                            <!-- Confirmer le mot de passe -->
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Confirmer le mot de
                                    passe</label>
                                <div class="relative">
                                    <input v-model="form.confirm_password"
                                        :type="showConfirmPassword ? 'text' : 'password'"
                                        class="w-full border border-slate-200 rounded-xl py-3 px-4 text-sm bg-slate-50/50 focus:bg-white focus:border-indigo-300 transition placeholder:text-slate-300"
                                        placeholder="Confirmez votre nouveau mot de passe"
                                        :class="{ 'border-red-300': errors.confirm_password }"
                                        @input="validateField('confirm_password')"
                                        @blur="validateField('confirm_password')">
                                    <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                        class="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                                        <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                    </button>
                                </div>
                                <p v-if="errors.confirm_password" class="text-xs text-red-500 mt-1 ml-1">
                                    {{ errors.confirm_password }}
                                </p>
                            </div>
                        </div>

                        <!-- Résumé des erreurs (visible même si bouton désactivé) -->
                        <div v-if="Object.values(errors).some(e => e)"
                            class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                            <p class="text-sm text-amber-700 flex items-center gap-2 font-medium">
                                <i class="fas fa-exclamation-triangle"></i>
                                Veuillez corriger les erreurs avant de continuer
                            </p>
                            <ul class="mt-2 text-xs text-amber-600 list-disc list-inside">
                                <li v-for="(error, key) in errors" :key="key" v-if="error">
                                    {{ error }}
                                </li>
                            </ul>
                        </div>

                        <!-- Message d'erreur général (API) -->
                        <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p class="text-sm text-red-600 flex items-center gap-2">
                                <i class="fas fa-exclamation-circle"></i>
                                {{ errorMessage }}
                            </p>
                        </div>

                        <!-- Message de succès -->
                        <div v-if="successMessage" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                            <p class="text-sm text-green-600 flex items-center gap-2">
                                <i class="fas fa-check-circle"></i>
                                {{ successMessage }}
                            </p>
                        </div>

                        <!-- Boutons -->
                        <div class="flex items-center gap-3 mt-6">
                            <button @click="resetForm" type="button"
                                class="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition shadow-sm flex items-center gap-1">
                                <i class="fas fa-times text-xs"></i> Annuler
                            </button>
                            <button @click="handleChangePassword" :disabled="loading || !isFormValid" type="submit"
                                class="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed flex-1 justify-center"
                                :title="!isFormValid ? 'Veuillez corriger les erreurs' : ''">
                                <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                                <i v-else class="fas fa-arrow-right text-xs"></i>
                                {{ loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="h-2"></div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

export default {
    name: 'Profile',

    setup() {
        const authStore = useAuthStore();
        const router = useRouter();

        // État du formulaire
        const form = reactive({
            current_password: '',
            new_password: '',
            confirm_password: ''
        });

        // États d'affichage
        const showCurrentPassword = ref(false);
        const showNewPassword = ref(false);
        const showConfirmPassword = ref(false);
        const touched = reactive({
            current_password: false,
            new_password: false,
            confirm_password: false
        });

        const loading = ref(false);
        const errorMessage = ref('');
        const successMessage = ref('');

        const errors = reactive({
            current_password: '',
            new_password: '',
            confirm_password: ''
        });

        // Données utilisateur
        const userName = computed(() => {
            return authStore.user?.name || window.APP_DATA?.username || 'Utilisateur';
        });

        const userEmail = computed(() => {
            return authStore.user?.mail || window.APP_DATA?.user?.mail;
        });

        // Fonction pour générer l'email par défaut
        const getDefaultEmail = (username) => {
            if (!username) return '';
            const cleanUsername = username.replace(/\s+/g, '');
            return `clinicuser${cleanUsername}@gmail.com`;
        };

        // Vérifier si l'email est celui par défaut
        const isDefaultEmail = computed(() => {
            if (!userEmail.value || !userName.value) return false;
            const defaultEmail = getDefaultEmail(userName.value);
            return userEmail.value === defaultEmail;
        });

        // Email à afficher (tiret si email par défaut)
        const displayEmail = computed(() => {
            if (!userEmail.value) return '-';
            if (isDefaultEmail.value) return '-';
            return userEmail.value;
        });

        const userInitials = computed(() => {
            const name = userName.value;
            // Prendre les 2 premières lettres du nom (en majuscules)
            return name.substring(0, 2).toUpperCase();
        });

        // Validation d'un champ spécifique
        const validateField = (field) => {
            touched[field] = true;

            switch (field) {
                case 'current_password':
                    if (!form.current_password) {
                        errors.current_password = 'Le mot de passe actuel est requis';
                    } else {
                        errors.current_password = '';
                    }
                    break;

                case 'new_password':
                    if (!form.new_password) {
                        errors.new_password = 'Le nouveau mot de passe est requis';
                    } else if (form.new_password.length < 6) {
                        errors.new_password = 'Le mot de passe doit contenir au moins 6 caractères';
                    } else if (form.current_password && form.new_password === form.current_password) {
                        errors.new_password = 'Le nouveau mot de passe doit être différent de l\'ancien';
                    } else {
                        errors.new_password = '';
                    }

                    // Re-valider la confirmation si elle a déjà été touchée
                    if (touched.confirm_password) {
                        validateField('confirm_password');
                    }
                    break;

                case 'confirm_password':
                    if (!form.confirm_password) {
                        errors.confirm_password = 'La confirmation est requise';
                    } else if (form.new_password !== form.confirm_password) {
                        errors.confirm_password = 'Les mots de passe ne correspondent pas';
                    } else {
                        errors.confirm_password = '';
                    }
                    break;
            }
        };

        // Valider tout le formulaire
        const validateAll = () => {
            touched.current_password = true;
            touched.new_password = true;
            touched.confirm_password = true;

            validateField('current_password');
            validateField('new_password');
            validateField('confirm_password');
        };

        const isFormValid = computed(() => {
            return form.current_password &&
                form.new_password &&
                form.confirm_password &&
                form.new_password === form.confirm_password &&
                form.new_password.length >= 6 &&
                form.current_password !== form.new_password &&
                !errors.current_password &&
                !errors.new_password &&
                !errors.confirm_password;
        });

        // Réinitialiser le formulaire
        const resetForm = () => {
            form.current_password = '';
            form.new_password = '';
            form.confirm_password = '';

            touched.current_password = false;
            touched.new_password = false;
            touched.confirm_password = false;

            errors.current_password = '';
            errors.new_password = '';
            errors.confirm_password = '';

            errorMessage.value = '';
            successMessage.value = '';
        };

        // Gérer le changement de mot de passe
        const handleChangePassword = async () => {
            validateAll();

            if (!isFormValid.value) return;

            loading.value = true;
            errorMessage.value = '';
            successMessage.value = '';

            try {
                const result = await authStore.changePassword(
                    form.current_password,
                    form.new_password,
                    router
                );

                if (result.success) {
                    successMessage.value = result.message;
                    toast.success(result.message);
                } else {
                    errorMessage.value = result.error;
                    toast.error(result.error);
                }
            } catch (error) {
                errorMessage.value = 'Une erreur inattendue est survenue';
                toast.error('Erreur lors du changement de mot de passe');
            } finally {
                loading.value = false;
            }
        };

        // Watcher pour effacer les erreurs générales quand l'utilisateur tape
        watch(
            () => [form.current_password, form.new_password, form.confirm_password],
            () => {
                errorMessage.value = '';
            }
        );

        return {
            authStore,
            form,
            showCurrentPassword,
            showNewPassword,
            showConfirmPassword,
            loading,
            errorMessage,
            successMessage,
            errors,
            userName,
            userEmail,
            userInitials,
            isFormValid,
            validateField,
            resetForm,
            handleChangePassword,
            displayEmail
        };
    }
};
</script>

<style scoped>
.profile-card {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.02), 0 2px 6px rgba(0, 20, 40, 0.05);
}
</style>