<script setup lang="ts">
import { computed, defineProps } from 'vue'
import GameCard from './GameCard.vue'
import { useGameStore } from '@/stores/gameStore'
import PlayerInfo from './PlayerInfo.vue'

const { opponentIndex, placement } = defineProps({
  opponentIndex: {
    type: Number,
    required: true,
  },
  placement: {
    type: String as () => 'top' | 'left' | 'right',
    required: true,
  },
})

const gameStore = useGameStore()

const opponentHand = computed(
  () => gameStore.gameInstance?.currentHand()?.playerHand(opponentIndex) ?? [],
)

const rotation = computed(() => {
  switch (placement) {
    case 'top':
      return 'rotate-0'
    case 'left':
      return 'rotate-90'
    case 'right':
      return '-rotate-90'
    default:
      return ''
  }
})

const spacing = computed(() => {
  if (!opponentHand.value) {
    return 0
  }

  const defaultSpacing = 200
  const tightSpacing = 100
  const cardCount = opponentHand.value.length
  const maxSpacing = placement === 'top' ? defaultSpacing : tightSpacing

  return Math.min(100, maxSpacing / cardCount)
})
</script>

<template>
  <div
    v-if="opponentHand.length > 0"
    :class="`flex ${placement !== 'top' ? 'flex-col' : 'flex-row'} items-center`"
  >
    <PlayerInfo :playerIndex="opponentIndex" />

    <div
      :class="`relative flex ${rotation} ${placement === 'top' ? 'h-32' : 'w-56'} px-6`"
      :style="{
        height: placement !== 'top' ? `${Math.max(200, opponentHand.length * 20)}px` : '',
      }"
    >
      <div
        v-for="(card, index) in opponentHand"
        :key="index"
        :class="`absolute`"
        :style="{
          transform: `translateX(${index * spacing}px)`,
        }"
      >
        <GameCard :showBack="true" />
      </div>
    </div>
  </div>
  <div v-else></div>
</template>
