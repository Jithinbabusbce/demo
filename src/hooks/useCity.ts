import { useState } from 'react'

function useCity(defaultCity = 'Bangalore'): [string, (city: string) => void] {
  const [city, setCity] = useState(() => {
    const saved = localStorage.getItem('gullyworld-city')
    return saved || defaultCity
  })

  function updateCity(newCity: string) {
    const trimmed = newCity.trim()
    if (!trimmed) return
    setCity(trimmed)
    localStorage.setItem('gullyworld-city', trimmed)
  }

  return [city, updateCity]
}

export default useCity
