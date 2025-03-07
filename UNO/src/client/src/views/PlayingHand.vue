<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { shuffleBuilder } from '../../../../__test__/utils/shuffling'
import type { Props } from '../../../model/uno'
import { standardRandomizer } from '../../../utils/random_utils'
import DrawPile from '@/components/DrawPile.vue'
import DiscardPile from '@/components/DiscardPile.vue'
import UserHand from '@/components/UserHand.vue'
import GameStatus from '@/components/GameStatus.vue'

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
const discardPile = computed(() => gameStore.currentHand?.discardPile())
const drawPile = computed(() => gameStore.currentHand?.drawPile())
const userHand = computed(() => gameStore.currentHand?.playerHand(0))

onMounted(() => {
  const mockProps: Props = {
    players: ['Player One', 'Player Two', 'Player Three', 'Player Four'],
    targetScore: 500,
    randomizer: standardRandomizer,
    shuffler: firstShuffle,
    cardsPerPlayer: 7,
  }

  gameStore.initializeGame(mockProps)
})
</script>

<template>
  <div class="mx-auto flex h-screen w-full flex-col items-center justify-between p-2">
    <div class="flex w-full">
      <GameStatus />
      <div class="flex flex-grow justify-center">Second player</div>
    </div>
    <div class="flex gap-16">
      <DiscardPile :discardPile="discardPile" />
      <DrawPile :drawPile="drawPile" />
    </div>
    <UserHand :userHand="userHand" />
  </div>
</template>
