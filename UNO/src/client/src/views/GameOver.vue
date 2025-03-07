<script setup lang="ts">
import ControlButton from '@/components/ControlButton.vue'
import ScoreBoard from '@/components/ScoreBoard.vue'
import { useGameStore } from '@/stores/gameStore'
import { showMessage } from '@/utils/helpers'
import { computed, onMounted, toRefs } from 'vue'
import { useRouter } from 'vue-router'

const gameStore = useGameStore()
const router = useRouter()
const game = computed(() => gameStore.gameInstance)
const targetScore = computed(() => game.value?.targetScore)
const winnerIndex = computed(() => game.value?.winner())
const winnerData = computed(() => {
  if (winnerIndex.value !== undefined) {
    return {
      winnerName: game.value?.players[winnerIndex.value],
      winnerScore: game.value?.score(winnerIndex.value),
    }
  }
  return {
    winnerName: null,
    winnerScore: null,
  }
})

const { winnerName, winnerScore } = toRefs(winnerData.value)

onMounted(() => {
  if (!game.value) {
    router.push('/').then(() => {
      showMessage('Provide details in the form to create a game.')
    })
  }
})

const handleStartNewGame = () => {
  gameStore.endGame()
  router.push('/')
}
const handleRestartTheGame = () => {
  console.log('restart')
}
</script>

<template>
  <div v-if="game" class="mx-auto flex w-96 flex-col items-center justify-center space-y-8">
    <h1 class="text-center text-6xl font-bold">UNO</h1>
    <h2 class="text-center text-3xl font-bold">Game Over</h2>
    <p class="text-xl font-semibold text-green-600">
      Winner: <span class="font-bold">{{ winnerName }}</span> with a score of
      <span class="font-bold">{{ winnerScore }}</span>
    </p>
    <p>Target score was: {{ targetScore }}</p>
    <ScoreBoard />
    <div class="flex w-full gap-8">
      <ControlButton variant="primary" @click="handleStartNewGame"> New Game </ControlButton>
      <ControlButton variant="secondary" @click="handleRestartTheGame">
        Restart Game
      </ControlButton>
    </div>
  </div>
</template>
