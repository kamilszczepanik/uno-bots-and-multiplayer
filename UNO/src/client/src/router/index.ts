import { createRouter, createWebHistory } from 'vue-router'
import GameSetup from '../views/GameSetup.vue'
import PlayingHand from '@/views/PlayingHand.vue'
import GameOver from '@/views/GameOver.vue'
import HandOver from '@/views/HandOver.vue'

const routes = [
  {
    path: '/',
    name: 'Game Setup',
    component: GameSetup,
  },
  { path: '/hand', name: 'Playing Hand', component: PlayingHand },
  { path: '/hand-over', name: 'Hand Over', component: HandOver },
  { path: '/game-over', name: 'Game Over', component: GameOver },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
