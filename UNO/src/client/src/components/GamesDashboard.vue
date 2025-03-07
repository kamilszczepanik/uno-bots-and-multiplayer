<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import axiosInstance from '@/utils/axiosInstance'
import { showMessage } from '@/utils/helpers'
import { computed, onMounted, ref } from 'vue'
import GamesList from './GamesList.vue'
import { useGameStore } from '@/stores/gameStore'

const userStore = useUserStore()
const gameStore = useGameStore()
const allGames = computed(() => gameStore.allGames)
const waitingGames = computed(() => allGames.value.filter((game) => game.status === 'waiting'))
const pausedGames = computed(() => allGames.value.filter((game) => game.status === 'paused'))
const inProgressGames = computed(() =>
  allGames.value.filter((game) => game.status === 'in progress'),
)
const finishedGames = computed(() => allGames.value.filter((game) => game.status === 'finished'))

const loadingGames = ref(false)
const errorLoadingGames = ref<string | null>(null)

const handleJoinGame = async (gameId: string) => {
  try {
    const response = await axiosInstance.post(`/api/games/${gameId}/join`, {
      userId: userStore.userInfo.id,
    })
    showMessage(`You have joined the game ${response.data.name}`)
    gameStore.fetchGames()
  } catch (error) {
    showMessage('Failed to join game')
    console.error(error)
  }
}

const handleStartGame = async (gameId: string) => {
  try {
    const response = await axiosInstance.post(`/api/games/${gameId}/start`)
    showMessage(response.data.message)
    gameStore.fetchGames()
  } catch (error) {
    showMessage('Failed to left the game')
    console.error(error)
  }
}
const handleLeaveGame = async (gameId: string) => {
  try {
    const response = await axiosInstance.post(`/api/games/${gameId}/leave`, {
      userId: userStore.userInfo.id,
    })
    showMessage(response.data.message)
    gameStore.fetchGames()
  } catch (error) {
    showMessage('Failed to left the game')
    console.error(error)
  } finally {
    loadingGames.value = false
  }
}

onMounted(async () => {
  gameStore.fetchGames()
})
</script>
<template>
  <div>
    <h2 class="mb-6 text-center text-3xl font-semibold">Games</h2>
    <div>
      <div v-if="loadingGames" class="text-gray-500">Loading games...</div>
      <div v-else-if="errorLoadingGames" class="text-red-500">{{ errorLoadingGames }}</div>
      <div class="grid w-full grid-cols-4 gap-2">
        <GamesList
          :games="waitingGames"
          title="WAITING"
          :userId="userStore.userInfo.id"
          @join-game="handleJoinGame"
          @start-game="handleStartGame"
          @leave-game="handleLeaveGame"
        />
        <GamesList
          :games="pausedGames"
          title="PAUSED"
          :userId="userStore.userInfo.id"
          @leave-game="handleLeaveGame"
        />
        <GamesList :games="inProgressGames" title="IN PROGRESS" :userId="userStore.userInfo.id" />
        <GamesList :games="finishedGames" title="FINISHED" :userId="userStore.userInfo.id" />
      </div>
    </div>
  </div>
</template>
