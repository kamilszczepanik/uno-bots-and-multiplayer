<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { shuffleBuilder } from '../../../../__test__/utils/shuffling'
import type { Props } from '../../../model/uno'
import DrawPile from '@/components/DrawPile.vue'
import DiscardPile from '@/components/DiscardPile.vue'
import UserHand from '@/components/UserHand.vue'
import GameStatus from '@/components/GameStatus.vue'
import OpponentHand from '@/components/OpponentHand.vue'

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
    cardsPerPlayer: 7,
  }

  gameStore.initializeGame(mockProps)
})
</script>

<template>
  <div class="mx-auto flex h-screen w-full flex-col items-center justify-between">
    <div class="flex w-full">
      <GameStatus />
      <OpponentHand
        class="flex flex-grow justify-center pr-96"
        :placement="'top'"
        :opponent-index="1"
      />
    </div>
    <div class="flex w-screen justify-between">
      <OpponentHand :placement="'left'" :opponent-index="2" />
      <div class="flex gap-16 pt-12">
        <DiscardPile />
        <DrawPile />
      </div>
      <OpponentHand :opponent-index="3" :placement="'right'" />
    </div>
    <UserHand />
  </div>
</template>
