<template>
    <div class="bg-slate-50 font-sans antialiased flex items-center justify-center min-h-screen p-4">
        <div class="max-w-4xl w-full bg-white rounded-3xl profile-card overflow-hidden border border-slate-200/80">

            <!-- En-tête "Mon Profil" + sous-titre -->
            <div class="px-8 pt-8 pb-2">
                <h1 class="text-2xl font-semibold text-slate-800 tracking-tight">Mon Profil</h1>
                <p class="text-sm text-slate-500 mt-0.5">Gérez vos informations personnelles</p>
            </div>

            <!-- Ligne de séparation fine (identique à l'esprit de l'image) -->
            <hr class="border-slate-200 mx-8 mt-2 mb-4">

            <!-- Contenu principal : deux colonnes (gauche / droite) -->
            <div class="flex flex-col lg:flex-row gap-8 p-8 pt-2">

                <!-- COLONNE GAUCHE (photo / identité / infos compactes) -->
                <div class="lg:w-1/3 w-full">
                    <!-- Bloc MJ / Marie Jeanne -->
                    <div class="flex items-center gap-4">
                        <div
                            class="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 border border-white flex items-center justify-center text-indigo-700 text-xl font-semibold shadow-sm">
                            MJ
                        </div>
                        <div>
                            <div class="font-semibold text-lg text-slate-800">Marie Jeanne</div>
                            <div class="text-sm text-slate-500 flex items-center gap-1">
                                <i class="far fa-envelope text-xs"></i> marie.jeanne@email.com
                            </div>
                        </div>
                    </div>
                    <!-- Séparation discrète (facultative) mais l'image n'en a pas à cet endroit -->
                </div>

                <!-- COLONNE DROITE (informations personnelles + sécurité) -->
                <div class="lg:w-2/3 w-full space-y-6">
                    <!-- Bloc Sécurité : Gestion du mot de passe -->
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
                                    <input type="password" value="12345678"
                                        class="w-full border border-slate-200 rounded-xl py-3 px-4 text-sm bg-slate-50/50 focus:bg-white focus:border-indigo-300 transition placeholder:text-slate-300"
                                        placeholder="Entrez votre mot de passe actuel">
                                    <!-- Petit icône oeil (facultatif) mais garde le visuel neutre -->
                                </div>
                            </div>

                            <!-- Nouveau mot de passe -->
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Nouveau mot de
                                    passe</label>
                                <input type="password"
                                    class="w-full border border-slate-200 rounded-xl py-3 px-4 text-sm bg-slate-50/50 focus:bg-white focus:border-indigo-300 transition placeholder:text-slate-300"
                                    placeholder="Entrez votre nouveau mot de passe">
                                <p class="text-xs text-slate-400 mt-1.5 ml-1 flex items-center gap-1">
                                    <i class="fas fa-info-circle text-[10px]"></i> Le mot de passe doit contenir au
                                    moins 8 caractères
                                </p>
                            </div>

                            <!-- Confirmer le mot de passe -->
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Confirmer le mot de
                                    passe</label>
                                <input type="password"
                                    class="w-full border border-slate-200 rounded-xl py-3 px-4 text-sm bg-slate-50/50 focus:bg-white focus:border-indigo-300 transition placeholder:text-slate-300"
                                    placeholder="Confirmez votre nouveau mot de passe">
                            </div>
                        </div>

                        <!-- Boutons Annuler / Mettre à jour (exactement comme sur l'image) -->
                        <div class="flex items-center mt-6">
                            <button
                                class="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-sm flex items-center gap-1 w-full text-center justify-center">
                                <i class="fas fa-arrow-right text-xs"></i> Mettre à jour le mot de passe
                            </button>
                        </div>

                        <!-- Note subtile : l'image mentionne "Mettre à jour le mot de passe" sans icône, mais on peut le laisser nature -->
                    </div>
                </div>
            </div>

            <!-- Espace tout en bas, comme sur l'image il n'y a pas d'élément après les boutons, juste l'ombre légère de la carte -->
            <div class="h-2"></div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
.profile-card {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.02), 0 2px 6px rgba(0, 20, 40, 0.05);
}

.input-focus-ring:focus {
    outline: none;
    ring: 2px solid #cbd5e1;
    border-color: #94a3b8;
}
</style>