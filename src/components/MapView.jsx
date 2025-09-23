import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet'

const containerClass = 'map-container'

function MapController({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.setView(center)
  }, [center, map])
  return null
}

export default function MapView({ center, routes, stops, vehicles, selectedRoute, selectedVehicleId = null, onSelectRoute, onSelectVehicle }) {
  return (
    <MapContainer center={center} zoom={13} className={containerClass} preferCanvas={true}>
      <MapController center={center} />
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selectedRoute && (
        <Polyline positions={selectedRoute.path} pathOptions={{ color: selectedRoute.color, weight: 4, opacity: 0.9 }} />
      )}

      {stops.filter(s => !selectedRoute || s.routeId === selectedRoute.id).map(stop => (
        <CircleMarker
          key={stop.id}
          center={stop.position}
          radius={6}
          pathOptions={{ color: '#ffffff', weight: 2, fillColor: '#2563eb', fillOpacity: 1 }}
          eventHandlers={{ click: () => onSelectRoute?.(stop.routeId) }}
        >
          <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent={false}>{stop.name}</Tooltip>
        </CircleMarker>
      ))}

      {vehicles.filter(v => !selectedRoute || v.routeId === selectedRoute.id).map(v => {
        const selected = v.id === selectedVehicleId
        return (
          <CircleMarker
            key={v.id}
            center={v.position}
            radius={selected ? 10 : 8}
            pathOptions={{ color: selected ? '#1f2937' : '#065f46', weight: selected ? 2 : 1, fillColor: selected ? '#22c55e' : '#16a34a', fillOpacity: 1 }}
            eventHandlers={{ click: () => onSelectVehicle?.(v.id) }}
          >
            <Tooltip direction="right" offset={[8, 0]} opacity={1} permanent={false}>{v.shortId}</Tooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
