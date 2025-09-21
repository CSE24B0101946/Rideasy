import EventEmitter from 'eventemitter3'

export const baseCenter = { lat: 26.8467, lng: 80.9462 }

function offset(p, dLat, dLng) { return { lat: p.lat + dLat, lng: p.lng + dLng } }

const routeAPath = [
  offset(baseCenter, 0.020, -0.040),
  offset(baseCenter, 0.015, -0.020),
  offset(baseCenter, 0.010, -0.010),
  offset(baseCenter, 0.000, 0.000),
  offset(baseCenter, -0.010, 0.010),
  offset(baseCenter, -0.015, 0.020),
  offset(baseCenter, -0.020, 0.040),
]

const routeBPath = [
  offset(baseCenter, -0.015, -0.040),
  offset(baseCenter, -0.010, -0.020),
  offset(baseCenter, -0.005, -0.010),
  offset(baseCenter, 0.005, 0.010),
  offset(baseCenter, 0.010, 0.020),
  offset(baseCenter, 0.015, 0.040),
]

function makeStops(routeId, routeName, path) {
  const names = ['Hazratganj', 'Charbagh', 'Alambagh', 'Amausi', 'Gomti Nagar']
  return names.map((n, i) => ({
    id: `${routeId}-S${i+1}`,
    name: `${n}`,
    routeId,
    routeName,
    position: path[Math.floor((i / (names.length - 1)) * (path.length - 1))]
  }))
}

export function getInitialData() {
  const routes = [
    { id: 'R1', name: 'Lucknow Line A', description: 'Hazratganj 1 Amausi corridor', color: '#2563eb', path: routeAPath, state: 'UP' },
    { id: 'R2', name: 'Lucknow Line B', description: 'Charbagh 1 Gomti Nagar corridor', color: '#16a34a', path: routeBPath, state: 'UP' },
  ]
  const stops = [
    ...makeStops('R1', 'Lucknow Line A', routeAPath),
    ...makeStops('R2', 'Lucknow Line B', routeBPath),
  ]
  const vehicles = [
    { id: 'BUS-101', shortId: '101', routeId: 'R1', position: routeAPath[1], bearing: 45, progress: 1 },
    { id: 'BUS-102', shortId: '102', routeId: 'R1', position: routeAPath[3], bearing: 90, progress: 3 },
    { id: 'BUS-201', shortId: '201', routeId: 'R2', position: routeBPath[1], bearing: 120, progress: 1 },
  ]
  return { routes, stops, vehicles }
}

function bearingBetween(a, b) {
  const toRad = d => (d * Math.PI) / 180
  const toDeg = r => (r * 180) / Math.PI
  const y = Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.lat))
  const x = Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) - Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lng - a.lng))
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

export function startMockStream(emitter, routes, seedVehicles) {
  let vehicles = seedVehicles.map(v => ({ ...v }))
  const idxByRoute = Object.fromEntries(routes.map(r => [r.id, 0]))
  const step = () => {
    vehicles = vehicles.map(v => {
      const r = routes.find(x => x.id === v.routeId)
      if (!r) return v
      const path = r.path
      let i = (v.progress ?? idxByRoute[v.routeId] ?? 0) + 1
      if (i >= path.length) i = 0
      const a = path[i]
      const b = path[(i + 1) % path.length]
      return { ...v, position: a, bearing: bearingBetween(a, b), progress: i }
    })
    emitter.emit('vehicle:update', vehicles)
  }
  const interval = setInterval(step, 2000)
  // expose a minimal API for tests (not used elsewhere)
  emitter.stop = () => clearInterval(interval)
}
