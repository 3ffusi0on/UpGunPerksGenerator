<template>
  <div class="my-8 flex flex-row items-center justify-center gap-4 flex-wrap">
    <div class="flex items-center gap-4">
      <label for="perksCount" class="text-white">Nombre de Perks:</label>
      <input
        type="number"
        id="perksCount"
        v-model="perksCount"
        min="1"
        max="86"
        class="bg-gray-700 text-white px-4 py-2 rounded-lg"
      />
    </div>

    <div class="relative">
      <div
        v-if="showSeedPopover"
        class="seed-popover absolute top-12 left-0 z-10 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-600 w-80"
      >
        <div class="flex flex-col gap-2 mb-3">
          <input
            type="text"
            id="seed"
            v-model="seed"
            placeholder="Aléatoire si vide"
            class="bg-gray-700 text-white px-4 py-2 rounded-lg w-full"
          />
        </div>
        <button
          @click="generatePerksWithSeed"
          class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors w-full"
        >
          Utiliser ce Seed
        </button>
      </div>

      <button
        @click="toggleSeedPopover"
        class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        <SettingsIcon />
        Utiliser un Seed
      </button>
    </div>

    <button
      @click="generatePerksWithNewSeed"
      class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
    >
      <RefreshIcon />
      Génération aléatoire
    </button>
    <button
      :disabled="!seed"
      @click="shareUrl"
      class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
    >
      <ShareIcon />
      Partager
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SettingsIcon from '../assets/icons/SettingsIcon.vue'
import RefreshIcon from '../assets/icons/RefreshIcon.vue'
import ShareIcon from '../assets/icons/ShareIcon.vue'

const emit = defineEmits<{
  (e: 'generate', count: number, seed?: string): void
  (e: 'share-url'): void
}>()

const perksCount = ref(22)
const seed = ref('')
const showSeedPopover = ref(false)

const toggleSeedPopover = () => {
  showSeedPopover.value = !showSeedPopover.value
}

const closePopoverOnClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (
    showSeedPopover.value &&
    !target.closest('.seed-popover') &&
    !target.closest('button[class*="bg-green-600"]')
  ) {
    showSeedPopover.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closePopoverOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closePopoverOnClickOutside)
})

const generateRandomSeed = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

const validatePerksCount = () => {
  if (perksCount.value < 1) {
    perksCount.value = 1
  } else if (perksCount.value > 86) {
    perksCount.value = 86
  }
}

const generatePerksWithSeed = () => {
  validatePerksCount()
  const currentSeed = seed.value || generateRandomSeed()
  if (!seed.value) {
    seed.value = currentSeed
  }

  emit('generate', perksCount.value, currentSeed)
}

const generatePerksWithNewSeed = () => {
  validatePerksCount()
  const newSeed = generateRandomSeed()
  seed.value = newSeed

  emit('generate', perksCount.value, newSeed)
}

const shareUrl = () => {
  emit('share-url')
}

const setSeed = (newSeed: string) => {
  seed.value = newSeed
}

const setPerksCount = (count: number) => {
  perksCount.value = count
}

defineExpose({
  setSeed,
  setPerksCount,
})
</script>
