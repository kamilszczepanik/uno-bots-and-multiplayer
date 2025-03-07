import axiosInstance from '@/utils/axiosInstance'

export const fetchGames = async () => {
  try {
    const response = await axiosInstance.get('/api/games')
    return response.data
  } catch (err) {
    console.error('Failed to fetch games:', err)
    throw err
  }
}
