import React from 'react'

export default function UserLocation({ onCenter }) {
  const centerOnUser = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords
      onCenter({ lat: latitude, lng: longitude })
    })
  }
  return (
    <button className="action-button" onClick={centerOnUser} aria-label="Center on my location">
      My location
    </button>
  )
}
