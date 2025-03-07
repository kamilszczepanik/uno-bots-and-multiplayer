import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      id: null as number | null,
      username: null as string | null,
    },
    isAuthenticated: false,
  }),

  actions: {
    setUserInfo(userInfo: { id: number; username: string } | null) {
      if (userInfo) {
        this.userInfo.id = userInfo.id
        this.userInfo.username = userInfo.username
        this.isAuthenticated = true
      } else {
        this.userInfo.id = null
        this.userInfo.username = null
        this.isAuthenticated = false
      }
    },
  },
})
