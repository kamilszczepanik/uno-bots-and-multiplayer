<script setup lang="ts">
import { computed } from 'vue'
import GameCard from './GameCard.vue'
import PlayerInfo from './PlayerInfo.vue'
import { useGameStore } from '@/stores/gameStore'
import { USER_INDEX } from '@/utils/constants'
import GameControls from './GameControls.vue'

const gameStore = useGameStore()
const currentHand = computed(() => gameStore.currentHand)
const currentPlayerIndex = computed(() => gameStore.currentHand?.playerInTurn())
const userHand = computed(() => gameStore.currentHand?.playerHand(USER_INDEX))
const userIsCurrentPlayer = computed(() => currentPlayerIndex.value === USER_INDEX)

const playCard = (index: number) => {
  if (!userIsCurrentPlayer.value) {
    alert("It's not your turn")
    return
  }

  if (!currentHand.value?.canPlay(index)) {
    alert("You can't play this card")
    return
  }

  currentHand.value?.play(index)
}
</script>
<template>
  <div class="flex w-full items-center justify-between px-4">
    <div class="flex flex-grow flex-col items-center">
      <div class="flex pb-2">
        <PlayerInfo :player-index="USER_INDEX" />
        <div
          v-for="(card, index) in userHand"
          :key="index"
          :class="[
            'transition-transform',
            userIsCurrentPlayer ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed',
          ]"
          @click="userIsCurrentPlayer ? playCard(index) : null"
        >
          <GameCard :card="card" />
        </div>
      </div>
    </div>
    <GameControls class="pb-2" />
  </div>
</template>
