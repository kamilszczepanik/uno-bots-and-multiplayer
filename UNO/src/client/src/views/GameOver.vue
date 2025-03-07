<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { showMessage } from '@/utils/helpers'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const gameStore = useGameStore()
const router = useRouter()

onMounted(() => {
  if (!gameStore.currentHand) {
    router.push('/').then(() => {
      showMessage('Provide details in the form to create a game.')
    })
  }
})
</script>
<template><div></div></template>
