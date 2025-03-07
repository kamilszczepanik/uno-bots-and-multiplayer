import { type Router } from 'vue-router'
import { toast } from 'vue3-toastify'

export const showMessage = (message: string) => {
  toast(message, {
    style: {
      background: 'var(--color-background)',
    },
  })
}

export function handleGameAction(
  action: () => void,
  options?: { successMessage?: string; errorMessage?: string },
) {
  try {
    action()
    if (options?.successMessage) {
      showMessage(options.successMessage)
    }
  } catch (error) {
    if (error instanceof Error) {
      showMessage(options?.errorMessage || error.message)
    } else {
      showMessage(options?.errorMessage || 'An unknown error occurred.')
    }
  }
}

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken')
  return !!token
}

export const redirectIfNotAuthenticated = ({
  router,
  redirectPath = '/login',
  message,
}: {
  router: Router
  redirectPath?: string
  message?: string
}): void => {
  if (!isAuthenticated()) {
    router.push(redirectPath).then(() => {
      if (message) {
        showMessage(message)
      }
    })
  }
}
