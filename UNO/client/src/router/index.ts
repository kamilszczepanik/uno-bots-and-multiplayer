import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GameInProgress from '@/views/GameInProgress.vue'
import GameOver from '@/views/GameOver.vue'
import HandOver from '@/views/HandOver.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const routes = [
  {
    path: '/',
    name: 'Game Setup',
    component: HomeView,
  },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/game/:id', name: 'Game In Progress', component: GameInProgress, props: true },
  { path: '/hand-over', name: 'Hand Over', component: HandOver },
  { path: '/game-over', name: 'Game Over', component: GameOver },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
