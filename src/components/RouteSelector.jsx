import React from 'react'

export default function RouteSelector({ routes, value, onChange }) {
  return (
    <select className="select-field" value={value ?? ''} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">All routes</option>
      {routes.map(r => (
        <option key={r.id} value={r.id}>{r.name}</option>
      ))}
    </select>
  )
}
