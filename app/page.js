'use client'
import { useState, useEffect, useRef } from 'react'
import {
  Box, Typography, Chip, Button,
  IconButton, InputBase, CircularProgress,
} from '@mui/material'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import StarIcon from '@mui/icons-material/Star'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SendIcon from '@mui/icons-material/Send'
import RefreshIcon from '@mui/icons-material/Refresh'
import PersonIcon from '@mui/icons-material/Person'
import Link from 'next/link'
import { SideNav } from '@/components/SideNav'
import { ProgramCard } from '@/components/ProgramCard'
import { ProfilePanel } from '@/components/ProfilePanel'
import { StatsRow } from '@/components/StatsRow'
import { useAuth } from '@/components/AuthProvider'
import {
  PLACEHOLDER_CYCLE, MOCK_PROGRAMS, QUICK_CHIPS,
} from '@/lib/constants'
import {
  parseMonthlySavings, mapToCard, buildProfileDisplay, generateWhySummary,
} from '@/lib/utils'

// ─── Main page ─────────────────────────────────────────────────

export default function Home() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [apiResults, setApiResults] = useState([])
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [inputFocused, setInputFocused] = useState(false)
  const inputRef = useRef(null)

  const [storedProfile, setStoredProfile] = useState(null)
  const [storedPrograms, setStoredPrograms] = useState([])

  // Load profile + programs from localStorage
  useEffect(() => {
    try {
      const p = localStorage.getItem('resourcenyc_profile')
      const progs = localStorage.getItem('resourcenyc_programs')
      if (p) setStoredProfile(JSON.parse(p))
      if (progs) setStoredPrograms(JSON.parse(progs))
    } catch { /* ignore parse errors */ }
  }, [])

  // Cycle placeholder text
  useEffect(() => {
    if (inputFocused || query) return
    const id = setInterval(() => setPlaceholderIdx(i => (i + 1) % PLACEHOLDER_CYCLE.length), 3800)
    return () => clearInterval(id)
  }, [inputFocused, query])

  async function handleSearch() {
    if (!query.trim()) return
    setSearching(true)
    setApiResults([])
    try {
      const fd = new FormData()
      fd.append('userInput', query)
      const res = await fetch('/api/match', { method: 'POST', body: fd })
      const data = await res.json()
      setApiResults(
        (data.matches || []).map((r, i) =>
          mapToCard({ ...r, summary: r.why_it_matches, nextStep: r.how_to_apply }, i)
        )
      )
    } catch { /* silently fall back */ }
    setSearching(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch() }
  }

  // Derive display data
  const hasRealData = storedPrograms.length > 0
  const basePrograms = hasRealData
    ? storedPrograms.map((p, i) => mapToCard(p, i))
    : MOCK_PROGRAMS
  const displayedPrograms = apiResults.length > 0 ? apiResults : basePrograms
  const isCustomSearch = apiResults.length > 0

  const profileDisplay = storedProfile ? buildProfileDisplay(storedProfile) : null
  const displayName = storedProfile
    ? `${storedProfile.firstName || ''} ${storedProfile.lastName || ''}`.trim() || null
    : user?.user_metadata?.first_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
      : (user?.email ? user.email.split('@')[0] : null)
  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : 'NY'

  // Dynamic stats
  const totalMonthly = basePrograms.reduce((sum, p) => sum + parseMonthlySavings(p.savings), 0)
  const urgentCount = basePrograms.filter(p =>
    ['Urgent', 'High Priority', 'Time-Sensitive'].includes(p.badge)
  ).length
  const avgEligibility = basePrograms.length > 0
    ? Math.round(basePrograms.reduce((sum, p) => sum + (p.eligibility || 85), 0) / basePrograms.length)
    : 94

  const STATS = [
    { label: 'Programs Matched',  value: String(basePrograms.length),                               Icon: StarIcon,        color: '#003087', bg: '#E8EEF7' },
    { label: 'Est. Monthly Value', value: totalMonthly > 0 ? `$${totalMonthly.toLocaleString()}+` : '$2,100+', Icon: AttachMoneyIcon, color: '#047857', bg: '#ECFDF5' },
    { label: 'Urgent Actions',     value: String(urgentCount),                                       Icon: WarningAmberIcon,color: '#B45309', bg: '#FFFBEB' },
    { label: 'Profile Match',      value: `${avgEligibility}%`,                                      Icon: TrendingUpIcon,  color: '#7B2FBE', bg: '#F5EEFF' },
  ]

  const urgentProgramNames = basePrograms
    .filter(p => ['Urgent', 'High Priority'].includes(p.badge))
    .slice(0, 2)
    .map(p => p.name)

  const whySummary = storedProfile
    ? generateWhySummary(storedProfile)
    : 'Matched by income below the federal poverty line, single-parent status, recent job loss, and location in a high food-insecurity neighborhood.'

  const urgentCallout = urgentProgramNames.length > 0
    ? `${urgentProgramNames.join(' and ')} have the highest immediate impact — apply before anything else.`
    : 'Check the high-priority programs first for immediate impact.'

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex' }}>

      <SideNav />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>

        {/* ── Search hero ── */}
        <Box
          sx={{
            background: 'linear-gradient(160deg, #00112B 0%, #001F52 45%, #003087 100%)',
            pt: 5, pb: 4.5, px: 3,
            position: 'relative', overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', top: -80, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,120,255,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', bottom: -100, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,47,190,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <Box sx={{ maxWidth: 720, mx: 'auto', position: 'relative', zIndex: 1 }}>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Box
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.6,
                  backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: '99px', px: 1.5, py: 0.5,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 13, color: '#4ADE80' }} />
                <Typography sx={{ fontSize: 12, color: '#A8C4E0', fontWeight: 600 }}>
                  {displayName
                    ? `Welcome back, ${displayName} — ${basePrograms.length} programs matched`
                    : `${basePrograms.length} programs matched for your profile`}
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: -0.5, mb: 0.75 }}>
              What do you need help with today?
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#7FA8D4', mb: 3, lineHeight: 1.5 }}>
              Describe your situation in plain language — English, Spanish, or any language — and we'll find the right NYC programs for you.
            </Typography>

            {/* Search bar */}
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                backgroundColor: '#fff', borderRadius: '14px', px: 2, py: 1.25, mb: 2,
                boxShadow: inputFocused
                  ? '0 0 0 3px rgba(0,80,200,0.22), 0 8px 40px rgba(0,0,0,0.2)'
                  : '0 4px 32px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              <AutoAwesomeIcon
                sx={{
                  color: '#003087', fontSize: 20, flexShrink: 0,
                  '@keyframes sparkle': {
                    '0%,100%': { opacity: 1, transform: 'scale(1) rotate(0deg)' },
                    '50%':     { opacity: 0.7, transform: 'scale(1.2) rotate(20deg)' },
                  },
                  animation: 'sparkle 3s ease-in-out infinite',
                }}
              />
              <InputBase
                inputRef={inputRef} fullWidth value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={PLACEHOLDER_CYCLE[placeholderIdx]}
                sx={{
                  fontSize: 14.5, color: '#0F172A',
                  '& ::placeholder': { color: '#94A3B8', opacity: 1, transition: 'opacity 0.4s' },
                  '& input': { py: 0.25 },
                }}
              />
              {query && (
                <IconButton
                  size="small"
                  onClick={() => { setQuery(''); setApiResults([]) }}
                  sx={{ color: '#CBD5E1', mr: -0.5, '&:hover': { color: '#64748B' } }}
                >
                  <RefreshIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
              <Box
                onClick={handleSearch}
                sx={{
                  width: 36, height: 36, borderRadius: '10px',
                  background: 'linear-gradient(135deg, #003087, #0055CC)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, cursor: 'pointer',
                  transition: 'transform 0.15s, filter 0.15s',
                  '&:hover': { transform: 'scale(1.08)', filter: 'brightness(1.15)' },
                  '&:active': { transform: 'scale(0.95)' },
                }}
              >
                {searching
                  ? <CircularProgress size={16} sx={{ color: '#fff' }} />
                  : <SendIcon sx={{ color: '#fff', fontSize: 17 }} />}
              </Box>
            </Box>

            {/* Quick chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {QUICK_CHIPS.map(chip => (
                <Chip
                  key={chip} label={chip} size="small"
                  onClick={() => { setQuery(chip); inputRef.current?.focus() }}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)',
                    color: '#C8DEFF', fontSize: 12, fontWeight: 500, borderRadius: '8px', cursor: 'pointer',
                    transition: 'background-color 0.15s, border-color 0.15s',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.28)' },
                    '& .MuiChip-label': { px: 1.25, py: 0.6 },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── Dashboard body ── */}
        <Box sx={{ flex: 1, px: { xs: 2, md: 4 }, py: 4, maxWidth: 1280, width: '100%', mx: 'auto' }}>

          {/* Complete profile banner (logged in, no real data) */}
          {user && !hasRealData && (
            <Box
              sx={{
                mb: 3, p: 2, borderRadius: '14px',
                background: 'linear-gradient(135deg, #001F52, #003087)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2,
                '@keyframes bannerIn': {
                  from: { opacity: 0, transform: 'translateY(-8px)' },
                  to:   { opacity: 1, transform: 'translateY(0)' },
                },
                animation: 'bannerIn 0.4s ease',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PersonIcon sx={{ color: '#7FA8D4', fontSize: 22, flexShrink: 0 }} />
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                    Set up your profile to get personalized program matches
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: '#7FA8D4' }}>
                    Takes about 3 minutes — we'll find programs tailored to your exact situation.
                  </Typography>
                </Box>
              </Box>
              <Button
                component={Link}
                href="/onboarding"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
                sx={{
                  backgroundColor: '#fff', color: '#003087', fontWeight: 700, fontSize: 13,
                  textTransform: 'none', borderRadius: '10px', px: 2.5, py: 0.85, flexShrink: 0,
                  '&:hover': { backgroundColor: '#EEF4FF', transform: 'translateY(-1px)', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' },
                  transition: 'all 0.15s ease',
                }}
              >
                Complete profile
              </Button>
            </Box>
          )}

          {/* Stats row */}
          <StatsRow stats={STATS} />

          {/* Main grid: profile panel (left) + programs (right) */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: 3, alignItems: 'start' }}>

            <ProfilePanel
              displayName={displayName}
              initials={initials}
              profileDisplay={profileDisplay}
              avgEligibility={avgEligibility}
              matchCount={basePrograms.length}
              whySummary={whySummary}
              urgentCallout={urgentCallout}
              hasRealData={hasRealData}
            />

            {/* Programs grid */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, gap: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: -0.3 }}>
                    {isCustomSearch
                      ? 'Programs found for your search'
                      : hasRealData
                        ? `Recommended for ${displayName || 'you'}`
                        : 'Recommended for Maria'}
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: '#94A3B8' }}>
                    {displayedPrograms.length} matches ·{' '}
                    {isCustomSearch
                      ? 'based on your search'
                      : hasRealData
                        ? 'personalized to your profile'
                        : 'sample profile — complete yours to see yours'}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }} />
                {isCustomSearch && (
                  <Box
                    onClick={() => { setApiResults([]); setQuery('') }}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 0.5,
                      cursor: 'pointer', opacity: 0.7,
                      transition: 'opacity 0.15s', '&:hover': { opacity: 1 },
                    }}
                  >
                    <RefreshIcon sx={{ fontSize: 15, color: '#64748B' }} />
                    <Typography sx={{ fontSize: 12.5, color: '#64748B', fontWeight: 600 }}>
                      Back to profile
                    </Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 0.6,
                    backgroundColor: '#ECFDF5', borderRadius: '8px', px: 1.25, py: 0.5,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 13, color: '#059669' }} />
                  <Typography sx={{ fontSize: 11.5, color: '#059669', fontWeight: 700 }}>
                    Verified NYC programs
                  </Typography>
                </Box>
              </Box>

              {searching && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, gap: 2 }}>
                  <CircularProgress size={32} sx={{ color: '#003087' }} />
                  <Typography sx={{ fontSize: 14, color: '#94A3B8' }}>
                    Finding programs that match your situation…
                  </Typography>
                </Box>
              )}

              {!searching && (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  {displayedPrograms.map((program, i) => (
                    <ProgramCard key={program.id ?? i} program={program} index={i} />
                  ))}
                </Box>
              )}
            </Box>

          </Box>
        </Box>

        {/* ── Footer ── */}
        <Box sx={{ background: 'linear-gradient(135deg, #00112B, #003087)', py: 3, px: 4, mt: 6 }}>
          <Box
            sx={{
              maxWidth: 1280, mx: 'auto',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 24, height: 24, borderRadius: '6px',
                  background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
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
