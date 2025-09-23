import React, { useMemo } from 'react'

function haversine(a, b) {
  const R = 6371e3
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const x = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) ** 2
  const d = 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1-x))
  return d
}

export default function BusTracker({ vehicleId, vehicles, routes, stops }) {
  const vehicle = vehicles.find(v => v.id === vehicleId)
  const route = routes.find(r => r.id === vehicle?.routeId)
  const routeStops = useMemo(() => stops.filter(s => s.routeId === route?.id), [stops, route])

  const next = useMemo(() => {
    if (!vehicle || !route) return null
    let best = { s: null, d: Infinity }
    for (const s of routeStops) {
      const d = haversine(vehicle.position, s.position)
      if (d < best.d) best = { s, d }
    }
    if (!best.s) return null
    const minutes = Math.round((best.d / 8.33) / 60) // ~30km/h
    return { stop: best.s, minutes }
  }, [vehicle, route, routeStops])

  const status = useMemo(() => {
    if (!vehicle?.updatedAt) return { label: 'On time', color: 'bg-green-100 text-green-700' }
    const lag = Date.now() - vehicle.updatedAt
    if (lag < 6000) return { label: 'On time', color: 'bg-green-100 text-green-700' }
    if (lag < 12000) return { label: 'Slight delay', color: 'bg-yellow-100 text-yellow-700' }
    return { label: 'Delayed', color: 'bg-red-100 text-red-700' }
  }, [vehicle])

  if (!vehicle) return null

  return (
    <div className="border border-gray-200 rounded-md p-3 text-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium">{vehicle.id}</div>
        <div className={`badge ${status.color}`}>{status.label}</div>
      </div>
      <div className="text-gray-600">Operator: {vehicle.operator || 'UPSRTC'}</div>
      {next && (
        <div className="text-gray-700">Next: {next.stop.name} · ETA {next.minutes} min</div>
      )}
    </div>
  )
}
