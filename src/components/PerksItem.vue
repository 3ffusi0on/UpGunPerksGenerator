<template>
  <div
    class="bg-slate-700 rounded-lg p-2 shadow-lg transform hover:scale-105 transition-transform flex flex-col h-full relative max-w-[220px] w-full ml-0 cursor-pointer"
    @click="toggleDisabled"
  >
    <div
      v-if="isDisabled"
      class="absolute inset-0 bg-gray-800 bg-opacity-70 rounded-lg z-10 flex items-center justify-center"
    >
      <!-- <div class="h-0.5 w-16 bg-red-500 rotate-45 absolute"></div>
      <div class="h-0.5 w-16 bg-red-500 -rotate-45 absolute"></div> -->
    </div>

    <div class="absolute top-2 right-2 z-20">
      <span
        class="px-2 py-0.5 text-xs rounded-full text-gray-900"
        :class="getCategoryColorClass(perk.type)"
      >
        {{ capitalizeFirstLetter(perk.type) }}
      </span>
    </div>

    <div class="flex justify-center items-center min-h-16">
      <span
        class="text-base font-bold text-amber-400 text-center px-2 w-full break-normal whitespace-normal overflow-visible"
        >{{ perk.name }}</span
      >
    </div>

    <div class="flex justify-center mt-auto relative">
      <img :src="perk.img" :alt="perk.name" class="w-auto h-24 object-contain" />
      <button
        @click.stop="regeneratePerk"
        class="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 rounded-full p-1.5 text-white transition-colors"
        title="Remplacer le Perks"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Perks } from '../types/perks'
import { getCategoryColorClass } from '../utils/categoryColors'

const props = defineProps<{
  perk: Perks
}>()

const emit = defineEmits<{
  (e: 'regenerate', perk: Perks): void
}>()

const isDisabled = ref(false)

const toggleDisabled = () => {
  isDisabled.value = !isDisabled.value
}

const regeneratePerk = () => {
  emit('regenerate', props.perk)
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
</script>
