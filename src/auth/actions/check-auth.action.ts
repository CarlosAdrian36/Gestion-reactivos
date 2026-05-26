interface checkError {
  ok: false
}

interface checkSuccess {
  ok: true
}

export const checkAuthAction = async () => {
  try {
    const localToken = localStorage.getItem('token')
    if (!localToken || localToken.length < 10) {
      return
    }
  } catch (error) {}
}
