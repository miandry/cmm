<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
        <p class="text-gray-600 text-sm mt-1">Gérer les comptes utilisateurs de la clinique</p>
      </div>
      <button @click="openCreateModal" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
        <i class="fas fa-plus"></i>
        <span>Nouvel Utilisateur</span>
      </button>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nom</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rôle</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Créé le</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="loading" class="text-center">
              <td colspan="6" class="px-4 py-8 text-gray-500">
                <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                <p>Chargement...</p>
              </td>
            </tr>
            <tr v-else-if="users.length === 0" class="text-center">
              <td colspan="6" class="px-4 py-8 text-gray-500">
                <i class="fas fa-users text-3xl mb-2 text-gray-300"></i>
                <p>Aucun utilisateur trouvé</p>
              </td>
            </tr>
            <tr v-else v-for="user in users" :key="user.uid" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    {{ getInitials(user.name) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{{ user.name }}</p>
                    <p class="text-xs text-gray-500">ID: {{ user.uid }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ user.mail || '-' }}</td>
              <td class="px-4 py-3">
                <span v-for="role in user.roles" :key="role" 
                      :class="getRoleBadgeClass(role)"
                      class="inline-block px-2 py-1 text-xs font-medium rounded-full mr-1">
                  {{ getRoleLabel(role) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span v-if="user.status === '1'" class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  <i class="fas fa-check-circle"></i>
                  Actif
                </span>
                <span v-else class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
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
                          class="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                          title="Supprimer">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur *</label>
              <input v-model="formData.name" type="text" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                     placeholder="Entrez le nom d'utilisateur">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="formData.mail" type="email"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                     placeholder="email@example.com">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe {{ editingUser ? '' : '*' }}</label>
              <input v-model="formData.pass" type="password" :required="!editingUser"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                     :placeholder="editingUser ? 'Laisser vide pour ne pas changer' : 'Entrez le mot de passe'">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rôles *</label>
              <div class="space-y-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" value="administrator" v-model="formData.roles"
                         class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                  <span class="text-sm text-gray-700">Administrateur</span>
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
              </div>
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
              <button type="submit" :disabled="saving"
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'UserManager',
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

    const formData = ref({
      name: '',
      mail: '',
      pass: '',
      roles: [],
      status: true
    });

    const fetchUsers = async () => {
      loading.value = true;
      try {
        const response = await axios.get('/crud/users');
        users.value = response.data.users || [];
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
        roles: [],
        status: true
      };
      error.value = null;
      showModal.value = true;
    };

    const openEditModal = (user) => {
      editingUser.value = user;
      formData.value = {
        uid: user.uid,
        name: user.name,
        mail: user.mail || '',
        pass: '',
        roles: user.roles || [],
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

      try {
        const payload = {
          name: formData.value.name,
          mail: formData.value.mail,
          roles: formData.value.roles,
          status: formData.value.status ? '1' : '0'
        };

        if (formData.value.pass) {
          payload.pass = formData.value.pass;
        }

        if (editingUser.value) {
          payload.uid = formData.value.uid;
          await axios.post('/crud/user_edit', payload);
        } else {
          await axios.post('/crud/user_create', payload);
        }

        await fetchUsers();
        closeModal();
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
        await axios.post('/crud/user_delete', { uid: userToDelete.value.uid });
        await fetchUsers();
        showDeleteModal.value = false;
        userToDelete.value = null;
      } catch (err) {
        console.error('Error deleting user:', err);
        error.value = err.response?.data?.message || 'Erreur lors de la suppression';
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
        'docteur': 'Docteur',
        'caissier': 'Caissier'
      };
      return labels[role] || role;
    };

    const getRoleBadgeClass = (role) => {
      const classes = {
        'administrator': 'bg-purple-100 text-purple-700',
        'docteur': 'bg-blue-100 text-blue-700',
        'caissier': 'bg-green-100 text-green-700'
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

    onMounted(() => {
      fetchUsers();
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
      openCreateModal,
      openEditModal,
      closeModal,
      saveUser,
      confirmDelete,
      deleteUser,
      getInitials,
      getRoleLabel,
      getRoleBadgeClass,
      formatDate
    };
  }
}
</script>
