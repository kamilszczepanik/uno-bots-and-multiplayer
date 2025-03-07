<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { handleGameAction, showMessage } from '@/utils/helpers'
import { computed } from 'vue'
import ControlButton from './ControlButton.vue'
import { USER_INDEX } from '@/utils/constants'

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

const handleCatchUnoFailure = () => {
  handleGameAction(() => {
    const isSuccess = gameStore.currentHand?.catchUnoFailure({
      accuser: gameStore.currentHand?.playerInTurn() || 0,
      accused: playerIndex,
    })

    if (!isSuccess) {
      showMessage('Failed to catch UNO failure.')
    } else {
      showMessage(`Successfully caught UNO failure! ${name.value} has to take 4 cards.`)
    }
  })
}
</script>

<template>
  <div class="-mb-6 flex flex-col pb-6">
    <p
      :class="currentPlayerIndex === playerIndex ? 'visible text-yellow-600' : 'invisible'"
      class=""
    >
      CURRENTLY PLAYING
    </p>
    <p v-if="playerSaidUno">SAID UNO</p>
    <h3 class="text-lg font-bold">{{ name }}</h3>
    <p class="text-sm text-gray-600">Score: {{ score }}</p>
    <ControlButton
      v-if="USER_INDEX !== playerIndex"
      @click="handleCatchUnoFailure"
      variant="secondary"
      class="text-xs"
    >
      Catch UNO Failure
    </ControlButton>
  </div>
</template>
