<script setup lang="ts">
import { redirectIfNotAuthenticated } from '@/utils/helpers'
import { onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  redirectIfNotAuthenticated({ router, message: 'You must be logged in to join a game' })
})
</script>

<template>
  <div>
    <h1 class="text-center text-6xl">Join Game</h1>
    <!-- todo: list of games/rooms to join -->
    <RouterLink to="/" class="text-primary-700">Go back to dashboard</RouterLink>
  </div>
</template>
