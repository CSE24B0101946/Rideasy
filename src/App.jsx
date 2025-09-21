import React, { useEffect, useMemo, useState } from 'react'
import MapView from './components/MapView.jsx'
import Planner from './components/Planner.jsx'
import RouteSelector from './components/RouteSelector.jsx'
import VehicleStatus from './components/VehicleStatus.jsx'
import UserLocation from './components/UserLocation.jsx'
import { getSocket } from './services/socket.js'
import { baseCenter, getInitialData } from './data/mockData.js'

export default function App() {
  const [routes, setRoutes] = useState([])
  const [stops, setStops] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [selectedRouteId, setSelectedRouteId] = useState(null)
  const [center, setCenter] = useState(baseCenter)
  const [plans, setPlans] = useState([])

  useEffect(() => {
    const initial = getInitialData()
    setRoutes(initial.routes)
    setStops(initial.stops)
    setVehicles(initial.vehicles)
    const socket = getSocket(initial)
    const onRoutes = (data) => setRoutes(data)
    const onStops = (data) => setStops(data)
    const onVehicleUpdate = (data) => setVehicles(data)
    socket.on('routes', onRoutes)
    socket.on('stops', onStops)
    socket.on('vehicle:update', onVehicleUpdate)
    return () => {
      socket.off('routes', onRoutes)
      socket.off('stops', onStops)
      socket.off('vehicle:update', onVehicleUpdate)
      socket.disconnect?.()
    }
  }, [])

  const selectedRoute = useMemo(() => routes.find(r => r.id === selectedRouteId) || null, [routes, selectedRouteId])
  const planRoutes = (from, to) => {
    const f = from.toLowerCase()
    const t = to.toLowerCase()
    if (!f && !t) return []
    const candidates = []
    for (const r of routes) {
      const rStops = stops.filter(s => s.routeId === r.id)
      const fromStops = rStops.filter(s => s.name.toLowerCase().includes(f))
      const toStops = rStops.filter(s => s.name.toLowerCase().includes(t))
      for (const fs of fromStops) {
        for (const ts of toStops) {
          const d = Math.abs(rStops.indexOf(fs) - rStops.indexOf(ts))
          candidates.push({ route: r, fromStop: fs, toStop: ts, hops: d })
        }
      }
    }
    candidates.sort((a, b) => a.hops - b.hops)
    return candidates
  }

  return (
    <div className="app-shell">
      <nav className="site-navbar"><div className="brand-title"><span className="brand-lane" aria-hidden="true">
        <svg className="vehicle vehicle-car" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <rect x="10" y="12" width="30" height="10" rx="2" fill="currentColor" />
          <rect x="22" y="8" width="12" height="6" rx="1" fill="currentColor" />
          <circle cx="18" cy="24" r="4" fill="#111827" />
          <circle cx="34" cy="24" r="4" fill="#111827" />
        </svg>
        <svg className="vehicle vehicle-bus" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <rect x="6" y="8" width="40" height="14" rx="2" fill="currentColor" />
          <rect x="10" y="10" width="8" height="6" fill="#065f46" />
          <rect x="20" y="10" width="8" height="6" fill="#065f46" />
          <rect x="30" y="10" width="8" height="6" fill="#065f46" />
          <circle cx="16" cy="24" r="4" fill="#111827" />
          <circle cx="32" cy="24" r="4" fill="#111827" />
        </svg>
      </span><span>Rideasy</span></div></nav>
      <header className="header-bar">
        <div className="flex-1">
          <Planner onPlan={(from, to) => {
            const res = planRoutes(from, to)
            setPlans(res)
            if (res[0]) {
              setSelectedRouteId(res[0].route.id)
              setCenter(res[0].fromStop.position)
            }
          }} />
        </div>
        <div className="w-[220px] hidden md:block">
          <RouteSelector routes={routes} value={selectedRouteId} onChange={setSelectedRouteId} />
        </div>
        <div className="flex items-center gap-2"><UserLocation onCenter={setCenter} /><span className="badge bg-blue-100 text-blue-700">Uttar Pradesh</span></div>
      </header>
      <div className="content-area">
        <div className="relative">
          <MapView
            center={center}
            routes={routes}
            stops={stops}
            vehicles={vehicles}
            selectedRoute={selectedRoute}
            onSelectRoute={(id) => setSelectedRouteId(id)}
          />
          <div className="md:hidden absolute left-3 right-3 top-3">
            <RouteSelector routes={routes} value={selectedRouteId} onChange={setSelectedRouteId} />
          </div>
        </div>
        <aside className="sidebar p-3 space-y-4">
          <div>
            <h3 className="section-title">Journey</h3>
            {plans.length ? (
              <div className="mt-2 space-y-2">
                {plans.slice(0, 3).map((p, i) => (
                  <div key={i} className="border border-gray-200 rounded-md p-2 text-sm">
                    <div className="font-medium">{p.route.name}</div>
                    <div className="text-gray-600">{p.fromStop.name} → {p.toStop.name} · {p.hops} stops</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-600">Enter From and TO, then tap Find public transport</div>
            )}
          </div>
          <div>
            <h3 className="section-title">Route details</h3>
            {selectedRoute ? (
              <div className="mt-2 space-y-1 text-sm">
                <div className="font-medium">{selectedRoute.name}</div>
                <div className="text-gray-600">{selectedRoute.description}</div>
                <div className="text-gray-600">Stops: {stops.filter(s => s.routeId === selectedRoute.id).length}</div>
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-600">Select a route to view details</div>
            )}
          </div>
          <div>
            <h3 className="section-title">Vehicles</h3>
            <VehicleStatus vehicles={vehicles} routes={routes} stops={stops} />
          </div>
        </aside>
      </div>
    </div>
  )
}
