<script setup lang="ts">
import { defineProps } from 'vue'
import ControlButton from './ControlButton.vue'

interface User {
  id: number
  username: string
}

interface Game {
  id: string
  name: string
  status: string
  targetScore: number
  cardsPerPlayer: number
  users: User[]
}

defineProps<{
  games: Game[]
  title: string
  userId: number | null
  onJoinGame?: (gameId: string) => void
  onStartGame?: (gameId: string) => void
  onLeaveGame?: (gameId: string) => void
  onOpenGame?: (gameId: string) => void
}>()
</script>

<template>
  <div v-if="games.length > 0">
    <h2 class="font-bold text-gray-600">{{ title }}</h2>
    <ul>
      <li
        v-for="game in games"
        :key="game.id"
        class="mb-4 flex w-full items-center justify-between rounded border border-border p-4 shadow"
      >
        <div class="flex w-full items-center justify-between">
          <div>
            <div class="text-lg font-bold">{{ game.name }}</div>
            <div class="text-sm text-gray-600">
              {{ game.users.length }} {{ game.users.length !== 1 ? 'Players' : 'Player' }}:
              <span class="font-bold">
                {{ game.users.map((u) => u.username).join(', ') || 'None' }}
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
                game.users.length < 4 &&
                !game.users.some((user) => user.id === userId)
              "
              variant="secondary"
              @click="() => onJoinGame && onJoinGame(game.id)"
              class="w-32"
            >
              Join Game
            </ControlButton>
            <ControlButton
              v-if="
                game.status === 'waiting' &&
                game.users.length > 1 &&
                game.users.some((user) => user.id === userId)
              "
              variant="primary"
              @click="onStartGame?.(game.id)"
              class="w-32"
            >
              Start Game
            </ControlButton>
            <ControlButton
              v-if="game.users.some((user) => user.id === userId) && game.status === 'waiting'"
              variant="cancel"
              @click="onLeaveGame?.(game.id)"
              class="w-32"
            >
              Leave Game
            </ControlButton>
            <ControlButton
              v-if="game.users.some((user) => user.id === userId) && game.status === 'in progress'"
              variant="secondary"
              @click="onOpenGame?.(game.id)"
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
