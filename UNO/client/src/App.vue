<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted } from 'vue'
import { fetchUserInfo, redirectIfNotAuthenticated } from './utils/helpers'
import { useUserStore } from './stores/userStore'
import { useWaitingGamesStore } from './stores/waitingGamesStore'
import { usePausedGamesStore } from './stores/pausedGamesStore'
import { useInProgressGamesStore } from './stores/inProgressGamesStore'
import { useFinishedGamesStore } from './stores/finishedGamesStore'
import * as api from './model/api'
import GamesList from './components/GamesList.vue'

const router = useRouter()
const userStore = useUserStore()
const waitingGamesStore = useWaitingGamesStore()
const pausedGamesStore = usePausedGamesStore()
const inProgressGamesStore = useInProgressGamesStore()
const finishedGamesStore = useFinishedGamesStore()

const waitingGames = computed(() => waitingGamesStore.games)
const pausedGames = computed(() => pausedGamesStore.games)
const inProgressGames = computed(() => inProgressGamesStore.games)
const finishedGames = computed(() => finishedGamesStore.games)

onMounted(async () => {
  const userInfo = await fetchUserInfo()
  userStore.setUserInfo(userInfo)

  await redirectIfNotAuthenticated({
    router,
    message: 'You must be logged in to create or join a game',
  })

  const ws = new WebSocket('ws://localhost:9090/publish')
  ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe' }))
  ws.onmessage = ({ data: gameJSON }) => {
    const game = JSON.parse(gameJSON)
    console.log(game)

    waitingGamesStore.remove(game)
    pausedGamesStore.remove(game)
    inProgressGamesStore.remove(game)
    switch (game.status) {
      case 'waiting':
        waitingGamesStore.upsert(game)
        break
      case 'paused':
        pausedGamesStore.upsert(game)
        break
      case 'in_progress':
        inProgressGamesStore.upsert(game)
        break
      case 'finished':
        finishedGamesStore.upsert(game)
        break
      default:
        console.error(`Unexpected status: ${game.status}`)
    }
  }
  onUnmounted(() => {
    ws.send(JSON.stringify({ type: 'unsubscribe' }))
    ws.close()
  })

  const allGames = await api.games()
  const waitingGames = allGames.filter((game) => game.status === 'waiting')
  waitingGames.forEach((game) => waitingGamesStore.upsert(game))

  const pausedGames = allGames.filter((game) => game.status === 'paused')
  pausedGames.forEach((game) => pausedGamesStore.upsert(game))

  const inProgressGames = allGames.filter((game) => game.status === 'in_progress')
  inProgressGames.forEach((game) => inProgressGamesStore.upsert(game))

  const finishedGames = allGames.filter((game) => game.status === 'finished')
  finishedGames.forEach((game) => finishedGamesStore.upsert(game))
})
</script>

<template>
  <RouterView />
  <div>
    <div v-if="userStore.userInfo.id" class="grid w-full grid-cols-4 gap-2">
      <GamesList :games="waitingGames" title="WAITING" />
      <GamesList :games="pausedGames" title="PAUSED" />
      <GamesList :games="inProgressGames" title="IN PROGRESS" />
      <GamesList :games="finishedGames" title="FINISHED" />
    </div>
  </div>
</template>
