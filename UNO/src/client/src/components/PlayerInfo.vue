<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { computed } from 'vue'

const { playerIndex } = defineProps({
  playerIndex: {
    type: Number,
    required: true,
  },
})

const gameStore = useGameStore()
const score = computed(() => gameStore.gameInstance?.score(playerIndex))
const name = computed(() => gameStore.gameInstance?.player(playerIndex))
</script>

<template>
  <div class="m-4 flex flex-col">
    <h3 class="text-lg font-bold">{{ name }}</h3>
    <p class="text-sm text-gray-600">Score: {{ score }}</p>
  </div>
</template>
