<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInProgressGamesStore } from '@/stores/inProgressGamesStore'
import { useUserStore } from '@/stores/userStore'
import GameStatus from '@/components/GameStatus.vue'
import UserHand from '@/components/UserHand.vue'
import OpponentHand from '@/components/OpponentHand.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const inProgressGamesStore = useInProgressGamesStore()
const userId = computed(() => userStore.userInfo.id)
const id = computed(() => route.params.id)
const game = computed(() => inProgressGamesStore.game(id.value as string))
const currentHand = computed(() => game.value?.hands[game.value.currentRound - 1])
const opponents = computed(() => {
  return game.value?.players.filter((player) => player.id !== userId.value) || []
})

onMounted(async () => {
  if (userStore.userInfo.id === undefined) {
    router.push(`/login?game=${id.value}`)
    return
  }
})
</script>
<template>
  <div class="flex h-screen w-full flex-col" v-if="game && currentHand && userStore.userInfo.id">
    <div class="flex w-full items-center justify-between">
      <div class="flex w-1/4 justify-start">
        <GameStatus :game="game" />
      </div>
    </div>

    <div class="flex w-1/2 justify-center">
      <OpponentHand
        v-if="opponents.length === 1 && opponents[0].id"
        :placement="'top'"
        :opponent-id="opponents[0].id"
      />
      <OpponentHand
        v-else-if="opponents.length > 1 && opponents[1].id"
        :placement="'top'"
        :opponent-id="opponents[1].id"
      />
    </div>
    <div class="w-1/4"></div>

    <div class="flex flex-grow">
      <div class="flex w-1/4 items-center justify-center">
        <OpponentHand
          v-if="opponents.length > 1 && opponents[0].id"
          :placement="'left'"
          :opponent-id="opponents[0].id"
        />
      </div>

      <div class="flex w-1/2 flex-col items-center justify-center">
        <div class="flex gap-12">
          <DiscardPile />
          <DrawPile />
        </div>
      </div>

      <div class="flex w-1/4 items-center justify-center">
        <OpponentHand
          v-if="opponents.length > 2 && opponents[2].id"
          :placement="'right'"
          :opponent-id="opponents[2].id"
        />
      </div>
    </div>

    <div class="flex justify-center">
      <UserHand :game="game" :user-id="userStore.userInfo.id" />
    </div>
  </div>
</template>
