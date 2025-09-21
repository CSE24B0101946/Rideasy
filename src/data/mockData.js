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

// Moradabad -> Amroha -> Garhmukteshwar -> Hapur -> Ghaziabad
const routeMGPath = [
  { lat: 28.8389, lng: 78.7768 }, // Moradabad
  { lat: 28.9036, lng: 78.4698 }, // Amroha
  { lat: 28.7983, lng: 78.1000 }, // Garhmukteshwar
  { lat: 28.7437, lng: 77.7630 }, // Hapur
  { lat: 28.6692, lng: 77.4538 }, // Ghaziabad
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

function makeNamedStops(routeId, routeName, names, path) {
  return names.map((n, i) => ({
    id: `${routeId}-S${i+1}`,
    name: n,
    routeId,
    routeName,
    position: path[Math.min(i, path.length - 1)]
  }))
}

export function getInitialData() {
  const routes = [
    { id: 'R1', name: 'Lucknow Line A', description: 'Hazratganj – Amausi corridor', color: '#2563eb', path: routeAPath, state: 'UP' },
    { id: 'R2', name: 'Lucknow Line B', description: 'Charbagh – Gomti Nagar corridor', color: '#16a34a', path: routeBPath, state: 'UP' },
    { id: 'R3', name: 'Moradabad – Ghaziabad', description: 'Intercity corridor via Amroha, Garhmukteshwar, Hapur', color: '#f59e0b', path: routeMGPath, state: 'UP' },
  ]
  const stops = [
    ...makeStops('R1', 'Lucknow Line A', routeAPath),
    ...makeStops('R2', 'Lucknow Line B', routeBPath),
    ...makeNamedStops('R3', 'Moradabad – Ghaziabad', ['Moradabad', 'Amroha', 'Garhmukteshwar', 'Hapur', 'Ghaziabad'], routeMGPath),
  ]
  const vehicles = [
    { id: 'BUS-101', shortId: '101', routeId: 'R1', position: routeAPath[1], bearing: 45, progress: 1 },
    { id: 'BUS-102', shortId: '102', routeId: 'R1', position: routeAPath[3], bearing: 90, progress: 3 },
    { id: 'BUS-201', shortId: '201', routeId: 'R2', position: routeBPath[1], bearing: 120, progress: 1 },
    { id: 'BUS-301', shortId: '301', routeId: 'R3', position: routeMGPath[0], bearing: 90, progress: 0 },
    { id: 'BUS-302', shortId: '302', routeId: 'R3', position: routeMGPath[2], bearing: 90, progress: 2 },
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
  emitter.stop = () => clearInterval(interval)
}
