import React, { useMemo } from 'react'
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api'

const containerClass = 'map-container'

export default function MapView({ center, routes, stops, vehicles, selectedRoute, onSelectRoute }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  })

  const mapOptions = useMemo(() => ({
    clickableIcons: false,
    disableDefaultUI: true,
    zoomControl: true,
  }), [])

  if (!isLoaded) return <div className="w-full h-full flex items-center justify-center text-gray-500">Loading map…</div>

  return (
    <GoogleMap
      center={center}
      zoom={13}
      options={mapOptions}
      mapContainerClassName={containerClass}
    >
      {selectedRoute && (
        <Polyline
          path={selectedRoute.path}
          options={{ strokeColor: selectedRoute.color, strokeOpacity: 0.9, strokeWeight: 4 }}
        />
      )}

      {stops.filter(s => !selectedRoute || s.routeId === selectedRoute.id).map(stop => (
        <Marker key={stop.id} position={stop.position} label={{ text: 'S', color: '#ffffff' }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: '#2563eb',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }}
          onClick={() => onSelectRoute?.(stop.routeId)}
        />
      ))}

      {vehicles.filter(v => !selectedRoute || v.routeId === selectedRoute.id).map(v => (
        <Marker key={v.id} position={v.position} label={{ text: v.shortId, color: '#ffffff' }}
          icon={{
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 4,
            fillColor: '#16a34a',
            fillOpacity: 1,
            strokeColor: '#065f46',
            strokeWeight: 1,
            rotation: v.bearing || 0,
          }}
        />
      ))}
    </GoogleMap>
  )
}
