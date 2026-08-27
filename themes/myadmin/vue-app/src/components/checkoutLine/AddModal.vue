<template>
    <div class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 text-center">
            <!-- Overlay -->
            <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>

            <!-- Modal -->
            <div
                class="relative inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">
                            <i class="ri-add-line text-primary mr-2"></i>
                            Ajouter un nouvel élément
                        </h3>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                            <i class="ri-close-line text-xl"></i>
                        </button>
                    </div>

                    <!-- Formulaire -->
                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <!-- Champ: Titre -->
                        <div>
                            <label for="customer" class="block text-sm font-medium text-gray-700 mb-1">
                                Client <span class="text-red-500">*</span>
                            </label>
                            <input id="customer" v-model="form.customer" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Entrez le nom du client" />
                        </div>

                        <!-- Champ: Statut -->
                        <div>
                            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
                                Statut <span class="text-red-500">*</span>
                            </label>
                            <select id="status" v-model="form.status" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option value="pending">En attente</option>
                                <option value="in_process">En cours</option>
                                <option value="finished">Terminé</option>
                            </select>
                        </div>
                    </form>
                </div>

                <!-- Footer -->
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button @click="handleSubmit" type="submit"
                        class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">
                        <i class="ri-check-line mr-1"></i>
                        Ajouter
                    </button>
                    <button @click="closeModal" type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddModal',
    data() {
        return {
            form: {
                customer: '',
                status: 'pending' // Valeur par défaut
            }
        };
    },
    methods: {
        closeModal() {
            this.resetForm();
            this.$emit('close');
        },
        handleSubmit() {
            // Validation
            if (!this.form.status || !this.form.customer) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }

            // Émettre les données du formulaire
            this.$emit('submit', { ...this.form });
            this.resetForm();
            this.closeModal();
        },
        resetForm() {
            this.form = {
                customer: '',
                status: ''
            };
        }
    }
};
</script>

<style scoped>
/* Styles spécifiques au modal si nécessaire */
</style>