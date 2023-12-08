const {VITE_API_URL} = import.meta.env

export const getGenres = async () => {
  const response = await fetch(`${VITE_API_URL}genres`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const genresData = await response.json()
  return genresData  
}