<template>
    <div class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Observations</label>
            <textarea id="examination-findings" rows="4"
                class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Notez vos observations lors de l'examen physique..."></textarea>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Diagnostic</label>
            <input type="text" id="diagnosis"
                class="w-full px-3 py-2 border border-gray-300 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Diagnostic principal">
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style></style>