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
        <router-link v-for="menuItem in menuItems" :key="menuItem.id" :to="menuItem.path" class="menu-item"
          :class="getMenuItemClass(menuItem.path)" @click="closeMenu">
          <i :class="menuItem.icon" class="menu-icon" />
          <span class="menu-label">
            {{ menuItem.name }}
          </span>
        </router-link>
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
          <button @click="handleLogout" class="flex items-center border-0 bg-transparent cursor-pointer hover:opacity-80 transition-opacity p-0">
            <i class="fas fa-sign-out-alt text-red-500 text-sm"></i>
            <span class="text-sm text-red-500 ms-2 font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';

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
    return {};
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
      const menu = this.authStore.user?.menu || window.APP_DATA?.menu || [];
      return menu.filter(item => {
        // menu public
        if (!item.roles || item.roles.length === 0) {
          return true;
        }

        // intersection des rôles
        return item.roles.some(role =>
          this.roles.includes(role)
        );
      });
    },
  },

  methods: {
    closeMenu() {
      this.$emit("close");
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

    handleEscapeKey(event) {
      if (event.key === "Escape" && this.isOpen) {
        this.closeMenu();
      }
    },

    async handleLogout() {
      await this.authStore.logout();
    },
  },

  watch: {
    isOpen(newValue) {
      if (newValue) {
        document.addEventListener("keydown", this.handleEscapeKey);
      } else {
        document.removeEventListener("keydown", this.handleEscapeKey);
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
  height: 100vh;
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

.menu-icon {
  width: 1.25rem;
  margin-right: 0.75rem;
  text-align: center;
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
</style>