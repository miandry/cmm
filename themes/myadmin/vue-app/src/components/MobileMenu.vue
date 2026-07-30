<template>
  <div class="mobile-menu-wrapper">
    <!-- Backdrop Overlay -->
    <div class="menu-backdrop" :class="{ 'active': isOpen }" @click="closeMenu" />

    <!-- Mobile Menu Panel -->
    <div class="mobile-menu-panel z-30" :class="{ 'open': isOpen }">
      <!-- Menu Header -->
      <div class="menu-header">
        <div class="brand">
          <h1 class="text-xl md:text-2xl font-['Pacifico'] text-primary">
            {{ siteTitle }}
          </h1>
        </div>

        <button class="close-button" @click="closeMenu" aria-label="Close menu">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="menu-navigation">
        <template v-for="menuItem in menuItems" :key="menuItem.id">
          <!-- Dropdown Menu Item -->
          <div v-if="menuItem.isDropdown" class="mobile-dropdown">
            <button @click="toggleDropdown(menuItem.id)" class="mobile-dropdown-button"
              :class="{ 'active': activeDropdown === menuItem.id }">
              <i :class="menuItem.icon" class="menu-icon" />
              <span class="menu-label flex-1 text-left">
                {{ menuItem.name }}
              </span>
              <i class="fas fa-chevron-down dropdown-arrow"
                :class="{ 'rotate-180': activeDropdown === menuItem.id }"></i>
            </button>

            <!-- Dropdown Items -->
            <div v-if="activeDropdown === menuItem.id" class="mobile-dropdown-items">
              <router-link v-for="dropdownItem in menuItem.dropdownItems" :key="dropdownItem.path"
                :to="dropdownItem.path" class="mobile-dropdown-item" :class="getDropdownItemClass(dropdownItem.path)"
                @click="closeMenu">
                <i :class="dropdownItem.icon" class="menu-icon ml-6" />
                <span class="menu-label">
                  {{ dropdownItem.name }}
                </span>
              </router-link>
            </div>
          </div>

          <!-- Regular Menu Item -->
          <router-link v-else :to="menuItem.path" class="menu-item" :class="getMenuItemClass(menuItem.path)"
            @click="closeMenu">
            <i :class="menuItem.icon" class="menu-icon" />
            <span class="menu-label">
              {{ menuItem.name }}
            </span>
          </router-link>
        </template>

        <!-- Dashboard -->
        <router-link to="/dashboard" v-if="roles.some(r => ['gerant', 'administrator'].includes(r))" class="menu-item"
          :class="getMenuItemClass('/dashboard')" @click="closeMenu">
          <i class="fas fa-chart-line menu-icon"></i>
          <span class="menu-label">Dashboard</span>
        </router-link>

        <!-- Profil -->
        <router-link to="/user-profil" class="menu-item" :class="getMenuItemClass('/user-profil')" @click="closeMenu">
          <i class="fas fa-user menu-icon"></i>
          <span class="menu-label">Profil</span>
        </router-link>

        <!-- Équipe -->
        <router-link to="/users" v-if="roles.some(r => ['webmaster', 'administrator'].includes(r))" class="menu-item"
          :class="getMenuItemClass('/users')" @click="closeMenu">
          <i class="fas fa-users menu-icon"></i>
          <span class="menu-label">Équipe</span>
        </router-link>

        <!-- Paramètres -->
        <router-link to="/parametres"
          v-if="roles.some(r => ['gerant', 'administrator', 'admin'].includes(r))" class="menu-item"
          :class="getMenuItemClass('/parametres')" @click="closeMenu">
          <i class="fas fa-cog menu-icon"></i>
          <span class="menu-label">Paramètres</span>
        </router-link>
      </nav>

      <!-- Extra Navigation -->
      <nav class="menu-navigation pt-0">

      </nav>

      <!-- Status Footer -->
      <div class="menu-footer" v-if="authStore.isAuthenticated">
        <div class="status-indicator">
          <div class="online-dot" />
          <span class="status-text capitalize">
            {{ username }}
          </span>
        </div>

        <div class="store-info">
          <button @click="handleLogout"
            class="flex items-center border-0 bg-transparent cursor-pointer hover:opacity-80 transition-opacity p-0">
            <i class="fas fa-sign-out-alt text-red-500 text-sm"></i>
            <span class="text-sm text-red-500 ms-2 font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue-sonner';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { useMenuStore } from '../stores/menu/menu.js';
import { buildMenuItems } from '../utils/menuFilter.js';

