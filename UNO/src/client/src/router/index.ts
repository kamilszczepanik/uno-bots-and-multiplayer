import { createRouter, createWebHistory } from 'vue-router'
import GameSetup from '../views/GameSetup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GameSetup,
    },
  ],
})

export default router
