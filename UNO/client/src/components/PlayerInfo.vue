<script setup lang="ts">
import { computed } from 'vue'
import ControlButton from './ControlButton.vue'
import type { IndexedGame } from '../../../shared/types'
import { useUserStore } from '@/stores/userStore'
import { handleGameAction, showMessage } from '@/utils/helpers'
import * as api from '@/model/api'

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

const handleCatchUnoFailure = () =>
  handleGameAction(
    async () => {
      if (!game || !currentHand.value) {
        showMessage('Game or current hand not found. Please refresh or try again.')
        return
      }

      if (!userId) {
        showMessage('User ID not found. Please refresh or try again.')
        return
      }

      const accuserIndex = playerIndexMap.value[userId] ?? -1
      const accusedIndex = playerIndexMap.value[playerId] ?? -1

      if (accuserIndex === -1 || accusedIndex === -1) {
        showMessage('Could not determine accuser or accused player.')
        return
      }

      await api.catchUnoFailure({
        gameId: game.id,
        handId: currentHand.value.id,
        accuser: accuserIndex,
        accused: accusedIndex,
      })
    },
    {
      successMessage: 'Failed to catch UNO failure',
      errorMessage: 'Successfully caught UNO failure! ${name.value} has to take 4 cards.',
    },
  )
</script>

<template>
  <div class="-mb-6 flex flex-col pb-6">
    <p :class="isCurrentPlayer ? 'visible text-yellow-600' : 'invisible'" class="">
      CURRENTLY PLAYING
    </p>
    <p v-if="playerSaidUno" class="text-primary-500">SAID UNO</p>
    <h3 class="text-lg font-bold">{{ name }}</h3>
    <p class="text-sm text-gray-600">Score: {{ score }}</p>
    <ControlButton
      v-if="isOpponent"
      variant="secondary"
      class="text-xs"
      @click="handleCatchUnoFailure"
    >
      Catch UNO Failure
    </ControlButton>
  </div>
</template>
