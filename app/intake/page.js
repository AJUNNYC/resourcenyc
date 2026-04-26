'use client'
import { useState } from 'react'
import {
  Box, Typography, Card, CardContent, Chip,
  Button, CircularProgress, Divider,
} from '@mui/material'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import SearchIcon from '@mui/icons-material/Search'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import HomeIcon from '@mui/icons-material/Home'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'
import { SideNav } from '@/components/SideNav'

const CATEGORY_ICON_MAP = {
  Food: FastfoodIcon, Health: LocalHospitalIcon, Housing: HomeIcon,
  Nutrition: ChildCareIcon, Childcare: SchoolIcon, Utilities: ElectricBoltIcon,
  Financial: AttachMoneyIcon, Employment: WorkIcon,
}
const CATEGORY_COLOR_MAP = {
  Food: '#E85D04', Health: '#0077B6', Housing: '#7B2FBE',
  Nutrition: '#C0006A', Childcare: '#B45309', Utilities: '#1D4ED8',
  Financial: '#047857', Employment: '#4338CA',
}
const CATEGORY_BG_MAP = {
  Food: '#FFF4EE', Health: '#EEF7FC', Housing: '#F5EEFF',
  Nutrition: '#FFF0F7', Childcare: '#FFFBEB', Utilities: '#EFF6FF',
  Financial: '#ECFDF5', Employment: '#EEF2FF',
}

