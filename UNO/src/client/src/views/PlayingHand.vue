<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const playerCount = computed(() => gameStore.playerCount)
</script>

<template>
  <div class="w-96 mx-auto p-2">
    <h1 class="text-7xl text-center">UNO Game</h1>
    <h2 class="text-2xl text-center font-semibold mb-6">Number of Players: {{ playerCount }}</h2>
  </div>
</template>
