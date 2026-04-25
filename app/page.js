'use client'
import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!input.trim()) return
    setLoading(true)
    setResults([])
    const res = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput: input })
    })
    const data = await res.json()
    setResults(data.matches)
    setLoading(false)
  }

  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>🗽 ResourceNYC</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Describe your situation in any language. We'll find the NYC programs that can help you.
      </p>

      <textarea
        rows={5}
        style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #ccc', boxSizing: 'border-box' }}
        placeholder="e.g. I'm a single mom in the Bronx, I lost my job and need help with food and healthcare for my kids..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: 12, padding: '12px 24px', fontSize: 16, backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}
      >
        {loading ? 'Finding resources...' : 'Find Resources'}
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: 32 }}>
          {results.map((r, i) => (
            <div key={i} style={{ border: '1px solid #eee', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: 20, marginBottom: 4 }}>{r.name}</h2>
              <span style={{ fontSize: 12, backgroundColor: '#f0f0f0', padding: '2px 8px', borderRadius: 4 }}>{r.category}</span>
              <p style={{ marginTop: 12, color: '#444' }}><strong>Why this helps you:</strong> {r.why_it_matches}</p>
              <p style={{ color: '#444' }}><strong>How to apply:</strong> {r.how_to_apply}</p>
              {r.url && (
                <a href={r.url} target="_blank" style={{ color: '#0070f3' }}>Apply here →</a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}