function ResultCard({ r, index }) {
  const Icon = CATEGORY_ICON_MAP[r.category] || WorkIcon
  const color = CATEGORY_COLOR_MAP[r.category] || '#003087'
  const bg = CATEGORY_BG_MAP[r.category] || '#E8EEF7'

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #E8ECEF',
        borderRadius: '14px',
        backgroundColor: '#fff',
        mb: 2,
        transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease',
        '@keyframes cardIn': {
          from: { opacity: 0, transform: 'translateY(14px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        animation: 'cardIn 0.35s ease both',
        animationDelay: `${index * 55}ms`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 16px 40px -8px ${color}22, 0 4px 12px rgba(0,0,0,0.06)`,
          borderColor: `${color}44`,
        },
        '&:hover .result-icon': {
          '@keyframes iconFloat': {
            '0%': { transform: 'scale(1) translateY(0)' },
            '40%': { transform: 'scale(1.16) translateY(-5px)' },
            '70%': { transform: 'scale(1.06) translateY(-2px)' },
            '100%': { transform: 'scale(1) translateY(0)' },
          },
          animation: 'iconFloat 0.55s cubic-bezier(0.34,1.56,0.64,1)',
        },
      }}
    >
      <CardContent sx={{ p: '20px 22px' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 1.5 }}>
          <Box
            className="result-icon"
            sx={{
              width: 44,
              height: 44,
              borderRadius: '11px',
              backgroundColor: bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon sx={{ color, fontSize: 23 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 15.5, fontWeight: 700, color: '#0F172A', lineHeight: 1.2, mb: 0.25 }}>
              {r.name}
            </Typography>
            {r.category && (
              <Chip
                label={r.category}
                size="small"
                sx={{
                  backgroundColor: bg,
                  color,
                  fontWeight: 700,
                  fontSize: 10.5,
                  height: 20,
                  borderRadius: '6px',
                }}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ mb: 1.25 }}>
          <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: '#003087', letterSpacing: 0.4, mb: 0.5 }}>
            WHY THIS HELPS YOU
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: '#374151', lineHeight: 1.7 }}>
            {r.why_it_matches}
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            p: 1.5,
            mb: 1.75,
          }}
        >
          <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: '#475569', letterSpacing: 0.4, mb: 0.4 }}>
            HOW TO APPLY
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: '#475569', lineHeight: 1.65 }}>
            {r.how_to_apply}
          </Typography>
        </Box>

        {r.url && (
          <Button
            href={r.url}
            target="_blank"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
            sx={{
              backgroundColor: color,
              color: '#fff',
              fontWeight: 700,
              fontSize: 13,
              textTransform: 'none',
              borderRadius: '9px',
              px: 2,
              py: 0.7,
              boxShadow: 'none',
              '&:hover': { backgroundColor: color, filter: 'brightness(0.87)', boxShadow: 'none' },
            }}
          >
            Apply now
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default function Intake() {
  const [input, setInput] = useState('')
  const [files, setFiles] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [charCount, setCharCount] = useState(0)

  async function handleSubmit() {
    if (!input.trim() && files.length === 0) return
    setLoading(true)
    setResults([])
    setApiError('')

    try {
      const formData = new FormData()
      formData.append('userInput', input)
      for (const file of files) formData.append('files', file)

      const res = await fetch('/api/match', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok || data.error) {
        setApiError(data.error || 'Something went wrong. Please try again.')
      } else {
        setResults(data.matches || [])
        if ((data.matches || []).length === 0) setApiError('No programs found. Try describing your situation in more detail.')
      }
    } catch {
      setApiError('Could not reach the server. Check your connection and try again.')
    }

    setLoading(false)
  }

  function removeFile(i) {
    setFiles(f => f.filter((_, idx) => idx !== i))
  }

  function handleTextChange(e) {
    setInput(e.target.value)
    setCharCount(e.target.value.length)
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex' }}>

      <SideNav />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>

      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(160deg, #00112B 0%, #001F52 45%, #003087 100%)',
          pt: 5.5,
          pb: 5,
          px: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -80, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,120,255,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -100, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,47,190,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Box sx={{ maxWidth: 680, mx: 'auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '99px',
              px: 1.75,
              py: 0.6,
              mb: 2.5,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 14, color: '#93C5FD' }} />
            <Typography sx={{ fontSize: 12.5, color: '#93C5FD', fontWeight: 600 }}>
              AI-powered · Works in any language
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: { xs: 26, md: 34 },
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.15,
              letterSpacing: -0.75,
              mb: 1,
            }}
          >
            Describe your situation
          </Typography>
          <Typography sx={{ fontSize: 15, color: '#7FA8D4', lineHeight: 1.65 }}>
            Write in your own words — any language. We'll read it and match you to every NYC program you qualify for.
          </Typography>
        </Box>
      </Box>

      {/* Form */}
      <Box sx={{ flex: 1, maxWidth: 760, width: '100%', mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>

        <Card
          elevation={0}
          sx={{
            border: '1px solid #E8ECEF',
            borderRadius: '18px',
            backgroundColor: '#fff',
            mb: 3,
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>

            {/* Text area */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#003087', letterSpacing: 0.3, mb: 1.25 }}>
                TELL US WHAT'S GOING ON
              </Typography>
              <Box
                sx={{
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '12px',
                  backgroundColor: '#FAFAFA',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  '&:focus-within': {
                    borderColor: '#003087',
                    boxShadow: '0 0 0 3px rgba(0,48,135,0.09)',
                    backgroundColor: '#fff',
                  },
                }}
              >
                <Box
                  component="textarea"
                  value={input}
                  onChange={handleTextChange}
                  placeholder={"e.g. I'm a single mom in the Bronx with two kids. I just lost my job at the restaurant and we don't have enough food for this week. We also don't have health insurance and my daughter needs to see a doctor..."}
                  rows={7}
                  sx={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    resize: 'vertical',
                    fontSize: 14.5,
                    color: '#111827',
                    lineHeight: 1.75,
                    p: 2,
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    '&::placeholder': { color: '#9CA3AF' },
                    minHeight: 160,
                  }}
                />
                <Box
                  sx={{
                    px: 2,
                    pb: 1.25,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: 11.5, color: '#94A3B8' }}>
                    English · Español · 中文 · বাংলা · العربية · Русский
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: charCount > 50 ? '#059669' : '#94A3B8' }}>
                    {charCount > 0 ? `${charCount} characters` : 'Any length is fine'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* File upload */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#475569', letterSpacing: 0.3, mb: 0.5 }}>
                UPLOAD DOCUMENTS{' '}
                <Typography component="span" sx={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, letterSpacing: 0, textTransform: 'none' }}>
                  optional — pay stubs, denial letters, leases, ID, images
                </Typography>
              </Typography>

              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon sx={{ fontSize: 18 }} />}
                sx={{
                  mt: 1.25,
                  borderColor: '#E5E7EB',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: 13.5,
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 2,
                  py: 0.9,
                  borderStyle: 'dashed',
                  '&:hover': {
                    borderColor: '#003087',
                    backgroundColor: '#EEF4FF',
                    borderStyle: 'dashed',
                  },
                }}
              >
                Choose files
                <input
                  type="file"
                  multiple
                  accept=".pdf,image/*"
                  hidden
                  onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files)])}
                />
              </Button>

              {files.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.75 }}>
                  {files.map((f, i) => (
                    <Chip
                      key={i}
                      label={f.name}
                      size="small"
                      onDelete={() => removeFile(i)}
                      deleteIcon={<CloseIcon sx={{ fontSize: 13 }} />}
                      icon={<UploadFileIcon sx={{ fontSize: 14 }} />}
                      sx={{
                        backgroundColor: '#EEF4FF',
                        color: '#003087',
                        fontWeight: 600,
                        fontSize: 12,
                        borderRadius: '8px',
                        border: '1px solid #BFDBFE',
                        '& .MuiChip-deleteIcon': { color: '#93C5FD', '&:hover': { color: '#003087' } },
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Submit */}
            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={loading || (!input.trim() && files.length === 0)}
              startIcon={
                loading
                  ? <CircularProgress size={18} sx={{ color: 'rgba(255,255,255,0.8)' }} />
                  : <SearchIcon sx={{ fontSize: 20 }} />
              }
              sx={{
                background: loading || (!input.trim() && files.length === 0)
                  ? '#CBD5E1'
                  : 'linear-gradient(135deg, #003087, #0055CC)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 15.5,
                textTransform: 'none',
                borderRadius: '12px',
                py: 1.4,
                boxShadow: loading || (!input.trim() && files.length === 0) ? 'none' : '0 4px 20px rgba(0,48,135,0.28)',
                transition: 'filter 0.15s, transform 0.15s, box-shadow 0.15s',
                '&:hover': (!loading && (input.trim() || files.length > 0)) ? {
                  filter: 'brightness(1.1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 28px rgba(0,48,135,0.36)',
                  background: 'linear-gradient(135deg, #003087, #0055CC)',
                } : {},
                '&:active': { transform: 'translateY(0)' },
                '&.Mui-disabled': { color: '#fff' },
              }}
            >
              {loading ? 'Finding your programs…' : 'Find programs that match my situation'}
            </Button>

          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Box
            sx={{
              '@keyframes resultsIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
              animation: 'resultsIn 0.3s ease',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  backgroundColor: '#ECFDF5',
                  borderRadius: '99px',
                  px: 1.5,
                  py: 0.6,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 15, color: '#059669' }} />
                <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#059669' }}>
                  {results.length} programs found for you
                </Typography>
              </Box>
              <Divider sx={{ flex: 1 }} />
            </Box>

            {results.map((r, i) => (
              <ResultCard key={i} r={r} index={i} />
            ))}
          </Box>
        )}

        {/* Error state */}
        {!loading && apiError && (
          <Box
            sx={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '12px',
              px: 2.5, py: 2, mt: 1,
            }}
          >
            <Typography sx={{ fontSize: 14, color: '#991B1B' }}>{apiError}</Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #00112B, #003087)',
          py: 3,
          px: 4,
          mt: 4,
        }}
      >
        <Box sx={{ maxWidth: 1280, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 24, height: 24, borderRadius: '6px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LocationCityIcon sx={{ color: '#fff', fontSize: 14 }} />
            </Box>
            <Typography sx={{ fontSize: 13, color: '#7FA8D4', fontWeight: 600 }}>
              ResourceNYC · HunterHacks 2026 · Data from NYC Open Data
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 12, color: '#4A6FA0' }}>
            Not official government advice · Verify eligibility directly with each program
          </Typography>
        </Box>
      </Box>

      </Box>
    </Box>
  )
}
