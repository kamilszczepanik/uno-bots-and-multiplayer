<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useRouter } from 'vue-router'
import ControlButton from '@/components/ControlButton.vue'
import ScoreBoard from '@/components/ScoreBoard.vue'
import { showMessage } from '@/utils/helpers'

const gameStore = useGameStore()
const router = useRouter()

const winner = computed(() => {
  const winnerIndex = gameStore.currentHand?.winner()
  return winnerIndex !== undefined ? gameStore.gameInstance?.player(winnerIndex) : 'Unknown'
})

const handleNextRound = () => {
  const previousHand = gameStore.gameInstance?.previousHand

  if (gameStore.gameInstance?.winner() !== undefined) {
    showMessage('The game has already ended.')
    return
  }

  if (!previousHand?.hasEnded()) {
    showMessage('The current hand is still in progress.')
    return
  }
  console.log(previousHand.hasEnded(), ' is ended?')

  // todo: end current hand
  // gameStore.gameInstance?.endHand()
  router.push('/playing-hand')
}

const handleEndGame = () => {
  gameStore.endGame()
  router.push('/')
}

onMounted(() => {
  if (!gameStore.currentHand) {
    router.push('/').then(() => {
      showMessage('Provide details in the form to create a game.')
    })
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-8 p-8">
    <h1 class="text-center text-6xl font-bold">UNO</h1>
    <h2 class="text-center text-3xl font-bold">Hand Over</h2>
    <p class="text-xl font-semibold text-green-600">
      Winner: <span class="font-bold">{{ winner }}</span>
    </p>
    <ScoreBoard />

    <div class="flex w-96 gap-8">
      <ControlButton variant="primary" @click="handleNextRound"> Next Round </ControlButton>
      <ControlButton variant="destructive" @click="handleEndGame"> End Game </ControlButton>
    </div>
  </div>
</template>
