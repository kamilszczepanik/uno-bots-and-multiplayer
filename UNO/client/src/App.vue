<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
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

  allGames
    .filter((game) => game.status === 'waiting')
    .forEach((game) => waitingGamesStore.upsert(game))

  allGames
    .filter((game) => game.status === 'paused')
    .forEach((game) => pausedGamesStore.upsert(game))

  allGames
    .filter((game) => game.status === 'in_progress')
    .forEach((game) => inProgressGamesStore.upsert(game))

  allGames
    .filter((game) => game.status === 'finished')
    .forEach((game) => finishedGamesStore.upsert(game))
})
</script>

<template>
  <RouterView />
  <div>
    <div
      v-if="userStore.userInfo.id"
      class="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4"
    >
      <GamesList :games="waitingGamesStore.games" title="WAITING" />
      <GamesList :games="pausedGamesStore.games" title="PAUSED" />
      <GamesList :games="inProgressGamesStore.games" title="IN PROGRESS" />
      <GamesList :games="finishedGamesStore.games" title="FINISHED" />
    </div>
  </div>
</template>
