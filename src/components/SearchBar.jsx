import React from 'react'

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      className="input-field"
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label="Search stops and routes"
    />
  )
}
