<template>
  <div class="min-h-screen bg-gray-900 flex flex-col">
    <AppHeader />
    <main class="flex-grow container mx-auto px-4">
      <PerksSelector @generate="generatePerks" />
      <PerksGrid :perks="perks" />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Perks } from "./types/perks.ts";
import { usePerkSelector } from "./composables/usePerkSelector.ts";
import AppHeader from "./components/AppHeader.vue";
import PerksSelector from "./components/PerksSelector.vue";
import PerksGrid from "./components/PerksGrid.vue";
import AppFooter from "./components/AppFooter.vue";

const { initializeSelector, getRandomPerks } = usePerkSelector();
const perks = ref<Perks[]>([]);

onMounted(() => {
  initializeSelector();
});

const generatePerks = (count: number, seed?: string) => {
  perks.value = getRandomPerks(count, seed);
};
</script>
