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
const currentPlayerIndex = computed(() => gameStore.currentHand?.playerInTurn())
const playersThatSaidUno = computed(() => gameStore.currentHand?.playersThatSaidUno)
const playerSaidUno = computed(() => playersThatSaidUno.value?.has(playerIndex))
</script>

<template>
  <div class="m-4 flex flex-col">
    <p v-if="currentPlayerIndex === playerIndex">CURRENTLY PLAYING</p>
    <p v-if="playerSaidUno">SAID UNO</p>
    <h3 class="text-lg font-bold">{{ name }}</h3>
    <p class="text-sm text-gray-600">Score: {{ score }}</p>
  </div>
</template>
