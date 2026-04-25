'use client'
import { useState } from 'react'
import {
  Box, Button, Card, CardContent, Chip, Container, CircularProgress,
  TextField, Typography, AppBar, Toolbar, Link, Divider
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import SearchIcon from '@mui/icons-material/Search'
import LocationCityIcon from '@mui/icons-material/LocationCity'

export default function Home() {
  const [input, setInput] = useState('')
  const [files, setFiles] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!input.trim() && files.length === 0) return
    setLoading(true)
    setResults([])

    const formData = new FormData()
    formData.append('userInput', input)
    for (const file of files) {
      formData.append('files', file)
    }

    const res = await fetch('/api/match', { method: 'POST', body: formData })
    const data = await res.json()
    setResults(data.matches)
    setLoading(false)
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>

      <Box sx={{ backgroundColor: '#000000', py: 0.5, px: 3 }}>
        <Typography variant="caption" sx={{ color: '#ffffff', fontSize: 11 }}>
          An unofficial NYC resource finder powered by AI
        </Typography>
      </Box>

      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#ffffff', borderBottom: '3px solid #003087' }}>
        <Toolbar sx={{ gap: 1 }}>
          <LocationCityIcon sx={{ color: '#003087', fontSize: 32 }} />
          <Box>
            <Typography variant="h6" sx={{ color: '#003087', fontWeight: 900, lineHeight: 1.1, fontSize: 20 }}>
              ResourceNYC
            </Typography>
            <Typography variant="caption" sx={{ color: '#555', fontSize: 11 }}>
              Find benefits & programs for New Yorkers
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ backgroundColor: '#003087', py: 5, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 900, mb: 1 }}>
            Find what you need
          </Typography>
          <Typography variant="h6" sx={{ color: '#ccd9f0', fontWeight: 400 }}>
            Describe your situation — we'll match you to NYC programs that can help.
          </Typography>
          <Typography variant="body2" sx={{ color: '#99b3d9', mt: 1 }}>
            Write in any language · Escribe en cualquier idioma · 用任何语言写 · اكتب بأي لغة
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 5 }}>

        <Card elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 5, mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5, color: '#003087' }}>
              Describe your situation
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={5}
              placeholder="e.g. I'm a single mom in the Bronx, I lost my job and need help with food and healthcare for my kids..."
              value={input}
              onChange={e => setInput(e.target.value)}
              variant="outlined"
              sx={{
                mb: 3,
                backgroundColor: '#fafafa',
                '& .MuiOutlinedInput-root': { borderRadius: 4 }
              }}
            />

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle2" sx={{ mb: 1, color: '#333' }}>
              Upload documents <Typography component="span" variant="caption" color="text.secondary">(optional) — pay stubs, denial letters, leases, images</Typography>
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{ borderRadius: 8, borderColor: '#003087', color: '#003087', mb: 2 }}
            >
              Choose Files
              <input
                type="file"
                multiple
                accept=".pdf,image/*"
                hidden
                onChange={e => setFiles(Array.from(e.target.files))}
              />
            </Button>
            {files.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {files.map((f, i) => (
                  <Chip key={i} label={f.name} size="small" icon={<UploadFileIcon />} sx={{ backgroundColor: '#e8eef7', borderRadius: 8 }} />
                ))}
              </Box>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              sx={{ borderRadius: 8, py: 1.5, backgroundColor: '#003087', fontSize: 16, fontWeight: 'bold', mt: 1 }}
            >
              {loading ? 'Finding resources...' : 'Find Resources'}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="#003087">
                {results.length} programs found for you
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>
            {results.map((r, i) => (
              <Card key={i} elevation={0} sx={{ border: '1px solid #ddd', borderLeft: '4px solid #003087', borderRadius: 5, mb: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold" color="#003087">{r.name}</Typography>
                    <Chip label={r.category} size="small" sx={{ backgroundColor: '#e8eef7', color: '#003087', fontWeight: 'bold', borderRadius: 8 }} />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#333' }}>
                    <strong>Why this helps you:</strong> {r.why_it_matches}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: '#333' }}>
                    <strong>How to apply:</strong> {r.how_to_apply}
                  </Typography>
                  {r.url && (
                    <Link href={r.url} target="_blank" underline="hover" sx={{ color: '#003087', fontWeight: 'bold', fontSize: 14 }}>
                      Apply here →
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      <Box sx={{ backgroundColor: '#003087', py: 3, mt: 6 }}>
        <Container maxWidth="md">
          <Typography variant="body2" sx={{ color: '#ccd9f0', textAlign: 'center' }}>
            ResourceNYC · Built for HunterHacks 2026 · Data from NYC Open Data
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}