<template>
    <div class="fixed bottom-6 right-6 z-50">
        <!-- Menu Items -->
        <transition-group name="menu-items" tag="div" class="flex flex-col items-start gap-2 mb-3">
            <button v-for="item in menuItems" v-if="isMenuOpen" :key="item.key" @click="handleMenuItemClick(item)"
                class="flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl shadow-lg border border-gray-200 transition-all duration-200 hover:scale-105 hover:shadow-xl min-w-[140px]">
                <i :class="item.icon + ' text-lg text-primary'"></i>
                <span class="text-sm font-medium">{{ item.label }}</span>
            </button>
        </transition-group>

        <!-- Main FAB Button -->
        <button @click="toggleMenu"
            class="group flex items-center gap-3 px-5 py-3 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 relative">
            <!-- Label permanent "Fil d'attente" -->
            <span class="text-sm font-medium whitespace-nowrap">
                Fil d'attente
            </span>
            <i class="ri-add-line text-2xl transition-transform duration-300" :class="{ 'rotate-45': isMenuOpen }"></i>

            <!-- Pulse animation -->
            <span class="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping"
                :class="{ 'hidden': isMenuOpen }"></span>
            <!-- Ripple effect -->
            <span class="absolute inset-0 rounded-full bg-primary opacity-20 animate-ripple"
                :class="{ 'hidden': isMenuOpen }"></span>
        </button>

        <!-- Modal Ajouter -->
        <AddModal v-if="showAddModal" @close="showAddModal = false" @submit="handleAddSubmit" />
    </div>
</template>

<script>
import AddModal from './AddModal.vue';

export default {
    name: 'FloatingActionButton',
    components: {
        AddModal
    },
    props: {
        menuItems: {
            type: Array,
            default: () => [
                {
                    key: 'ajouter',
                    label: 'Ajouter',
                    icon: 'ri-add-line',
                    action: 'add'
                },
                {
                    key: 'liste-attente',
                    label: 'Listes d\'attente',
                    icon: 'ri-time-line',
                    action: 'waiting-list'
                }
            ]
        },
        position: {
            type: String,
            default: 'bottom-right',
            validator: (value) => ['bottom-left', 'bottom-right', 'top-left', 'top-right'].includes(value)
        }
    },
    data() {
        return {
            isMenuOpen: false,
            showAddModal: false
        };
    },
    computed: {
        positionClasses() {
            const positions = {
                'bottom-left': 'bottom-6 left-6',
                'bottom-right': 'bottom-6 right-6',
                'top-left': 'top-6 left-6',
                'top-right': 'top-6 right-6'
            };
            return positions[this.position] || 'bottom-6 right-6';
        }
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        handleMenuItemClick(item) {
            this.isMenuOpen = false;

            if (item.action === 'add') {
                this.showAddModal = true;
            } else if (item.action === 'waiting-list') {
                this.$emit('waiting-list');
                this.$router.push('/caisse/liste-attente');
            } else {
                this.$emit('menu-item-click', item);
            }
        },
        handleAddSubmit(formData) {
            this.showAddModal = false;
            this.$emit('add-submit', formData);
        }
    }
};
</script>

<style scoped>
/* Floating Menu Animations */
.menu-items-enter-active {
    animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.menu-items-leave-active {
    animation: slideOut 0.25s ease-in forwards;
}

.menu-items-enter-from {
    opacity: 0;
    transform: translateX(-20px) scale(0.8);
}

.menu-items-leave-to {
    opacity: 0;
    transform: translateX(-20px) scale(0.8);
}

@keyframes slideIn {
    0% {
        opacity: 0;
        transform: translateX(-20px) scale(0.8);
    }

    100% {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

@keyframes slideOut {
    0% {
        opacity: 1;
        transform: translateX(0) scale(1);
    }

    100% {
        opacity: 0;
        transform: translateX(-20px) scale(0.8);
    }
}

/* Pulse and Ripple animations */
@keyframes ripple {
    0% {
        transform: scale(1);
        opacity: 0.4;
    }

    100% {
        transform: scale(1.8);
        opacity: 0;
    }
}

.animate-ripple {
    animation: ripple 2s infinite;
}

.animate-ping {
    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
    0% {
        transform: scale(1);
        opacity: 0.3;
    }

    75%,
    100% {
        transform: scale(1.5);
        opacity: 0;
    }
}

/* Rotation animation for the FAB icon */
.rotate-45 {
    transform: rotate(45deg);
}
</style>