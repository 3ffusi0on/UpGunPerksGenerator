import { ref } from "vue";
import { PerkSelector } from "../utils/perksSelector";

export function usePerkSelector() {
  const perkSelector = ref<PerkSelector | null>(null);
  const error = ref<string>("");
  const currentSeed = ref<string>("");

  const initializeSelector = () => {
    try {
      perkSelector.value = new PerkSelector();
    } catch (err) {
      error.value = "Failed to initialize perk selector";
      console.error(err);
    }
  };

  const getRandomPerks = (count: number, seed?: string) => {
    if (!perkSelector.value) {
      error.value = "Perk selector not initialized";
      return [];
    }

    try {
      // Store the current seed
      if (seed) {
        currentSeed.value = seed;
      }
      return perkSelector.value.selectRandomPerks(count, seed);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to select perks";
      return [];
    }
  };

  const resetSelector = () => {
    if (perkSelector.value) {
      perkSelector.value.resetUsedPerks();
    }
  };

  const getAvailableCount = (): number => {
    return perkSelector.value?.getAvailablePerkCount() ?? 0;
  };

  const getCurrentSeed = (): string => {
    return currentSeed.value;
  };

  return {
    initializeSelector,
    getRandomPerks,
    resetSelector,
    getAvailableCount,
    getCurrentSeed,
    error,
  };
}
