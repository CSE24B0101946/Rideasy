import { io } from 'socket.io-client'
import EventEmitter from 'eventemitter3'
import { startMockStream } from '../data/mockData.js'

export function getSocket(initialData) {
  const url = import.meta.env.VITE_SOCKET_URL
  if (url) {
    const socket = io(url, { transports: ['websocket'] })
    const api = new EventEmitter()
    socket.on('connect', () => {
      socket.emit('hello')
    })
    socket.on('routes', (d) => api.emit('routes', d))
    socket.on('stops', (d) => api.emit('stops', d))
    socket.on('vehicle:update', (d) => api.emit('vehicle:update', d))
    api.on = api.on.bind(api)
    api.off = api.off.bind(api)
    api.disconnect = () => socket.close()
    return api
  }

  const emitter = new EventEmitter()
  // seed
  setTimeout(() => {
    emitter.emit('routes', initialData.routes)
    emitter.emit('stops', initialData.stops)
    emitter.emit('vehicle:update', initialData.vehicles)
  }, 0)
  // start mock movement
  startMockStream(emitter, initialData.routes, initialData.vehicles)
  return emitter
}
