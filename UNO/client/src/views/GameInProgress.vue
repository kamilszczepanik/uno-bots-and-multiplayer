<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInProgressGamesStore } from '@/stores/inProgressGamesStore'
import { useUserStore } from '@/stores/userStore'
import GameStatus from '@/components/GameStatus.vue'

const inProgressGamesStore = useInProgressGamesStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)
const game = computed(() => inProgressGamesStore.game(id.value as string))

// const enabled = computed(
//   () =>
//     game.value !== undefined &&
//     userStore.userInfo.id === game.value.players[game.value.playerInTurn],
// )
// const finished = computed(() => game.value === undefined || is_finished(game.value))
// const standings = computed(() => {
//   if (game.value === undefined) return []
//   const g = game.value
//   const standings: [string, number][] = scores(g).map((s, i) => [g.players[i], s])
//   standings.sort(([_, score1], [__, score2]) => score2 - score1)
//   return standings
// })

if (userStore.userInfo.id === undefined) router.push(`/login?game=${id.value}`)
else if (game.value === undefined) router.replace('/')
</script>
<template>
  <div class="flex h-screen w-full flex-col" v-if="game && userStore.userInfo.id">
    <div class="flex w-full items-center justify-between">
      <div class="flex w-1/4 justify-start">
        <GameStatus :game="game" />
      </div>
    </div>
    <!--
      <div class="flex w-1/2 justify-center">
        <OpponentHand v-if="currentGame.players.length === 2" :placement="'top'" :opponent-id="2" />
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
    </div> -->
  </div>
</template>
