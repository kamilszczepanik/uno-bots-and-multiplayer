<script setup lang="ts">
import { defineProps } from 'vue'
import ControlButton from './ControlButton.vue'
import type { IndexedGame, IndexedGameSpecs } from '../../../shared/types'
import * as api from '@/model/api'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const { games } = defineProps<{
  games: Readonly<IndexedGame[]>
  title: string
}>()

const router = useRouter()
const userInfo = useUserStore().userInfo
const currentUserId = userInfo.id

const handleJoinGame = async (game: IndexedGameSpecs) => {
  await api.join(game, userInfo)
}

const handleLeaveGame = async (game: IndexedGameSpecs) => {
  await api.leave(game, userInfo)
}

const handleOpenGame = async (game: IndexedGameSpecs) => {
  router.push(`/game/${game.id}`)
}

const handleStartGame = async (game: IndexedGameSpecs) => {
  await api.start(game)
}
</script>

<template>
  <div>
    <h2 class="font-bold text-gray-600">{{ title }}</h2>
    <ul v-if="games && games.length > 0">
      <li
        v-for="game in games"
        :key="game.id"
        class="mb-4 flex w-full items-center justify-between rounded border border-border p-4 shadow"
      >
        <div class="flex w-full items-center justify-between">
          <div>
            <div class="text-lg font-bold">{{ game.name }}</div>
            <div class="text-sm text-gray-600">
              {{ game.players.length }} {{ game.players.length !== 1 ? 'Players' : 'Player' }}:
              <span class="font-bold">
                {{ game.players.map((u) => u.username).join(', ') || 'None' }}
              </span>
            </div>
            <p class="text-sm text-gray-600">
              Target score: <span class="font-bold">{{ game.targetScore }}</span>
            </p>
            <p class="text-sm text-gray-600">
              Cards per player: <span class="font-bold">{{ game.cardsPerPlayer }}</span>
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <ControlButton
              v-if="
                game.status === 'waiting' &&
                game.players.length < 4 &&
                !game.players.some((user) => user.id === currentUserId)
              "
              variant="secondary"
              @click="handleJoinGame(game)"
              class="w-32"
            >
              Join Game
            </ControlButton>
            <ControlButton
              v-if="
                game.status === 'waiting' &&
                game.players.length > 1 &&
                game.players.some((user) => user.id === currentUserId)
              "
              variant="primary"
              @click="handleStartGame(game)"
              class="w-32"
            >
              Start Game
            </ControlButton>
            <ControlButton
              v-if="
                game.players.some((user) => user.id === currentUserId) && game.status === 'waiting'
              "
              variant="cancel"
              @click="handleLeaveGame(game)"
              class="w-32"
            >
              Leave Game
            </ControlButton>
            <ControlButton
              v-if="
                game.players.some((user) => user.id === currentUserId) &&
                game.status === 'in_progress'
              "
              variant="secondary"
              @click="handleOpenGame(game)"
              class="w-32"
            >
              Open Game
            </ControlButton>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