export default {
  name: "MobileMenu",

  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },

  emits: ["close"],

  data() {
    return {
      activeDropdown: null, // Pour suivre quel dropdown est ouvert
    };
  },

  setup() {
    const authStore = useAuthStore();
    const menuStore = useMenuStore();
    const { disabledKeys } = storeToRefs(menuStore);
    return { authStore, menuStore, disabledKeys };
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

    canUseDropdown() {
      const highRoles = ["administrator", "admin", "webmaster", "gerant"];
      return this.roles.some(role => highRoles.includes(role));
    },

    // MENU FILTRÉ SELON LES RÔLES ET PARAMÈTRES
    menuItems() {
      const menu = window.APP_DATA?.menu || [];
      return buildMenuItems(menu, this.roles, this.canUseDropdown, this.disabledKeys);
    },
  },

  methods: {
    closeMenu() {
      this.$emit("close");
      // Fermer le dropdown quand on ferme le menu
      this.activeDropdown = null;
    },

    // même logique que le header
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
        "menu-item-active": isActive,
        "menu-item-inactive": !isActive,
      };
    },

    // Classe pour les items du dropdown
    getDropdownItemClass(itemPath) {
      const current = this.$route.path;
      const isActive = current === itemPath;

      return {
        "dropdown-item-active": isActive,
        "dropdown-item-inactive": !isActive,
      };
    },

    // Toggle dropdown
    toggleDropdown(menuId) {
      if (this.activeDropdown === menuId) {
        this.activeDropdown = null;
      } else {
        this.activeDropdown = menuId;
      }
    },

    handleEscapeKey(event) {
      if (event.key === "Escape" && this.isOpen) {
        this.closeMenu();
      }
    },

    async handleLogout() {
      try {
        this.closeMenu();
        await this.authStore.logout('/login', this.$router);
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Une erreur est survenue lors de la déconnexion. Veuillez réessayer.");
      }
    }
  },

  watch: {
    isOpen(newValue) {
      if (newValue) {
        document.addEventListener("keydown", this.handleEscapeKey);
      } else {
        document.removeEventListener("keydown", this.handleEscapeKey);
        // Reset dropdown when menu closes
        this.activeDropdown = null;
      }
    },
  },

  beforeUnmount() {
    document.removeEventListener("keydown", this.handleEscapeKey);
  },
};
</script>

<style scoped>
.mobile-menu-wrapper {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
}

/* Backdrop Overlay */
.menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.menu-backdrop.active {
  opacity: 1;
  pointer-events: all;
}

/* Mobile Menu Panel */
.mobile-menu-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  min-height: 100vh;
  min-height: 100dvh;
  background: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
}

.mobile-menu-panel.open {
  transform: translateX(0);
}

/* Menu Header */
.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  /* gray-200 */
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

.close-button {
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #4b5563;
  /* gray-600 */
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #f9fafb;
  /* gray-50 */
}

.close-button i {
  font-size: 1.25rem;
}

/* Navigation Menu */
.menu-navigation {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}

.menu-item-active {
  background-color: #3b82f6;
  /* primary */
  color: white;
}

.menu-item-inactive {
  color: #4b5563;
  /* gray-600 */
}

.menu-item-inactive:hover {
  color: #3b82f6;
  /* primary */
  background-color: #f9fafb;
  /* gray-50 */
}

/* Mobile Dropdown Styles */
.mobile-dropdown {
  width: 100%;
}

.mobile-dropdown-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #4b5563;
}

.mobile-dropdown-button:hover {
  color: #3b82f6;
  background-color: #f9fafb;
}

.mobile-dropdown-button.active {
  background-color: #3b82f6;
  color: white;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
  font-size: 0.75rem;
}

.rotate-180 {
  transform: rotate(180deg);
}

.mobile-dropdown-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.mobile-dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s;
  color: #6b7280;
  background-color: #f9fafb;
}

.mobile-dropdown-item:hover {
  background-color: #f3f4f6;
  color: #3b82f6;
}

.dropdown-item-active {
  background-color: #3b82f6;
  color: white;
}

.dropdown-item-inactive {
  color: #6b7280;
}

.menu-icon {
  width: 1.25rem;
  margin-right: 0.75rem;
  text-align: center;
}

.ml-6 {
  margin-left: 1.5rem;
}

.flex-1 {
  flex: 1;
}

.text-left {
  text-align: left;
}

.menu-label {
  font-size: 0.875rem;
}

/* Menu Footer */
.menu-footer {
  padding: 1rem;
  border-top: 1px solid #f3f4f6;
  /* gray-100 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #4b5563;
  /* gray-600 */
}

.online-dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: #10b981;
  /* secondary */
  border-radius: 50%;
}

.store-info {
  font-size: 0.75rem;
  color: #4b5563;
  /* gray-600 */
}

/* Hide mobile menu on large screens */
@media (min-width: 1024px) {
  .mobile-menu-wrapper {
    display: none;
  }
}

/* Animation pour le dropdown */
.mobile-dropdown-items {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>