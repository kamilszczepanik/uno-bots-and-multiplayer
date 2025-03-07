<script setup lang="ts">
import ControlButton from '@/components/ControlButton.vue'
import GamesList from '@/components/GamesList.vue'
import { useUserStore } from '@/stores/userStore'
import { logoutUser } from '@/utils/helpers'
import { onMounted } from 'vue'
import * as api from '@/model/api'
import { useWaitingGamesStore } from '@/stores/waitingGamesStore'
import { usePausedGamesStore } from '@/stores/pausedGamesStore'
import { useInProgressGamesStore } from '@/stores/inProgressGamesStore'
import { useFinishedGamesStore } from '@/stores/finishedGamesStore'
import CreateGameForm from '@/components/CreateGameForm.vue'

const userStore = useUserStore()
const waitingGamesStore = useWaitingGamesStore()
const pausedGamesStore = usePausedGamesStore()
const inProgressGamesStore = useInProgressGamesStore()
const finishedGamesStore = useFinishedGamesStore()

onMounted(async () => {
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
  <div class="p-2 pb-12">
    <div class="flex items-center justify-end gap-2">
      <span class="font-bold">{{ userStore.userInfo.username }}</span>
      <div>
        <ControlButton variant="cancel" @click="logoutUser" class="w-32 bg-background">
          Logout
        </ControlButton>
      </div>
    </div>
    <h1 class="text-center text-7xl">UNO</h1>
    <CreateGameForm />
    <div
      v-if="userStore.userInfo.id"
      class="grid w-full grid-cols-1 gap-2 pt-12 sm:grid-cols-2 lg:grid-cols-4"
    >
      <GamesList :games="waitingGamesStore.games" title="WAITING" />
      <GamesList :games="pausedGamesStore.games" title="PAUSED" />
      <GamesList :games="inProgressGamesStore.games" title="IN PROGRESS" />
      <GamesList :games="finishedGamesStore.games" title="FINISHED" />
    </div>
  </div>
</template>
