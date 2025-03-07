import { defineStore } from 'pinia'
import type { User } from '../../../shared/types'
import { reactive, ref } from 'vue'

export const useUserStore = defineStore('ongoing games', () => {
  const userInfo = reactive<User>({
    id: null,
    username: null,
  })
  const isAuthenticated = ref(false)

  const setUserInfo = (userData: User | null) => {
    if (userData) {
      userInfo.id = userData.id
      userInfo.username = userData.username
      isAuthenticated.value = true
    } else {
      userInfo.id = null
      userInfo.username = null
      isAuthenticated.value = false
    }
  }

  return { userInfo, isAuthenticated, setUserInfo }
})
