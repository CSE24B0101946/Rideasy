export const baseCenter = { lat: 26.8467, lng: 80.9462 }

function makeNamedStops(routeId, routeName, names, path) {
  return names.map((n, i) => ({
    id: `${routeId}-S${i + 1}`,
    name: n,
    routeId,
    routeName,
    position: path[Math.min(i, path.length - 1)],
  }))
}

// Lucknow demo lines (kept)
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

// City coords
const MORADABAD = { lat: 28.8389, lng: 78.7768 }
const AMROHA = { lat: 28.9036, lng: 78.4698 }
const GARHMUK = { lat: 28.7983, lng: 78.1 }
const HAPUR = { lat: 28.7437, lng: 77.763 }
const GHAZIABAD = { lat: 28.6692, lng: 77.4538 }

const MEERUT = { lat: 28.9845, lng: 77.7064 }
const MODINAGAR = { lat: 28.8300, lng: 77.5815 }
const MURADNAGAR = { lat: 28.7725, lng: 77.4980 }
const SAHIBABAD = { lat: 28.6716, lng: 77.3695 }

const BULANDSHAHR = { lat: 28.4069, lng: 77.8498 }
const SIKANDRABAD = { lat: 28.4425, lng: 77.6989 }
const DADRI = { lat: 28.5535, lng: 77.5537 }

// Paths for corridors
const path_MBD_GZB = [MORADABAD, AMROHA, GARHMUK, HAPUR, GHAZIABAD]
const path_GZB_MBD = [...path_MBD_GZB].reverse()

const path_MRT_GZB = [MEERUT, MODINAGAR, MURADNAGAR, SAHIBABAD, GHAZIABAD]
const path_GZB_MRT = [...path_MRT_GZB].reverse()

const path_BSR_GZB = [BULANDSHAHR, SIKANDRABAD, DADRI, GHAZIABAD]
const path_GZB_BSR = [...path_BSR_GZB].reverse()

