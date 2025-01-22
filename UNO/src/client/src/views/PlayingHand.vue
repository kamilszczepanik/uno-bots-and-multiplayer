<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { shuffleBuilder } from '../../../../__test__/utils/shuffling'
import type { Props } from '../../../model/uno'
import DrawPile from '@/components/DrawPile.vue'
import DiscardPile from '@/components/DiscardPile.vue'
import UserHand from '@/components/UserHand.vue'
import GameStatus from '@/components/GameStatus.vue'
import OpponentHand from '@/components/OpponentHand.vue'
import BotService from '../../../services/BotService'

const firstShuffle = shuffleBuilder({ players: 4, cardsPerPlayer: 1 })
  .discard()
  .is({ type: 'NUMBERED', color: 'BLUE', number: 8 })
  .hand(0)
  .is({ color: 'GREEN', type: 'DRAW' })
  .hand(1)
  .is({ number: 8 })
  .hand(2)
  .is({ type: 'WILD DRAW' })
  .hand(3)
  .is({ number: 3 })
  .drawPile()
  .is({ color: 'GREEN', number: 5 })
  .build()

const gameStore = useGameStore()

onMounted(() => {
  const mockProps: Props = {
    players: ['Player One', 'Player Two', 'Player Three', 'Player Four'],
    targetScore: 500,
    randomizer: () => 3,
    shuffler: firstShuffle,
    cardsPerPlayer: 2,
  }

  gameStore.initializeGame(mockProps)
})

const players = computed(() => gameStore.gameInstance?.players || [])
const currentPlayerIndex = computed(() => gameStore.currentHand?.playerInTurn())

watch(currentPlayerIndex, (newIndex) => {
  if (newIndex !== null && newIndex !== undefined && newIndex !== 0) {
    handleBotTurn(newIndex)
  }
})

const handleBotTurn = (botIndex: number) => {
  setTimeout(() => {
    BotService.takeTurn(gameStore.gameInstance?.currentHand(), botIndex)
  }, 2000)
}
</script>
<template>
  <div class="flex h-screen w-full flex-col">
    <div class="flex w-full items-center justify-between">
      <div class="flex w-1/4 justify-start">
        <GameStatus />
      </div>
      <div class="flex w-1/2 justify-center">
        <OpponentHand v-if="players.length === 1" :placement="'top'" :opponent-index="1" />
        <OpponentHand v-else-if="players.length > 1" :placement="'top'" :opponent-index="2" />
      </div>
      <div class="w-1/4"></div>
    </div>

    <div class="flex flex-grow">
      <div class="flex w-1/4 items-center justify-center">
        <OpponentHand v-if="players.length > 1" :placement="'left'" :opponent-index="1" />
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
