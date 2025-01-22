<script setup lang="ts">
import { computed, defineEmits } from 'vue'
import ControlButton from './ControlButton.vue'
import { handleGameAction, showMessage } from '@/utils/helpers'
import { useGameStore } from '@/stores/gameStore'
import { USER_INDEX } from '@/utils/constants'

const gameStore = useGameStore()
const emit = defineEmits(['close'])

const otherPlayers = computed(() =>
  gameStore.gameInstance?.players
    .map((player, index) => ({ name: player, index }))
    .filter((player) => player.index !== USER_INDEX),
)

const closeModal = () => {
  emit('close')
}

const handleCatchUnoFailure = (playerIndex: number) => {
  handleGameAction(() => {
    const isSuccess = gameStore.currentHand?.catchUnoFailure({
      accuser: USER_INDEX,
      accused: playerIndex,
    })

    if (!isSuccess) {
      showMessage('Failed to catch UNO failure.')
    } else {
      closeModal()
      showMessage(
        `Successfully caught UNO failure! ${gameStore.gameInstance?.players[USER_INDEX]} has to take 4 cards.`,
      )
    }
  })
}
</script>
<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="z-50 w-96 space-y-4 rounded-lg bg-white p-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold">Catch UNO Failure</h2>
        <ControlButton variant="destructive" class="w-fit" @click="closeModal">X</ControlButton>
      </div>
      <p>Pick a player to catch the UNO failure</p>
      <div class="flex flex-col gap-1">
        <ControlButton
          v-for="player in otherPlayers"
          :key="player.index"
          variant="secondary"
          @click="handleCatchUnoFailure(player.index)"
        >
          Catch {{ player.name }}
        </ControlButton>
      </div>
    </div>
  </div>
</template>
