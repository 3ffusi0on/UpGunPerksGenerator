import { ref } from 'vue'
import { PerkSelector } from '../utils/perksSelector'
import type { Perks } from '../types/perks'

export function usePerkSelector() {
  const perkSelector = ref<PerkSelector | null>(null)
  const error = ref<string>('')
  const currentSeed = ref<string>('')

  const initializeSelector = () => {
    try {
      perkSelector.value = new PerkSelector()
    } catch (err) {
      error.value = 'Failed to initialize perk selector'
      console.error(err)
    }
  }

  const getRandomPerks = (count: number, seed?: string) => {
    if (!perkSelector.value) {
      error.value = 'Perk selector not initialized'
      return []
    }

    try {
      if (seed) {
        currentSeed.value = seed
      }
      return perkSelector.value.selectRandomPerks(count, seed)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to select perks'
      return []
    }
  }

  const regenerateSinglePerk = (perk: Perks, currentPerks: Perks[] = []): Perks | null => {
    if (!perkSelector.value) {
      error.value = 'Perk selector not initialized'
      return null
    }

    try {
      const seed = currentSeed.value || Math.random().toString(36).substring(2, 15)
      if (!currentSeed.value) {
        currentSeed.value = seed
      }

      const currentPerkNames = currentPerks.map(p => p.name)

      const newPerk = perkSelector.value.selectSinglePerkOfType(perk.type, seed, currentPerkNames)
      return newPerk
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to regenerate perk'
      return null
    }
  }

  const resetSelector = () => {
    if (perkSelector.value) {
      perkSelector.value.resetUsedPerks()
    }
  }

  const getAvailableCount = (): number => {
    return perkSelector.value?.getAvailablePerkCount() ?? 0
  }

  const getCurrentSeed = (): string => {
    return currentSeed.value
  }

  return {
    initializeSelector,
    getRandomPerks,
    regenerateSinglePerk,
    resetSelector,
    getAvailableCount,
    getCurrentSeed,
    error,
  }
}
