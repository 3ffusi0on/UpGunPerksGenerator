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
    <div class="flex items-center gap-4">
      <label for="seed" class="text-white">Seed:</label>
      <input
        type="text"
        id="seed"
        v-model="seed"
        placeholder="Laisser vide pour aléatoire"
        class="bg-gray-700 text-white px-4 py-2 rounded-lg w-60"
      />
    </div>
    <button
      @click="generatePerks"
      class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
    >
      Générer les Perks
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "generate", count: number, seed?: string): void;
}>();

const perksCount = ref(22);
const seed = ref("");

const generateRandomSeed = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

const generatePerks = () => {
  if (perksCount.value < 1) {
    perksCount.value = 1;
  } else if (perksCount.value > 86) {
    perksCount.value = 86;
  }

  const currentSeed = seed.value || generateRandomSeed();
  if (!seed.value) {
    seed.value = currentSeed;
  }

  emit("generate", perksCount.value, currentSeed);
};
</script>
