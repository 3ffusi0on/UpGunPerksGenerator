<template>
  <div>
    <template v-if="groupedPerks.length > 0">
      <div v-for="(group, index) in groupedPerks" :key="group.type" class="mb-8">
        <h2
          v-if="showTypeHeadings && index >= 0"
          class="text-xl text-white font-bold mb-3 pl-2 border-l-4 border-blue-600"
        >
          {{ capitalizeFirstLetter(group.type) }}
        </h2>

        <div
          class="grid grid-cols-none gap-6 p-4 justify-start"
          style="grid-template-columns: repeat(auto-fill, minmax(180px, 220px))"
        >
          <PerksItem v-for="perk in group.perks" :key="perk.name" :perk="perk" />
        </div>
      </div>
    </template>
    <div
      v-else
      class="grid grid-cols-none gap-6 p-4 justify-start"
      style="grid-template-columns: repeat(auto-fill, minmax(180px, 220px))"
    >
      <PerksItem v-for="perk in perks" :key="perk.name" :perk="perk" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Perks } from '../types/perks'
import PerksItem from './PerksItem.vue'

const props = defineProps<{
  perks: Perks[]
}>()

const groupedPerks = computed(() => {
  if (!props.perks.length) return []

  const groups: { [key: string]: Perks[] } = {}
  props.perks.forEach(perk => {
    if (!groups[perk.type]) {
      groups[perk.type] = []
    }
    groups[perk.type].push(perk)
  })

  return Object.entries(groups)
    .map(([type, perks]) => ({
      type,
      perks,
    }))
    .sort((a, b) => a.type.localeCompare(b.type))
})

const showTypeHeadings = computed(() => {
  return groupedPerks.value.length > 1
})

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
</script>
