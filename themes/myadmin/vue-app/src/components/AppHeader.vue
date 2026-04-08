<template>
  <header class="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
    <div class="flex items-center justify-between xxl-justify-around">
      <div class="flex items-center space-x-2 md:space-x-8">
        <h1 class="text-xl md:text-2xl font-['Pacifico'] text-primary">
          {{ siteTitle }}
        </h1>
        <nav class="hidden lg:flex space-x-1">
          <template v-for="menuItem in menuItems" :key="menuItem.id">
            <!-- Dropdown Menu -->
            <div v-if="menuItem.isDropdown" class="relative" :ref="'dropdown-' + menuItem.id">
              <button @click="toggleDropdown(menuItem.id)" :class="getMenuItemClass(menuItem.path)"
                class="flex items-center gap-2">
                {{ menuItem.name }}
                <i class="fas fa-chevron-down text-xs" :class="{ 'rotate-180': activeDropdown === menuItem.id }"></i>
              </button>

              <!-- Dropdown Content -->
              <div v-if="activeDropdown === menuItem.id"
                class="absolute top-full left-0 mt-1 bg-white shadow-lg border rounded-md py-2 z-50 min-w-[200px]">
                <router-link v-for="dropdownItem in menuItem.dropdownItems" :key="dropdownItem.path"
                  :to="dropdownItem.path"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  @click="closeDropdown">
                  <i :class="dropdownItem.icon" class="w-4"></i>
                  {{ dropdownItem.name }}
                </router-link>
              </div>
            </div>

            <!-- Regular Menu Item -->
            <router-link v-else :to="menuItem.path" class="menu-item" :class="getMenuItemClass(menuItem.path)">
              {{ menuItem.name }}
            </router-link>
          </template>
        </nav>
      </div>
      <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center space-x-2 md:space-x-4">
        <div class="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
          <div class="w-2 h-2 bg-secondary rounded-full"></div>
          <span class="hidden sm:inline capitalize">{{ username }}</span>
        </div>

        <div id="user" class="relative">
          <i class="fas fa-user text-gray-700 cursor-pointer text-base h-8 w-8 text-center leading-loose bg-gray-300 rounded-full"
            @click="toggleUserMenu"></i>

          <!-- DROP DOWN -->
          <div v-if="showUserMenu"
            class="absolute right-0 mt-2 min-w-max bg-white shadow-lg border rounded-md py-2 z-50 animate-fade">
            <!-- Dashboard -->
            <router-link to="/dashboard" v-if="roles.some(r => ['gerant', 'administrator'].includes(r))"
              class="flex items-center w-full px-3 py-2 text-left hover:bg-gray-50 text-sm cursor-pointer transition-colors">
              <i class="fas fa-chart-line text-gray-500 mr-2 text-xs"></i>
              <span class="text-gray-700 font-medium">Dashboard</span>
            </router-link>

            <!-- Profil -->
            <router-link to="/user-profil"
              class="flex items-center w-full px-3 py-2 text-left hover:bg-gray-50 text-sm cursor-pointer transition-colors">
              <i class="fas fa-user text-gray-500 mr-2 text-xs"></i>
              <span class="text-gray-700 font-medium">Profil</span>
            </router-link>

            <!-- Équipe -->
            <router-link to="/users" v-if="roles.some(r => ['webmaster', 'administrator'].includes(r))"
              class="flex items-center w-full px-3 py-2 text-left hover:bg-gray-50 text-sm cursor-pointer transition-colors">
              <i class="fas fa-users text-gray-500 mr-2 text-xs"></i>
              <span class="text-gray-700 font-medium">Équipe</span>
            </router-link>

            <!-- séparation -->
            <div class="border-t my-1"></div>

            <button @click="handleLogout"
              class="flex items-center w-full px-3 py-2 text-left hover:bg-red-50 text-sm border-0 bg-transparent cursor-pointer transition-colors">
              <i class="fas fa-sign-out-alt text-red-500 mr-2 text-xs"></i>
              <span class="text-red-500 font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
  <!-- Mobile Menu -->
  <div class="app-header">
    <!-- Logo and Brand -->
    <div class="brand">
      <h1 class="text-xl md:text-2xl font-['Pacifico'] text-primary">
        {{ siteTitle }}
      </h1>
    </div>

    <!-- Menu Toggle Button -->
    <button class="menu-toggle" @click="emitToggleMenu" aria-label="Toggle navigation menu"
      v-if="authStore.isAuthenticated">
      <i class="fas fa-bars"></i>
    </button>
  </div>
</template>

<script>
import { toast } from 'vue-sonner';
import { useAuthStore } from '../stores/auth';

