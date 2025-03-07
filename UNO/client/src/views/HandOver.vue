<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useRouter } from 'vue-router'
import ControlButton from '@/components/ControlButton.vue'
import ScoreBoard from '@/components/ScoreBoard.vue'
import { showMessage } from '@/utils/helpers'

const gameStore = useGameStore()
const router = useRouter()
const game = computed(() => gameStore.game)
const currentHand = computed(() => game.value?.currentHand())
const previousHand = computed(() => game.value?.previousHand)
const gameWinner = computed(() => game.value?.winner())
const targetScore = computed(() => game.value?.targetScore)

const winner = computed(() => {
  const winnerIndex = previousHand.value?.winner()
  return winnerIndex !== undefined ? game.value?.player(winnerIndex) : 'Unknown'
})

const handleNextRound = () => {
  const previousHand = game.value?.previousHand

  if (game.value?.winner() !== undefined) {
    showMessage('The game has already ended.')
    return
  }

  if (!previousHand?.hasEnded()) {
    showMessage('The current hand is still in progress.')
    return
  }

  router.push('/playing-hand')
}

const handleEndGame = () => {
  gameStore.endGame()
  router.push('/')
}

onMounted(() => {
  if (gameWinner.value) {
    router.push('/game-over').then(() => {
      showMessage('The game is over!')
    })
  } else if (!currentHand.value) {
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
    <p>
      Target score is <span class="font-bold">{{ targetScore }}</span>
    </p>
    <ScoreBoard />

    <div class="flex w-96 gap-8">
      <ControlButton variant="primary" @click="handleNextRound"> Next Round </ControlButton>
    </div>
  </div>
</template>
