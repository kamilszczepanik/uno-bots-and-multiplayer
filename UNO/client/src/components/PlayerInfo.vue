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
const score = computed(() => gameStore.game?.score(playerIndex))
const name = computed(() => gameStore.game?.player(playerIndex))
const currentHand = computed(() => gameStore.game?.currentHand())
const currentPlayerIndex = computed(() => currentHand.value?.playerInTurn())
const playersThatSaidUno = computed(() => currentHand.value?.playersThatSaidUno)
const playerSaidUno = computed(() => playersThatSaidUno.value?.has(playerIndex))

const handleCatchUnoFailure = () => {
  handleGameAction(() => {
    const isSuccess = currentHand.value?.catchUnoFailure({
      accuser: currentHand.value?.playerInTurn() || 0,
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
    <p v-if="playerSaidUno" class="text-primary-500">SAID UNO</p>
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
