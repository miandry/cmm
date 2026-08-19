<template>
    <div class="flex items-center space-x-2">
        <select v-model="period" @change="apply"
            class="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
        </select>
        <input type="date" v-model="from" @change="apply" class="px-3 py-2 border rounded hidden" />
        <input type="date" v-model="to" @change="apply" class="px-3 py-2 border rounded hidden" />
    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'

export default {
    name: 'ReportFilters',
    emits: ['applyFilter'],
    setup(_, { emit }) {
        const period = ref('today')
        const from = ref('')
        const to = ref('')

        const getTodayDate = () => {
            const today = new Date()
            return today.toISOString().slice(0, 10)
        }

        const apply = () => {
            if (period.value === 'today' && !from.value && !to.value) {
                const today = getTodayDate()
                from.value = today
                to.value = today
            }
            emit('applyFilter', { period: period.value, from: from.value, to: to.value })
        }

        watch(period, () => {
            from.value = ''
            to.value = ''
            if (period.value === 'today') {
                const today = getTodayDate()
                from.value = today
                to.value = today
            }
            apply()
        })

        onMounted(() => {
            const today = getTodayDate()
            from.value = today
            to.value = today
            apply()
        })

        return { period, from, to, apply }
    }
}
</script>