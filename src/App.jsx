import React, { useEffect, useMemo, useState } from 'react'
import MapView from './components/MapView.jsx'
import SearchBar from './components/SearchBar.jsx'
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
  const [query, setQuery] = useState('')
  const [center, setCenter] = useState(baseCenter)

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
  const filteredStops = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return stops
    return stops.filter(s => s.name.toLowerCase().includes(q) || s.routeName.toLowerCase().includes(q))
  }, [stops, query])

  return (
    <div className="app-shell">
      <header className="header-bar">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} placeholder="Search stops or routes" />
        </div>
        <div className="w-[220px] hidden md:block">
          <RouteSelector routes={routes} value={selectedRouteId} onChange={setSelectedRouteId} />
        </div>
        <UserLocation onCenter={setCenter} />
      </header>
      <div className="content-area">
        <div className="relative">
          <MapView
            center={center}
            routes={routes}
            stops={filteredStops}
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
