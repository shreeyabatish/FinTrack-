import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h1 style={{ fontSize: 48 }}>404</h1>
      <p>This page doesn't exist.</p>
      <Link to="/dashboard" className="btn" style={{ display: 'inline-block', marginTop: 15 }}>
        Back to dashboard
      </Link>
    </div>
  )
}
