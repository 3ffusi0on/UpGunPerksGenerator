<template>
  <div
    class="grid grid-cols-none gap-6 p-4"
    style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))"
  >
    <PerksItem v-for="perk in perks" :key="perk.name" :perk="perk" />
  </div>
</template>

<script setup lang="ts">
import type { Perks } from "../types/perks";
import PerksItem from "./PerksItem.vue";

defineProps<{
  perks: Perks[];
}>();
</script>
