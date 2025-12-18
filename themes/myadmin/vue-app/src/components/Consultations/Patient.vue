<template>
    <div>
        <div class="p-3 border-b border-gray-200">
            <div class="flex items-center justify-between">
                <h2 class="text-base font-semibold text-gray-900">Patient actuel</h2>
                <button @click="openPatientModal" class="text-xs text-primary hover:underline cursor-pointer"
                    v-if="canChange">
                    {{ store.client && store.client.nid ? 'Changer' : 'Ajouter' }}
                </button>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg" v-if="store.client && store.client.nid">
                <div class="flex items-center space-x-3 mb-3">
                    <div
                        class="w-12 h-12 bg-primary text-white rounded-full uppercase flex items-center justify-center text-lg font-medium">
                        {{ store.client.title.slice(0, 2) }}
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-900">{{ store.client.title }}</p>
                        <p class="text-xs text-gray-500">{{ store.client.field_phone }}</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <span class="text-gray-600">Âge</span>
                        <p class="font-medium" v-if="store.client.field_age">{{ store.client.field_age }}</p>
                        <p class="font-medium" v-else>Pas renseigner</p>
                    </div>
                    <div>
                        <span class="text-gray-600">Sexe</span>
                        <p class="font-medium" v-if="store.client.field_sexe">{{ store.client.field_sexe == "masculin" ?
                            "Masculin" : "Féminin" }}</p>
                        <p class="font-medium" v-else>Pas renseigner</p>
                    </div>
                    <div>
                        <span class="text-gray-600">Assurance</span>
                        <div class="flex items-center space-x-1" v-if="store.client.field_assurance == 1">
                            <div class="w-2 h-2 bg-secondary rounded-full"></div>
                            <span class="font-medium text-secondary">Oui</span>
                        </div>
                        <div class="flex items-center space-x-1" v-else>
                            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span class="font-medium text-red-500">Non</span>
                        </div>
                    </div>
                    <div>
                        <span class="text-gray-600">Allergies</span>
                        <p class="font-medium text-red-600" v-if="store.client.field_allergies">{{
                            store.client.field_allergies }}</p>
                        <p class="font-medium text-red-600" v-else>Aucun</p>
                    </div>
                </div>
            </div>
            <div class="flex items-center space-x-2 mb-2" v-else>
                <div class="text-center text-gray-300 w-full">
                    Aucun client sélectionné
                </div>
            </div>
        </div>

        <!-- modals -->
        <PatientModal :showPatientModal="showPatientModal" @update:showPatientModal="v => showPatientModal = v" />
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import PatientModal from './PatientModal.vue';
import { useClientStore } from '../../stores/index.js';

export default {
    name: "Patient",
    components: {
        PatientModal,
    },
    props: {
        canChange: {
            type: Boolean,
        },
    },
    setup(props) {
        const store = useClientStore();
        const showPatientModal = ref(false);
        const canChange = ref(props.canChange)
        const openPatientModal = () => {
            showPatientModal.value = true
        }
        watch(
            () => props.canChange,
            (newVal) => {
                canChange.value = newVal
            },
            { immediate: true }
        )
        return {
            showPatientModal,
            openPatientModal,
            store,
            canChange
        }
    }
}
</script>

<style></style>