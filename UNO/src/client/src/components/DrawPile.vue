<script setup lang="ts">
import { computed } from 'vue'
import GameCard from './GameCard.vue'

import { useGameStore } from '@/stores/gameStore'
import { showMessage } from '@/utils/helpers'
import { useUserStore } from '@/stores/userStore'
import type { Card } from '../../../model/deck'

const gameStore = useGameStore()
const userStore = useUserStore()
const currentHand = computed(() => gameStore.currentHand)
const drawPile = computed(() => {
  const pile = currentHand.value?.drawPile
  return pile ? (JSON.parse(pile)._cards as Card[]) : []
})
const currentPlayerId = computed(() => currentHand.value?.currentPlayerId)
const userIsCurrentPlayer = computed(() => {
  return currentPlayerId.value === userStore.userInfo.id
})
const visibleCards = computed(() => {
  if (!drawPile.value) {
    return 0
  }

  return Math.min(drawPile.value.length, 10)
})

const onClick = () => {
  if (!userIsCurrentPlayer.value) {
    showMessage('Not your turn')
    return
  }

  // todo: handle game action
  // handleGameAction(() => currentHand.value?.draw())
}
</script>

<template>
  <div class="relative">
    <div
      v-for="i in visibleCards"
      :key="i"
      :class="`card-stack absolute left-0 top-0 ${userIsCurrentPlayer ? 'cursor-pointer' : 'cursor-not-allowed'}`"
      :style="{ zIndex: i, transform: `translateY(-${i}px)` }"
    >
      <GameCard :showBack="true" @click="onClick" class="'hover:scale-105'" />
    </div>
  </div>
</template>

<style scoped>
.card-stack {
  transition: transform 0.2s ease-in-out;
}
</style>
