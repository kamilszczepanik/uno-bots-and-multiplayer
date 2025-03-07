<script setup lang="ts">
import { computed } from 'vue'
import ControlButton from './ControlButton.vue'
import type { IndexedGame } from '../../../shared/types'
import { useUserStore } from '@/stores/userStore'

const { game, playerId } = defineProps<{
  game: IndexedGame
  playerId: string
}>()

const userId = useUserStore().userInfo.id
const playerIndexMap = computed(() => {
  return Object.fromEntries(game.players.map((player, index) => [player.id, index]))
})

const score = computed(() => game.scores[playerIndexMap.value[playerId] ?? -1])
const name = computed(() => {
  const player = game.players.find((p) => p.id === playerId)
  return player ? player.username : 'Unknown'
})
const currentHand = computed(() => game.hands[game.currentRound - 1])
const currentPlayerId = computed(() => currentHand.value?.currentPlayerId)
const isCurrentPlayer = computed(() => playerId === currentPlayerId.value)
const playersWhoSaidUno = computed(() => currentHand.value.playersWhoSaidUno)
const playerSaidUno = computed(() => {
  return playersWhoSaidUno.value.includes(playerIndexMap.value[playerId])
})
const isOpponent = computed(() => playerId !== userId)

// const handleCatchUnoFailure = () => {
//   handleGameAction(() => {
//     const isSuccess = currentHand.value?.catchUnoFailure({
//       accuser: currentHand.value?.playerInTurn() || 0,
//       accused: playerIndex,
//     })

//     if (!isSuccess) {
//       showMessage('Failed to catch UNO failure.')
//     } else {
//       showMessage(`Successfully caught UNO failure! ${name.value} has to take 4 cards.`)
//     }
//   })
// }
</script>

<template>
  <div class="-mb-6 flex flex-col pb-6">
    <p :class="isCurrentPlayer ? 'visible text-yellow-600' : 'invisible'" class="">
      CURRENTLY PLAYING
    </p>
    <p v-if="playerSaidUno" class="text-primary-500">SAID UNO</p>
    <h3 class="text-lg font-bold">{{ name }}</h3>
    <p class="text-sm text-gray-600">Score: {{ score }}</p>
    <ControlButton v-if="isOpponent" variant="secondary" class="text-xs">
      Catch UNO Failure
    </ControlButton>
  </div>
</template>
