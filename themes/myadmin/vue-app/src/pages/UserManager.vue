<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="w-full md:w-auto">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
        <p class="text-gray-600 text-sm mt-1">Gérer les comptes utilisateurs de la clinique</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <button @click="openSpecialitiesModal"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 justify-center">
          <i class="fas fa-stethoscope"></i>
          <span>Gérer spécialité docteur</span>
        </button>
        <button @click="openCreateModal"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 justify-center">
          <i class="fas fa-plus"></i>
          <span>Nouvel Utilisateur</span>
        </button>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="mb-4 flex flex-col md:flex-row items-center gap-2">
      <input v-model="searchTerm" @input="updateSearch" type="text" placeholder="Rechercher un utilisateur..."
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full md:w-auto" />

      <!-- Status filter -->
      <div class="w-full md:w-auto">
        <select v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full">
          <option value="">Tous statuts</option>
          <option value="1">Actif</option>
          <option value="0">Bloqué</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-8">
      <div class="overflow-x-auto">
        <table class="w-full" id="teamTable">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nom</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rôle(s)</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Créé le</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="loading" class="text-center">
              <td colspan="6" class="px-4 py-8 text-gray-500 text-center">
                <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                <p>Chargement...</p>
              </td>
            </tr>
            <tr v-else-if="userStore.users.rows.length === 0" class="text-center">
              <td colspan="6" class="px-4 py-8 text-gray-500 text-center">
                <i class="fas fa-users text-3xl mb-2 text-gray-300"></i>
                <p>Aucun utilisateur trouvé</p>
              </td>
            </tr>
            <tr v-else v-for="user in userStore.users.rows" :key="user.uid" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    {{ getInitials(user.name) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{{ user.name }}</p>
                    <p class="text-xs text-gray-500">ID: {{ user.uid }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ displayEmail(user) }}</td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-1">
                  <span v-for="role in user.roles" :key="role" :class="getRoleBadgeClass(role)"
                    class="inline-block px-2 py-1 text-xs font-medium rounded-full">
                    {{ getRoleLabel(role) }}
                  </span>
                </div>
                <p></p>
                <span
                  v-if="user.field_specialite && (typeof user.field_specialite === 'string' ? user.field_specialite !== '' : (Array.isArray(user.field_specialite) ? user.field_specialite.length > 0 : Object.keys(user.field_specialite).length > 0))"
                  class="bg-orange-100 text-orange-700 inline-block px-2 py-1 text-xs font-medium rounded-full mt-1">
                  {{ getSpecialtyTitle(user.field_specialite) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span v-if="user.status === '1'"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  <i class="fas fa-check-circle"></i>
                  Actif
                </span>
                <span v-else
                  class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  <i class="fas fa-times-circle"></i>
                  Inactif
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ formatDate(user.created) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditModal(user)"
                    class="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-colors"
                    title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="confirmDelete(user)"
                    class="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors hidden"
                    title="Supprimer">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-center">
        <div class="flex items-center space-x-2">
          <!-- Previous -->
          <button @click="previousPage" :disabled="currentPage === 1"
            class="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
            <i class="fas fa-chevron-left"></i>
          </button>

          <!-- Pages -->
          <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
            class="px-3 py-2 rounded-md transition-colors" :class="page === currentPage
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-gray-900'">
            {{ page }}
          </button>

          <!-- Next -->
          <button @click="nextPage" :disabled="currentPage === totalPages"
            class="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-800">
              {{ editingUser ? 'Modifier Utilisateur' : 'Nouvel Utilisateur' }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <form @submit.prevent="saveUser" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur <span
                  class="text-red-500">*</span></label>
              <input v-model="formData.name" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Entrez le nom d'utilisateur">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="formData.mail" type="email" autocomplete="off"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="email@example.com">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe <span class="text-red-500">{{
                editingUser ? '' : '*'
                  }}</span></label>
              <input v-model="formData.pass" type="password" :required="!editingUser" autocomplete="off"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                :placeholder="editingUser ? 'Laisser vide pour ne pas changer' : 'Entrez le mot de passe'">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rôle(s) <span
                  class="text-red-500">*</span></label>
              <div class="space-y-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" value="gerant" v-model="formData.roles"
                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                  <span class="text-sm text-gray-700">Gérant</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" value="docteur" v-model="formData.roles"
                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                  <span class="text-sm text-gray-700">Docteur</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" value="caissier" v-model="formData.roles"
                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                  <span class="text-sm text-gray-700">Caissier</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" value="assistant" v-model="formData.roles"
                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                  <span class="text-sm text-gray-700">Assistant</span>
                </label>
              </div>
              <p v-if="formData.roles.length === 0" class="text-xs text-red-500 mt-1">Veuillez sélectionner au moins un
                rôle</p>
            </div>

            <!-- Spécialité Select - s'affiche uniquement si le rôle docteur est coché -->
            <div v-if="formData.roles.includes('docteur')">
              <div class="flex items-center justify-between mb-1">
                <label class="block text-sm font-medium text-gray-700">Spécialité <span
                    class="text-red-500">*</span></label>
                <button type="button" @click="showQuickAddSpecialtyModal = true"
                  class="text-xs text-primary hover:text-blue-600 font-medium flex items-center gap-1">
                  <i class="fas fa-plus"></i>
                  Ajouter
                </button>
              </div>
              <select v-model="formData.specialty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="">Sélectionnez une spécialité</option>
                <option v-for="specialty in specialtiesList" :key="specialty.nid" :value="specialty.nid">
                  {{ specialty.title }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="formData.status"
                  class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                <span class="text-sm text-gray-700">Compte actif</span>
              </label>
            </div>

            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {{ error }}
            </div>

            <div class="flex gap-3 pt-4">
              <button type="button" @click="closeModal"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button type="submit" :disabled="saving || formData.roles.length === 0"
                class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">Confirmer la suppression</h3>
          <p class="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{{ userToDelete?.name }}</strong> ?
            Cette action est irréversible.
          </p>
          <div class="flex gap-3">
            <button @click="showDeleteModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button @click="deleteUser" :disabled="deleting"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
              <i v-if="deleting" class="fas fa-spinner fa-spin mr-2"></i>
              {{ deleting ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- modal for Specialite - docteur  -->
    <DocteurSpecialities ref="specialitiesModalRef" @specialities-updated="loadSpecialities" />

    <!-- Modal pour ajouter rapidement une spécialité -->
    <div v-if="showQuickAddSpecialtyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-800">Ajouter une spécialité</h2>
            <button @click="showQuickAddSpecialtyModal = false" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <form @submit.prevent="saveQuickAddSpecialty" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nom de la spécialité <span class="text-red-500">*</span>
              </label>
              <input v-model="quickAddForm.title" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: Cardiologie">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Montant de consultation (Ar) <span class="text-red-500">*</span>
              </label>
              <input v-model.number="quickAddForm.field_montant_consultation" type="number" required min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: 50000">
            </div>

            <div v-if="quickAddError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {{ quickAddError }}
            </div>

            <div class="flex gap-3 pt-4">
              <button type="button" @click="showQuickAddSpecialtyModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button type="submit" :disabled="quickAddSaving || !quickAddForm.title || !quickAddForm.field_montant_consultation"
                class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                <i v-if="quickAddSaving" class="fas fa-spinner fa-spin mr-2"></i>
                {{ quickAddSaving ? 'Ajout...' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useUserStore } from '../stores/user/user.js';
import { useSpecialityStore } from '../stores/index.js';
import { debounce } from 'lodash';
import { toast } from 'vue-sonner';
import DocteurSpecialities from './DocteurSpecialities.vue';

export default {
  name: 'UserManager',
  components: {
    DocteurSpecialities,
  },
  setup() {
    const users = ref([]);
    const loading = ref(false);
    const showModal = ref(false);
    const showDeleteModal = ref(false);
    const editingUser = ref(null);
    const userToDelete = ref(null);
    const saving = ref(false);
    const deleting = ref(false);
    const error = ref(null);
    const userStore = useUserStore();
    const specialityStore = useSpecialityStore();

    // Liste des spécialités depuis le store
    const specialtiesList = ref([]);
    
    // Modal pour ajouter une spécialité rapidement
    const showQuickAddSpecialtyModal = ref(false);
    const quickAddForm = ref({
      title: '',
      field_montant_consultation: ''
    });
    const quickAddError = ref('');
    const quickAddSaving = ref(false);

    // Charger les spécialités depuis le store
    const loadSpecialities = async () => {
      try {
        // Récupérer toutes les spécialités sans pagination
        const queryOptions = {
          fields: ['nid', 'title', 'field_montant_consultation'],
          sort: { val: 'title', op: 'asc' },
          filters: { status: { val: 1, op: "=" } },
          pager: 0,
          offset: 100, // Récupérer toutes les spécialités
        };
        await specialityStore.fetchSpecialities(queryOptions);
        specialtiesList.value = specialityStore.specialities.rows || [];
      } catch (error) {
        console.error('Erreur lors du chargement des spécialités:', error);
        specialtiesList.value = [];
      }
    };

    // Obtenir le titre d'une spécialité par son nid (peut être un string ou un objet)
    const getSpecialtyTitle = (specialty) => {
      // Vérifier si la valeur est null, undefined, chaîne vide
      if (!specialty || specialty == '') {
        return null;
      }

      // Vérifier si c'est un tableau vide
      if (Array.isArray(specialty) && specialty.length == 0) {
        return null;
      }

      // Vérifier si c'est un objet vide {}
      if (typeof specialty == 'object' && !Array.isArray(specialty) && Object.keys(specialty).length == 0) {
        return null;
      }

      // Si c'est déjà un objet avec un titre
      if (typeof specialty === 'object' && specialty.title) {
        return specialty.title;
      }

      // Si c'est un ID (string ou number), chercher dans la liste
      const specialtyObj = specialtiesList.value.find(s => s.nid == specialty);
      return specialtyObj ? specialtyObj.title : null;
    };

    // Paramètres dynamiques de la requête
    const queryOptions = ref({
      fields: [
        'uid',
        'name',
        'status',
        'created',
        'changed',
        'access',
        'mail',
        'roles',
        'field_specialite',
      ],
      sort: { val: 'uid', op: 'desc' },
      filters: {
        uid: {
          val: window.APP_DATA.user.id,
          op: "<>"
        },
        roles: {
          val: "administrator",
          op: "<>"
        },
        roles: {
          val: "webmaster",
          op: "<>"
        }
      },
      pager: 0,
      offset: 20,
    });

    const searchTerm = ref('');
    const statusFilter = ref(''); // '' = all, '1' active, '0' inactive

    const updateSearch = () => {
      loading.value = true;
      debouncedFetch();
    };

    const updateStatus = () => {
      // update filter and fetch immediately
      currentPage.value = 1; // Reset to first page when filter changes
      queryOptions.value.pager = 0; // Reset pager
      if (statusFilter.value === '') {
        updateFilter('status', null);
      } else {
        updateFilter('status', statusFilter.value, '=');
      }
      fetchUsers();
    };

    const debouncedFetch = debounce(() => {
      currentPage.value = 1; // Reset to first page on search
      queryOptions.value.pager = 0; // Reset pager
      updateFilter('name', searchTerm.value, 'CONTAINS');
      fetchUsers();
    }, 600);

    // Pagination
    const currentPage = ref(1);
    const perPage = 20; // matches offset in queryOptions

    const totalPages = computed(() => Math.ceil(userStore.users.total / perPage));

    const visiblePages = computed(() => {
      const pages = [];
      const total = totalPages.value;
      const current = currentPage.value;

      if (total <= 3) {
        for (let i = 1; i <= total; i++) pages.push(i);
      } else {
        if (current === 1) pages.push(1, 2, 3);
        else if (current === total) pages.push(total - 2, total - 1, total);
        else pages.push(current - 1, current, current + 1);
      }

      return pages;
    });

    const updateFilter = (key, value, op = "=") => {
      if (value === null || value === undefined || value === '') {
        delete queryOptions.value.filters[key];
      } else {
        queryOptions.value.filters[key] = { val: value, op };
      }
    };

    const formData = ref({
      name: '',
      mail: '',
      pass: '',
      roles: ['caissier'], // Tableau de rôles
      specialty: '',
      status: 1
    });

    // Watch pour le changement des rôles
    watch(() => formData.value.roles, (newRoles) => {
      // Si le rôle docteur n'est plus dans le tableau, on reset la spécialité
      if (!newRoles.includes('docteur')) {
        formData.value.specialty = '';
      }
    });

    const fetchUsers = async () => {
      loading.value = true;
      try {
        await userStore.fetchUsers(queryOptions.value);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        loading.value = false;
      }
    };

    const openCreateModal = () => {
      editingUser.value = null;
      formData.value = {
        name: '',
        mail: '',
        pass: '',
        roles: ['caissier'],
        specialty: '',
        status: true
      };
      error.value = null;
      showModal.value = true;
    };

    const openEditModal = (user) => {
      editingUser.value = user;

      // Récupérer l'ID de la spécialité (peut être un objet ou un string)
      let specialtyId = '';
      if (user.field_specialite) {
        if (typeof user.field_specialite === 'object' && user.field_specialite.nid) {
          specialtyId = user.field_specialite.nid;
        } else if (typeof user.field_specialite === 'string' || typeof user.field_specialite === 'number') {
          specialtyId = user.field_specialite;
        }
      }

      formData.value = {
        uid: user.uid,
        name: user.name,
        mail: getEditableEmail(user),
        pass: '',
        roles: user.roles && user.roles.length > 0 ? [...user.roles] : ['caissier'],
        specialty: specialtyId,
        status: user.status === '1'
      };
      error.value = null;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      editingUser.value = null;
      error.value = null;
    };

    const saveUser = async () => {
      saving.value = true;
      error.value = null;

      // validation username (one word only)
      if (/\s/.test(formData.value.name)) {
        error.value = "Le nom d'utilisateur ne doit pas contenir d'espace.";
        saving.value = false;
        return;
      }

      // validation des rôles
      if (!formData.value.roles || formData.value.roles.length === 0) {
        error.value = 'Veuillez sélectionner au moins un rôle.';
        saving.value = false;
        return;
      }

      // validation de la spécialité si le rôle docteur est sélectionné
      if (formData.value.roles.includes('docteur') && !formData.value.specialty) {
        error.value = 'Veuillez sélectionner une spécialité.';
        saving.value = false;
        return;
      }

      try {
        const payload = {
          name: formData.value.name,
          mail: formData.value.mail?.trim()
            ? formData.value.mail
            : `clinicuser${formData.value.name.replace(/\s+/g, '')}@gmail.com`,
          roles: formData.value.roles,
          status: formData.value.status ? '1' : '0',
          field_specialite: formData.value.roles.includes('docteur') ? formData.value.specialty : '',
        };

        if (formData.value.pass) {
          payload.pass = formData.value.pass;
        }

        if (editingUser.value) {
          payload.uid = formData.value.uid;
          const resp = await userStore.editUser(payload);
          if (resp?.status) {
            // Mettre à jour la ligne localement avec les bonnes données
            const idx = userStore.users.rows.findIndex(u => u.uid == payload.uid);
            if (idx !== -1) {
              // Récupérer l'objet spécialité complet pour l'affichage
              let specialtyObject = '';
              if (payload.field_specialite) {
                const foundSpecialty = specialtiesList.value.find(s => s.nid == payload.field_specialite);
                specialtyObject = foundSpecialty || payload.field_specialite;
              }

              userStore.users.rows[idx] = {
                ...userStore.users.rows[idx],
                name: payload.name,
                mail: payload.mail,
                roles: payload.roles,
                status: payload.status,
                field_specialite: specialtyObject,
              };
            }
            toast.success('Utilisateur mis à jour avec succès.');
            closeModal();
          } else {
            error.value = resp.error || 'Erreur lors de la modification';
          }
        } else {
          await userStore.createUser(payload);
          if (userStore.error == 'Username existe déjà') {
            error.value = 'Ce nom d\'utilisateur est déjà utilisé.';
            return;
          } else if (userStore.error) {
            error.value = userStore.error;
            toast.error("Une erreur est survenue lors de la création de l'utilisateur.");
            return;
          } else {
            error.value = null;
          }
          await fetchUsers();
          toast.success('Utilisateur créé avec succès.');
          closeModal();
        }
      } catch (err) {
        console.error('Error saving user:', err);
        error.value = err.response?.data?.message || 'Erreur lors de l\'enregistrement';
      } finally {
        saving.value = false;
      }
    };

    const confirmDelete = (user) => {
      userToDelete.value = user;
      showDeleteModal.value = true;
    };

    const deleteUser = async () => {
      deleting.value = true;
      try {
        await axios.post('/api/crud/user_delete', { uid: userToDelete.value.uid });
        await fetchUsers();
        showDeleteModal.value = false;
        userToDelete.value = null;
        toast.success('Utilisateur supprimé avec succès.');
      } catch (err) {
        console.error('Error deleting user:', err);
        error.value = err.response?.data?.message || 'Erreur lors de la suppression';
        toast.error('Erreur lors de la suppression de l\'utilisateur.');
      } finally {
        deleting.value = false;
      }
    };

    const getInitials = (name) => {
      if (!name) return '?';
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };

    const getRoleLabel = (role) => {
      const labels = {
        'administrator': 'Admin',
        'gerant': 'Gérant',
        'docteur': 'Docteur',
        'caissier': 'Caissier',
        'assistant': 'Assistant'
      };
      return labels[role] || role;
    };

    const getRoleBadgeClass = (role) => {
      const classes = {
        'administrator': 'bg-purple-100 text-purple-700 hidden',
        'gerant': 'bg-yellow-100 text-yellow-700',
        'docteur': 'bg-blue-100 text-blue-700',
        'caissier': 'bg-green-100 text-green-700',
        'assistant': 'bg-indigo-100 text-indigo-700'
      };
      return classes[role] || 'bg-gray-100 text-gray-700';
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return '-';
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    const onPagination = async (value) => {
      queryOptions.value.pager = value - 1;
      currentPage.value = value;
      await fetchUsers();
    };

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        onPagination(currentPage.value);
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        onPagination(currentPage.value);
      }
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        onPagination(currentPage.value);
      }
    };

    const displayEmail = (user) => {
      if (!user.mail) return '-';

      const defaultEmail = `clinicuser${user.name.replace(/\s+/g, '')}@gmail.com`;

      return user.mail === defaultEmail ? '-' : user.mail;
    };

    const getEditableEmail = (user) => {
      if (!user.mail) return '';

      const defaultEmail = `clinicuser${user.name.replace(/\s+/g, '')}@gmail.com`;

      return user.mail === defaultEmail ? '' : user.mail;
    };

    const specialitiesModalRef = ref(null);

    const openSpecialitiesModal = () => {
      if (specialitiesModalRef.value) {
        specialitiesModalRef.value.openSpecialitiesModal();
      }
    };

    const saveQuickAddSpecialty = async () => {
      quickAddError.value = '';
      
      // Validation
      if (!quickAddForm.value.title.trim()) {
        quickAddError.value = 'Le nom de la spécialité est requis';
        return;
      }
      
      if (!quickAddForm.value.field_montant_consultation || quickAddForm.value.field_montant_consultation <= 0) {
        quickAddError.value = 'Le montant doit être supérieur à 0';
        return;
      }
      
      quickAddSaving.value = true;
      
      try {
        const payload = {
          entity_type: 'node',
          bundle: 'specialite_docteur',
          status: 1,
          title: quickAddForm.value.title,
          field_montant_consultation: quickAddForm.value.field_montant_consultation,
          field_specialite_medicale: quickAddForm.value.title
        };
        
        await specialityStore.saveSpecialityData(payload);
        
        if (!specialityStore.error) {
          // Recharger les spécialités
          await loadSpecialities();
          
          // Sélectionner automatiquement la nouvelle spécialité
          const newSpecialty = specialtiesList.value[specialtiesList.value.length - 1];
          if (newSpecialty) {
            formData.value.specialty = newSpecialty.nid;
          }
          
          // Fermer la modal et réinitialiser
          showQuickAddSpecialtyModal.value = false;
          quickAddForm.value = { title: '', field_montant_consultation: '' };
          toast.success('Spécialité ajoutée avec succès');
        } else {
          quickAddError.value = specialityStore.error || 'Une erreur est survenue';
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la spécialité:', error);
        quickAddError.value = error.response?.data?.message || 'Une erreur est survenue';
      } finally {
        quickAddSaving.value = false;
      }
    };

    watch(statusFilter, () => {
      updateStatus();
    });

    onMounted(async () => {
      await fetchUsers();
      await loadSpecialities();
    });

    return {
      users,
      loading,
      showModal,
      showDeleteModal,
      editingUser,
      userToDelete,
      saving,
      deleting,
      error,
      formData,
      specialtiesList,
      openCreateModal,
      openEditModal,
      closeModal,
      saveUser,
      confirmDelete,
      deleteUser,
      getInitials,
      getRoleLabel,
      getRoleBadgeClass,
      formatDate,
      userStore,
      searchTerm,
      statusFilter,
      updateSearch,
      currentPage,
      totalPages,
      visiblePages,
      goToPage,
      nextPage,
      previousPage,
      displayEmail,
      getEditableEmail,
      getSpecialtyTitle,
      specialitiesModalRef,
      openSpecialitiesModal,
      loadSpecialities,
      // Quick add specialty
      showQuickAddSpecialtyModal,
      quickAddForm,
      quickAddError,
      quickAddSaving,
      saveQuickAddSpecialty,
    };
  }
}
</script>

<style scoped>
#teamTable {
  margin-top: 0;
  margin-bottom: 0;
}
</style>