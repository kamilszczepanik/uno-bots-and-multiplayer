<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { fetchUserInfo, redirectIfNotAuthenticated } from './utils/helpers'
import { useUserStore } from './stores/userStore'

const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  const userInfo = await fetchUserInfo()
  userStore.setUserInfo(userInfo)

  await redirectIfNotAuthenticated({
    router,
    message: 'You must be logged in to create or join a game',
  })
})
</script>

<template>
  <RouterView />
</template>
