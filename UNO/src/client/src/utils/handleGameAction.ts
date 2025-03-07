const showError = (message: string) => {
  alert(message)
}

export function handleGameAction(action: () => void) {
  try {
    action()
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError('An unknown error occurred.')
    }
  }
}
