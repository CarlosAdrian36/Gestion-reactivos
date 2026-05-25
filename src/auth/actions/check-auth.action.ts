export const checkAuthAction = async () => {
  try {
    const localToken = localStorage.getItem('token')
    if (!localToken) {
      return
    }
  } catch (error) {}
}
