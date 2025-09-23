import React, { useMemo } from 'react'

export default function RouteProgress({ route, stops, vehicles, selectedVehicleId = null }) {
  const orderedStops = useMemo(() => {
    if (!route || !route.path?.length) return []
    // order stops by proximity to path index
    const indexOfPoint = (pt) => route.path.findIndex(p => p.lat === pt.lat && p.lng === pt.lng)
    return [...stops].sort((a, b) => indexOfPoint(a.position) - indexOfPoint(b.position))
  }, [route, stops])

  const maxIdx = (route?.path?.length || 1) - 1
  const vehiclesOnRoute = useMemo(() => (vehicles || []).filter(v => v.routeId === route?.id), [vehicles, route])

  return (
    <div className="progress-route">
      <div className="progress-line" />
      <div className="progress-stops">
        {orderedStops.map((s, i) => {
          const pct = maxIdx === 0 ? 0 : (i / maxIdx) * 100
          return (
            <div key={s.id} className="progress-stop" style={{ left: pct + '%' }}>
              <div className="progress-dot" />
              <div className="progress-label">{s.name}</div>
            </div>
          )
        })}
      </div>
      <div className="progress-vehicles">
        {vehiclesOnRoute.map(v => {
          const idx = Math.max(0, Math.min(v.progress ?? 0, maxIdx))
          const pct = maxIdx === 0 ? 0 : (idx / maxIdx) * 100
          const cls = v.id === selectedVehicleId ? 'progress-vehicle ring-2 ring-green-400 scale-110' : 'progress-vehicle'
          return (
            <div key={v.id} className={cls} style={{ left: pct + '%' }} title={`${v.id} · ${v.routeId}`} />
          )
        })}
      </div>
    </div>
  )
}
