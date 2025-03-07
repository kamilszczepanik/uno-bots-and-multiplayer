<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import DrawPile from '@/components/DrawPile.vue'
import DiscardPile from '@/components/DiscardPile.vue'
import UserHand from '@/components/UserHand.vue'
import GameStatus from '@/components/GameStatus.vue'
import OpponentHand from '@/components/OpponentHand.vue'
import BotService, { DELAY_TO_MAKE_MOVE_MS } from '../../../services/BotService'
import { useRouter } from 'vue-router'
import { showMessage } from '@/utils/helpers'
import { USER_INDEX } from '@/utils/constants'

const gameStore = useGameStore()
const router = useRouter()
const players = computed(() => gameStore.game?.players || [])
const currentHand = computed(() => gameStore.game?.currentHand())
const currentPlayerIndex = computed(() => currentHand.value?.playerInTurn())

watch(currentPlayerIndex, (newIndex) => {
  if (newIndex !== null && newIndex !== undefined && newIndex !== 0) {
    handleBotTurn(newIndex)
  }
})

const handleBotTurn = (botIndex: number) => {
  setTimeout(() => {
    BotService.takeTurn(gameStore.game?.currentHand(), botIndex)
  }, DELAY_TO_MAKE_MOVE_MS)
}

onMounted(() => {
  if (currentPlayerIndex.value && currentPlayerIndex.value !== USER_INDEX) {
    handleBotTurn(currentPlayerIndex.value)
  }
  if (!currentHand.value) {
    router.push('/').then(() => {
      showMessage('Provide details in the form to create a game.')
    })
  } else {
    currentHand.value.onEnd(() => {
      router.push('/hand-over')
    })
  }
})
</script>
<template>
  <div class="flex h-screen w-full flex-col">
    <div class="flex w-full items-center justify-between">
      <div class="flex w-1/4 justify-start">
        <GameStatus />
      </div>
      <div class="flex w-1/2 justify-center">
        <OpponentHand v-if="players.length === 2" :placement="'top'" :opponent-index="1" />
        <OpponentHand v-else-if="players.length > 2" :placement="'top'" :opponent-index="2" />
      </div>
      <div class="w-1/4"></div>
    </div>

    <div class="flex flex-grow">
      <div class="flex w-1/4 items-center justify-center">
        <OpponentHand v-if="players.length > 2" :placement="'left'" :opponent-index="1" />
      </div>

      <div class="flex w-1/2 flex-col items-center justify-center">
        <div class="flex gap-12">
          <DiscardPile />
          <DrawPile />
        </div>
      </div>

      <div class="flex w-1/4 items-center justify-center">
        <OpponentHand v-if="players.length > 3" :placement="'right'" :opponent-index="3" />
      </div>
    </div>

    <div class="flex justify-center">
      <UserHand />
    </div>
  </div>
</template>
