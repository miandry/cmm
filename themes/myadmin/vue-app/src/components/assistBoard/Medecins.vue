<template>
    <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900">Médecins disponibles</h3>
                    <div v-if="loadingDoctors" class="text-xs text-gray-500">
                        <i class="ri-loader-4-line animate-spin mr-1"></i>
                        Chargement...
                    </div>
                </div>
            </div>
            <div class="p-6 space-y-4">
                <div v-if="doctorsList.length === 0 && !loadingDoctors" class="text-center py-8 text-gray-500">
                    <i class="ri-user-unfollow-line text-3xl mb-2 block"></i>
                    <p>Aucun médecin disponible</p>
                </div>

                <div v-for="doctor in doctorsList" :key="doctor.uid"
                    class="flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md"
                    :class="doctor.status === '1' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center"
                            :class="doctor.status === '1' ? 'bg-green-100' : 'bg-gray-100'">
                            <i class="ri-user-heart-line"
                                :class="doctor.status === '1' ? 'text-green-600' : 'text-gray-600'"></i>
                        </div>
                        <div>
                            <div class="font-medium text-gray-900">Dr. {{ doctor.name }}</div>
                            <div class="text-sm text-gray-600">{{ getSpecialtyLabel(doctor.field_specialite) ||
                                'Spécialité non définie' }}</div>
                            <div class="text-xs mt-1"
                                :class="doctor.status === '1' ? 'text-green-600' : 'text-gray-500'">
                                <i :class="doctor.status === '1' ? 'ri-checkbox-circle-line' : 'ri-time-line'"></i>
                                {{ doctor.status === '1' ? 'Disponible' : 'Indisponible' }}
                            </div>
                        </div>
                    </div>
                    <div class="w-3 h-3 rounded-full"
                        :class="doctor.status === '1' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../../stores/index';
import { getSpecialtyLabel } from '../../utils/specialties.js';

export default {
    name: "Medecins",
    setup() {
        const userStore = useUserStore();
        const loadingDoctors = ref(false);
        const doctorsLoaded = ref(false);

        // Filtrer uniquement les médecins depuis userStore.users
        const doctorsList = computed(() => {
            const allUsers = userStore.users.rows || [];
            // Filtrer les médecins (rôle docteur et status actif)
            return allUsers.filter(user =>
                user.roles &&
                user.roles.includes('docteur') &&
                user.status === '1'
            );
        });

        const loadDoctorsOnce = async () => {
            // Si déjà chargé, ne rien faire
            if (doctorsLoaded.value) return;

            // Si le store a déjà des données, marquer comme chargé
            if (userStore.users.rows && userStore.users.rows.length > 0) {
                doctorsLoaded.value = true;
                return;
            }

            // Sinon, charger les données
            loadingDoctors.value = true;
            try {
                const doctorQueryOptions = {
                    fields: ['uid', 'name', 'field_specialite', 'status', 'roles'],
                    sort: { val: 'name', op: 'asc' },
                    filters: {
                        roles: { val: "docteur", op: "=" },
                        status: { val: 1, op: "=" }
                    },
                    pager: 0,
                    offset: 100
                };
                await userStore.fetchUsers(doctorQueryOptions);
                doctorsLoaded.value = true;
            } catch (err) {
                console.error('Error loading doctors:', err);
            } finally {
                loadingDoctors.value = false;
            }
        };

        onMounted(() => {
            loadDoctorsOnce();
        });

        return {
            doctorsList,
            loadingDoctors,
            getSpecialtyLabel
        };
    }
}
</script>

<style scoped>
.animate-spin {
    animation: spin 1s linear infinite;
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: .5;
    }
}
</style>