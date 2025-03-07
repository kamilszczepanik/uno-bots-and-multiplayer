<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useRouter } from 'vue-router'
import ControlButton from '@/components/ControlButton.vue'
import { showMessage } from '@/utils/helpers'

const gameStore = useGameStore()
const router = useRouter()

// Compute winner name and scores
const winner = computed(() => {
  const winnerIndex = gameStore.currentHand?.winner()
  return winnerIndex !== undefined ? gameStore.gameInstance?.player(winnerIndex) : 'Unknown'
})

const scores = computed(() =>
  gameStore.gameInstance?.players.map((player, index) => ({
    name: player,
    score: gameStore.gameInstance?.score(index),
  })),
)

const handleNextRound = () => {
  const previousHand = gameStore.previousHand

  if (gameStore.gameInstance?.winner() !== undefined) {
    showMessage('The game has already ended.')
    return
  }

  if (!previousHand?.hasEnded()) {
    showMessage('The current hand is still in progress.')
    return
  }

  // todo: end current hand
  // gameStore.gameInstance?.endHand()
  router.push('/playing-hand')
}

const handleEndGame = () => {
  gameStore.endGame()
  router.push('/')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-8 p-8">
    <h1 class="text-center text-4xl font-bold">Hand Over</h1>
    <p class="text-xl font-semibold text-green-600">
      Winner: <span class="font-bold">{{ winner }}</span>
    </p>

    <table class="w-1/2 table-auto border-collapse border border-gray-400 text-center">
      <thead>
        <tr>
          <th class="border border-gray-400 px-4 py-2">Player</th>
          <th class="border border-gray-400 px-4 py-2">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in scores" :key="player.name">
          <td class="border border-gray-400 px-4 py-2">{{ player.name }}</td>
          <td class="border border-gray-400 px-4 py-2">{{ player.score }}</td>
        </tr>
      </tbody>
    </table>

    <div class="flex w-96 gap-8">
      <ControlButton variant="primary" @click="handleNextRound"> Next Round </ControlButton>
      <ControlButton variant="destructive" @click="handleEndGame"> End Game </ControlButton>
    </div>
  </div>
</template>
