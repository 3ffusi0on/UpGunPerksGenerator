<template>
  <div class="min-h-screen bg-gray-900 flex flex-col bg-cover bg-no-repeat">
    <ToastNotification ref="toast" message="URL copiée dans le presse-papiers!" type="success" />
    <AppHeader />
    <main class="flex-grow container mx-auto px-4">
      <PerksSelector @generate="generatePerks" @share-url="shareUrl" ref="perksSelector" />

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
          :class="[
            activeType === type
              ? getCategoryColorClass(type)
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
            getCategoryColorClass(type) ? 'text-gray-900' : '',
          ]"
          @click="setActiveType(type)"
        >
          {{ capitalizeFirstLetter(type) }}
        </button>
      </div>

      <div v-if="perks.length === 0" class="flex justify-center items-center py-10">
        <img
          src="/Ameliorations_thumb.webp"
          alt="UpGun Perks"
          class="max-w-full max-h-80 opacity-80"
        />
      </div>

      <PerksGrid
        v-if="perks.length > 0"
        :perks="filteredAndSortedPerks"
        @regeneratePerk="regenerateSinglePerk"
      />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Perks } from './types/perks.ts'
import { usePerkSelector } from './composables/usePerkSelector.ts'
import { getCategoryColorClass } from './utils/categoryColors.ts'
import AppHeader from './components/AppHeader.vue'
import PerksSelector from './components/PerksSelector.vue'
import PerksGrid from './components/PerksGrid.vue'
import AppFooter from './components/AppFooter.vue'
import ToastNotification from './components/ToastNotification.vue'

const {
  initializeSelector,
  getRandomPerks,
  regenerateSinglePerk: regeneratePerk,
} = usePerkSelector()
const perks = ref<Perks[]>([])
const activeType = ref<string>('')
const perksSelector = ref<InstanceType<typeof PerksSelector> | null>(null)
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)

const getQueryParam = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

const updateUrlParams = (params: { seed?: string; count?: number }): void => {
  const url = new URL(window.location.href)

  if (params.seed) {
    url.searchParams.set('seed', params.seed)
  }

  if (params.count) {
    url.searchParams.set('count', params.count.toString())
  }

  window.history.replaceState({}, '', url)
}

const shareUrl = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    if (toast.value) {
      toast.value.show()
    }
  } catch (err) {
    console.error('Failed to copy URL:', err)
    if (toast.value) {
      toast.value.show({
        message: "Échec de la copie de l'URL",
        type: 'error',
      })
    }
  }
}

onMounted(() => {
  initializeSelector()

  const seedFromUrl = getQueryParam('seed')
  const countFromUrl = getQueryParam('count')

  if (perksSelector.value) {
    let perksCount = 22

    if (countFromUrl) {
      const parsedCount = parseInt(countFromUrl, 10)
      if (!isNaN(parsedCount) && parsedCount >= 1 && parsedCount <= 86) {
        perksCount = parsedCount
        perksSelector.value.setPerksCount(parsedCount)
      }
    }

    if (seedFromUrl) {
      perksSelector.value.setSeed(seedFromUrl)
      generatePerks(perksCount, seedFromUrl)
    }
  }
})

const generatePerks = (count: number, seed?: string) => {
  perks.value = getRandomPerks(count, seed)
  activeType.value = ''

  updateUrlParams({
    count: count,
    seed: seed,
  })
}

const regenerateSinglePerk = (perk: Perks) => {
  const newPerk = regeneratePerk(perk, perks.value)
  if (newPerk) {
    const perkIndex = perks.value.findIndex(p => p.name === perk.name)
    if (perkIndex !== -1) {
      perks.value.splice(perkIndex, 1, newPerk)
    }
  }
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