export function getInitialData() {
  const routes = [
    { id: 'R1', name: 'Lucknow Line A', description: 'Hazratganj – Amausi corridor', color: '#2563eb', path: routeAPath, state: 'UP' },
    { id: 'R2', name: 'Lucknow Line B', description: 'Charbagh – Gomti Nagar corridor', color: '#16a34a', path: routeBPath, state: 'UP' },

    { id: 'R3', name: 'Moradabad – Ghaziabad', description: 'Via Amroha · Garhmukteshwar · Hapur', color: '#f59e0b', path: path_MBD_GZB, state: 'UP' },
    { id: 'R4', name: 'Ghaziabad – Moradabad', description: 'Via Hapur · Garhmukteshwar · Amroha', color: '#f97316', path: path_GZB_MBD, state: 'UP' },

    { id: 'R5', name: 'Meerut – Ghaziabad', description: 'Via Modinagar · Muradnagar · Sahibabad', color: '#8b5cf6', path: path_MRT_GZB, state: 'UP' },
    { id: 'R6', name: 'Ghaziabad – Meerut', description: 'Via Sahibabad · Muradnagar · Modinagar', color: '#7c3aed', path: path_GZB_MRT, state: 'UP' },

    { id: 'R7', name: 'Bulandshahr – Ghaziabad', description: 'Via Sikandrabad · Dadri', color: '#ef4444', path: path_BSR_GZB, state: 'UP' },
    { id: 'R8', name: 'Ghaziabad – Bulandshahr', description: 'Via Dadri · Sikandrabad', color: '#dc2626', path: path_GZB_BSR, state: 'UP' },
  ]

  const stops = [
    // Lucknow lines (generic stop names for demo)
    ...makeNamedStops('R1', 'Lucknow Line A', ['Hazratganj', 'Charbagh', 'Alambagh', 'Amausi', 'Gomti Nagar'], routeAPath),
    ...makeNamedStops('R2', 'Lucknow Line B', ['Hazratganj', 'Charbagh', 'Alambagh', 'Amausi', 'Gomti Nagar'], routeBPath),

    ...makeNamedStops('R3', 'Moradabad – Ghaziabad', ['Moradabad', 'Amroha', 'Garhmukteshwar', 'Hapur', 'Ghaziabad'], path_MBD_GZB),
    ...makeNamedStops('R4', 'Ghaziabad – Moradabad', ['Ghaziabad', 'Hapur', 'Garhmukteshwar', 'Amroha', 'Moradabad'], path_GZB_MBD),

    ...makeNamedStops('R5', 'Meerut – Ghaziabad', ['Meerut', 'Modinagar', 'Muradnagar', 'Sahibabad', 'Ghaziabad'], path_MRT_GZB),
    ...makeNamedStops('R6', 'Ghaziabad – Meerut', ['Ghaziabad', 'Sahibabad', 'Muradnagar', 'Modinagar', 'Meerut'], path_GZB_MRT),

    ...makeNamedStops('R7', 'Bulandshahr – Ghaziabad', ['Bulandshahr', 'Sikandrabad', 'Dadri', 'Ghaziabad'], path_BSR_GZB),
    ...makeNamedStops('R8', 'Ghaziabad – Bulandshahr', ['Ghaziabad', 'Dadri', 'Sikandrabad', 'Bulandshahr'], path_GZB_BSR),
  ]

  const OP = 'Uttar pradesh parivhen'
  const vehicles = [
    { id: 'BUS-101', shortId: '101', routeId: 'R1', position: routeAPath[1], bearing: 45, progress: 1, operator: OP },
    { id: 'BUS-102', shortId: '102', routeId: 'R1', position: routeAPath[3], bearing: 90, progress: 3, operator: OP },
    { id: 'BUS-201', shortId: '201', routeId: 'R2', position: routeBPath[1], bearing: 120, progress: 1, operator: OP },

    { id: 'BUS-301', shortId: '301', routeId: 'R3', position: path_MBD_GZB[0], bearing: 90, progress: 0, operator: OP },
    { id: 'BUS-302', shortId: '302', routeId: 'R3', position: path_MBD_GZB[2], bearing: 90, progress: 2, operator: OP },
    { id: 'BUS-401', shortId: '401', routeId: 'R4', position: path_GZB_MBD[1], bearing: 90, progress: 1, operator: OP },

    { id: 'BUS-501', shortId: '501', routeId: 'R5', position: path_MRT_GZB[1], bearing: 90, progress: 1, operator: OP },
    { id: 'BUS-502', shortId: '502', routeId: 'R5', position: path_MRT_GZB[3], bearing: 90, progress: 3, operator: OP },
    { id: 'BUS-601', shortId: '601', routeId: 'R6', position: path_GZB_MRT[0], bearing: 90, progress: 0, operator: OP },

    { id: 'BUS-701', shortId: '701', routeId: 'R7', position: path_BSR_GZB[0], bearing: 90, progress: 0, operator: OP },
    { id: 'BUS-702', shortId: '702', routeId: 'R7', position: path_BSR_GZB[2], bearing: 90, progress: 2, operator: OP },
    { id: 'BUS-801', shortId: '801', routeId: 'R8', position: path_GZB_BSR[1], bearing: 90, progress: 1, operator: OP },
  ]
  return { routes, stops, vehicles }
}

function bearingBetween(a, b) {
  const toRad = (d) => (d * Math.PI) / 180
  const toDeg = (r) => (r * 180) / Math.PI
  const y = Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.lat))
  const x =
    Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
    Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lng - a.lng))
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

export function startMockStream(emitter, routes, seedVehicles) {
  let vehicles = seedVehicles.map((v) => ({ ...v }))
  const idxByRoute = Object.fromEntries(routes.map((r) => [r.id, 0]))
  const step = () => {
    vehicles = vehicles.map((v) => {
      const r = routes.find((x) => x.id === v.routeId)
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
