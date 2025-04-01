<template>
  <div
    class="bg-slate-700 rounded-lg p-2 shadow-lg transform hover:scale-105 transition-transform flex flex-col h-full relative max-w-[220px] w-full ml-0"
  >
    <div class="absolute top-2 right-2">
      <span class="px-2 py-0.5 text-xs rounded-full bg-blue-600 text-white">
        {{ capitalizeFirstLetter(perk.type) }}
      </span>
    </div>

    <div class="flex justify-center items-center min-h-16">
      <span
        class="text-base font-bold text-amber-400 text-center px-2 w-full break-normal whitespace-normal overflow-visible"
        >{{ perk.name }}</span
      >
    </div>

    <div class="flex justify-center mt-auto">
      <img
        :src="perk.img"
        :alt="perk.name"
        class="w-auto h-24 object-contain"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Perks } from "../types/perks";

defineProps<{
  perk: Perks;
}>();

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
</script>
