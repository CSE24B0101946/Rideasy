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
  return d // meters
}

function etaMinutes(vehicle, stops, speedMps = 8.33) { // ~30 km/h
  const routeStops = stops.filter(s => s.routeId === vehicle.routeId)
  if (!routeStops.length) return null
  // next stop heuristic: closest ahead; fallback closest
  let next = null
  let best = Infinity
  for (const s of routeStops) {
    const d = haversine(vehicle.position, s.position)
    if (d < best) { best = d; next = s }
  }
  if (!next) return null
  const minutes = Math.round((best / speedMps) / 60)
  return { stop: next, minutes }
}

export default function VehicleStatus({ vehicles, routes, stops }) {
  const enriched = useMemo(() => vehicles.map(v => {
    const r = routes.find(x => x.id === v.routeId)
    const eta = etaMinutes(v, stops)
    const operator = v.operator || 'Uttar pradesh parivhen'
    return { ...v, routeName: r?.name || '—', eta, operator }
  }), [vehicles, routes, stops])

  return (
    <ul className="divide-y divide-gray-100">
      {enriched.map(v => (
        <li key={v.id} className="py-2 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">{v.id}</div>
            <div className="text-xs text-gray-600">{v.routeName}</div>
            <div className="text-[10px] text-gray-500">{v.operator}</div>
          </div>
          <div className="text-right">
            {v.eta ? (
              <div className="badge bg-green-100 text-green-700">ETA {v.eta.minutes} min to {v.eta.stop.name}</div>
            ) : (
              <div className="badge bg-gray-100 text-gray-700">ETA —</div>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
