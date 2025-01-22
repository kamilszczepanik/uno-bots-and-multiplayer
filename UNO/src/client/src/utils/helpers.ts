import { toast } from 'vue3-toastify'

export const showMessage = (message: string) => {
  toast(message)
}

export function handleGameAction(action: () => void) {
  try {
    action()
  } catch (error) {
    if (error instanceof Error) {
      showMessage(error.message)
    } else {
      showMessage('An unknown error occurred.')
    }
  }
}
