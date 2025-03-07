<script setup lang="ts">
import { computed } from 'vue'
import GameCard from './GameCard.vue'
import PlayerInfo from './PlayerInfo.vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const userHand = computed(() => gameStore.currentHand?.playerHand(0))
</script>

<template>
  <div class="flex">
    <PlayerInfo :player-index="0" />
    <div v-for="(card, index) in userHand" :key="index" class="">
      <GameCard :card="card" />
    </div>
  </div>
</template>
