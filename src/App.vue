<template>
  <div class="min-h-screen bg-gray-900 flex flex-col bg-cover bg-no-repeat">
    <AppHeader />
    <main class="flex-grow container mx-auto px-4">
      <PerksSelector @generate="generatePerks" />

      <div v-if="perks.length > 0" class="flex flex-wrap justify-center gap-2 mb-4">
        <button
          class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
          :class="
            activeType === ''
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          "
          @click="setActiveType('')"
        >
          Tous
        </button>
        <button
          v-for="type in uniquePerkTypes"
          :key="type"
          class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
          :class="
            activeType === type
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          "
          @click="setActiveType(type)"
        >
          {{ capitalizeFirstLetter(type) }}
        </button>
      </div>

      <!-- Placeholder image when no perks are selected -->
      <div v-if="perks.length === 0" class="flex justify-center items-center py-10">
        <img
          src="/Ameliorations_thumb.webp"
          alt="UpGun Perks"
          class="max-w-full max-h-64 opacity-80"
        />
      </div>

      <PerksGrid v-if="perks.length > 0" :perks="filteredAndSortedPerks" />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Perks } from './types/perks.ts'
import { usePerkSelector } from './composables/usePerkSelector.ts'
import AppHeader from './components/AppHeader.vue'
import PerksSelector from './components/PerksSelector.vue'
import PerksGrid from './components/PerksGrid.vue'
import AppFooter from './components/AppFooter.vue'

const { initializeSelector, getRandomPerks } = usePerkSelector()
const perks = ref<Perks[]>([])
const activeType = ref<string>('')

onMounted(() => {
  initializeSelector()
})

const generatePerks = (count: number, seed?: string) => {
  perks.value = getRandomPerks(count, seed)
  activeType.value = ''
}

const uniquePerkTypes = computed(() => {
  const types = new Set(perks.value.map(perk => perk.type))
  return Array.from(types).sort()
})

const filteredAndSortedPerks = computed(() => {
  let result = [...perks.value]

  if (activeType.value) {
    result = result.filter(perk => perk.type === activeType.value)
  }

  result.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type.localeCompare(b.type)
    }
    return a.name.localeCompare(b.name)
  })

  return result
})

const setActiveType = (type: string) => {
  activeType.value = type
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
</script>

<style></style>
