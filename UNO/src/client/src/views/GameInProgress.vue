<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import DrawPile from '@/components/DrawPile.vue'
import DiscardPile from '@/components/DiscardPile.vue'
import UserHand from '@/components/UserHand.vue'
import GameStatus from '@/components/GameStatus.vue'
import OpponentHand from '@/components/OpponentHand.vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/utils/axiosInstance'

const route = useRoute()
const gameId = route.params.id as string
const router = useRouter()
const game = ref(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchGame = async () => {
  try {
    loading.value = true
    game.value = await axiosInstance.get(`/api/games/${gameId}`)
    if (!game.value) {
      throw new Error('Game not found')
    }
  } catch (err) {
    error.value = 'Failed to load game'
    console.error(err)
    router.push('/')
  } finally {
    loading.value = false
  }

  console.log(game.value)
}

onMounted(() => {
  fetchGame()
})
</script>
<template>
  <div class="flex h-screen w-full flex-col">
    <div class="flex w-full items-center justify-between">
      <div class="flex w-1/4 justify-start">
        <GameStatus />
      </div>
      <div class="flex w-1/2 justify-center">
        <!-- <OpponentHand v-if="players.length === 2" :placement="'top'" :opponent-index="1" /> -->
        <!-- <OpponentHand v-else-if="players.length > 2" :placement="'top'" :opponent-index="2" /> -->
      </div>
      <div class="w-1/4"></div>
    </div>

    <div class="flex flex-grow">
      <div class="flex w-1/4 items-center justify-center">
        <!-- <OpponentHand v-if="players.length > 2" :placement="'left'" :opponent-index="1" /> -->
      </div>

      <div class="flex w-1/2 flex-col items-center justify-center">
        <div class="flex gap-12">
          <DiscardPile />
          <DrawPile />
        </div>
      </div>

      <div class="flex w-1/4 items-center justify-center">
        <!-- <OpponentHand v-if="players.length > 3" :placement="'right'" :opponent-index="3" /> -->
      </div>
    </div>

    <div class="flex justify-center">
      <UserHand />
    </div>
  </div>
</template>
