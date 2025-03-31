<template>
  <header class="bg-gray-800 text-white py-6 px-4 shadow-lg">
    <div class="container mx-auto">
      <div
        v-if="warningMessage"
        class="bg-yellow-600 text-white py-1 px-2 mb-2 rounded text-sm text-center"
      >
        {{ warningMessage }}
      </div>
      <h1 class="text-3xl font-bold text-center">{{ title }}</h1>
    </div>
  </header>
</template>

<script setup lang="ts">
const title = "UpGun Perks Generator";
const warningMessage =
  "Beta version - Des erreurs de noms ou d'images sont présentes pour le moment.";
</script>