export default {
  name: "AppHeader",
  emits: ["toggle-menu"],

  data() {
    return {
      showUserMenu: false,
      activeDropdown: null, // Pour suivre quel dropdown est ouvert
    };
  },

  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },

  computed: {
    siteTitle() {
      const host = window.location.hostname;

      if (host.includes('vonjyaina.platforme.site')) {
        return 'Clinic Vonjy Aina';
      }

      if (host.includes('clinic.mizara.io')) {
        return 'Clinic Plateforme';
      }

      return 'Clinic Plateforme'; // fallback
    },

    username() {
      return this.authStore.user?.name || this.authStore.user?.username || window.APP_DATA?.username || "";
    },

    roles() {
      return this.authStore.user?.roles || window.APP_DATA?.roles || [];
    },

    // MENU FILTRÉ SELON LES RÔLES
    menuItems() {
      const menu = window.APP_DATA?.menu || [];
      const userRoles = this.roles;

      return menu.filter(item => {
        // menu public
        if (!item.roles || item.roles.length === 0) {
          return true;
        }

        // vérifier si le user possède un rôle autorisé
        return item.roles.some(role =>
          userRoles.includes(role)
        );
      }).map(item => {
        // Si c'est un dropdown, filtrer aussi les items du dropdown
        if (item.isDropdown && item.dropdownItems) {
          return {
            ...item,
            dropdownItems: item.dropdownItems.filter(dropdownItem =>
              !dropdownItem.roles || dropdownItem.roles.some(role => userRoles.includes(role))
            )
          };
        }
        return item;
      });
    }
  },

  mounted() {
    document.addEventListener("click", this.closeMenuOnClickOutside);
    document.addEventListener("click", this.closeDropdownOnClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.closeMenuOnClickOutside);
    document.removeEventListener("click", this.closeDropdownOnClickOutside);
  },

  methods: {
    emitToggleMenu() {
      this.$emit("toggle-menu");
    },

    getMenuItemClass(itemPath) {
      const current = this.$route.path;
      const item = this.menuItems.find(x => x.path === itemPath);

      let isActive = false;

      if (item?.paths) {
        if (item.path === "/") {
          isActive = item.paths.includes(current);
        } else {
          isActive = item.paths.some(p => current.startsWith(p));
        }
      } else {
        isActive = current === itemPath;
      }

      return {
        "px-4 xl:px-6 py-3 bg-primary text-white !rounded-button": isActive,
        "px-4 xl:px-6 py-3 text-gray-600 hover:text-primary hover:bg-gray-50 !rounded-button": !isActive,
      };
    },

    toggleUserMenu(event) {
      this.showUserMenu = !this.showUserMenu;
      event.stopPropagation();
    },

    closeMenuOnClickOutside(event) {
      if (!event.target.closest("#user")) {
        this.showUserMenu = false;
      }
    },

    // Nouveaux méthodes pour le dropdown
    toggleDropdown(menuId) {
      if (this.activeDropdown === menuId) {
        this.activeDropdown = null;
      } else {
        this.activeDropdown = menuId;
      }
    },

    closeDropdown() {
      this.activeDropdown = null;
    },

    closeDropdownOnClickOutside(event) {
      if (this.activeDropdown !== null) {
        // Vérifier si le clic est en dehors de tous les dropdowns
        const dropdownElement = this.$refs['dropdown-' + this.activeDropdown];
        if (dropdownElement && !dropdownElement[0]?.contains(event.target)) {
          this.activeDropdown = null;
        }
      }
    },

    async handleLogout() {
      try {
        this.showUserMenu = false;
        await this.authStore.logout('/login', this.$router);
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Une erreur est survenue lors de la déconnexion. Veuillez réessayer.");
      }
    }
  },
};
</script>

<style scoped>
.app-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  height: 2rem;
  width: auto;
}

.store-name {
  font-weight: 600;
  color: #1f2937;
  /* gray-800 */
}

.menu-toggle {
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #4b5563;
  /* gray-600 */
  transition: background-color 0.2s;
}

.menu-toggle:hover {
  background-color: #f9fafb;
  /* gray-50 */
}

.menu-toggle i {
  font-size: 1.25rem;
}

/* Rotation de la flèche */
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

/* Animation du dropdown */
.animate-fade {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hide header on large screens (menu is always visible in sidebar) */
@media (min-width: 1024px) {
  .app-header {
    display: none;
  }
}

@media (min-width: 1680px) {
  .xxl-justify-around {
    justify-content: space-around;
  }
}

@media (max-width: 1024px) {
  header {
    display: none;
  }
}
</style>