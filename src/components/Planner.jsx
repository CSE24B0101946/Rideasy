import React, { useState } from 'react'

export default function Planner({ onPlan, defaultFrom = '', defaultTo = '' }) {
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)

  const submit = (e) => {
    e?.preventDefault?.()
    onPlan?.(from.trim(), to.trim())
  }

  return (
    <form onSubmit={submit} className="flex w-full items-center gap-2">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          className="input-field"
          type="text"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          aria-label="From stop or location"
        />
        <input
          className="input-field"
          type="text"
          placeholder="TO"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          aria-label="To stop or location"
        />
      </div>
      <button type="submit" className="action-button whitespace-nowrap">Find public transport</button>
    </form>
  )
}
