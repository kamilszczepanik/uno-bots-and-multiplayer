import { createRouter, createWebHistory } from 'vue-router'
import GameSetup from '../views/GameSetup.vue'
import PlayingHand from '@/views/PlayingHand.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: GameSetup,
  },
  { path: '/hand', component: PlayingHand },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
