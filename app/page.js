'use client'
import { useState, useEffect, useRef } from 'react'
import {
  Box, Typography, Card, CardContent, Chip, Avatar,
  LinearProgress, Divider, Button,
  IconButton, InputBase, CircularProgress,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import StarIcon from '@mui/icons-material/Star'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SendIcon from '@mui/icons-material/Send'
import RefreshIcon from '@mui/icons-material/Refresh'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import PersonIcon from '@mui/icons-material/Person'
import { SideNav } from '@/components/SideNav'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'

// ─── Static maps ─────────────────────────────────────────────

const PLACEHOLDER_CYCLE = [
  'I\'m a single mom in the Bronx with 2 kids and no food for tonight...',
  'I just lost my job and I can\'t pay rent this month...',
  'My family doesn\'t have health insurance and my child needs a doctor...',
  'We are behind on utility bills and facing shutoff...',
  'I need childcare so I can go back to work...',
]

const CATEGORY_ICON_MAP = {
  Food: FastfoodIcon, Health: LocalHospitalIcon, Housing: HomeIcon,
  Nutrition: ChildCareIcon, Childcare: SchoolIcon, Utilities: ElectricBoltIcon,
  Financial: AttachMoneyIcon, Employment: WorkIcon, Education: SchoolIcon,
}
const CATEGORY_COLOR_MAP = {
  Food: '#E85D04', Health: '#0077B6', Housing: '#7B2FBE',
  Nutrition: '#C0006A', Childcare: '#B45309', Utilities: '#1D4ED8',
  Financial: '#047857', Employment: '#4338CA', Education: '#0369A1',
}
const CATEGORY_BG_MAP = {
  Food: '#FFF4EE', Health: '#EEF7FC', Housing: '#F5EEFF',
  Nutrition: '#FFF0F7', Childcare: '#FFFBEB', Utilities: '#EFF6FF',
  Financial: '#ECFDF5', Employment: '#EEF2FF', Education: '#E0F2FE',
}

const BADGE_STYLES = {
  'High Priority': { bg: '#FEE2E2', color: '#991B1B' },
  'Urgent':        { bg: '#F3E8FF', color: '#6B21A8' },
  'Recommended':   { bg: '#E0F2FE', color: '#075985' },
  'Seasonal':      { bg: '#DBEAFE', color: '#1E40AF' },
  'Tax Benefit':   { bg: '#D1FAE5', color: '#065F46' },
  'Time-Sensitive':{ bg: '#FEF3C7', color: '#92400E' },
}

const MOCK_PROGRAMS = [
  {
    id: 1, name: 'SNAP Benefits', fullName: 'Supplemental Nutrition Assistance Program',
    category: 'Food', Icon: FastfoodIcon, color: '#E85D04', bg: '#FFF4EE',
    badge: 'High Priority', eligibility: 98,
    summary: 'Household of 3 earning $18,500/yr falls well below SNAP\'s 130% poverty threshold (~$30,000). With 2 dependent children, estimated monthly benefit of up to $740 loaded onto an EBT card.',
    nextStep: 'Apply online via ACCESS HRA — takes ~20 min. Bring ID, proof of income, and a utility bill.',
    url: 'https://a069-access.nyc.gov', deadline: null, savings: '$740 / mo',
  },
  {
    id: 2, name: 'Medicaid', fullName: 'Free Health Insurance for Families',
    category: 'Health', Icon: LocalHospitalIcon, color: '#0077B6', bg: '#EEF7FC',
    badge: 'High Priority', eligibility: 99,
    summary: 'Family of 3 earning under $33,000/yr qualifies for full Medicaid — zero premiums, zero copays. Covers doctor visits, dental, vision, prescriptions, and mental health for all members.',
    nextStep: 'Apply at nystateofhealth.ny.gov or walk into the nearest HRA office.',
    url: 'https://nystateofhealth.ny.gov', deadline: null, savings: '$0 premiums',
  },
  {
    id: 3, name: 'Emergency Rental Assistance', fullName: 'NYC Housing Stability Program',
    category: 'Housing', Icon: HomeIcon, color: '#7B2FBE', bg: '#F5EEFF',
    badge: 'Urgent', eligibility: 95,
    summary: 'Behind on rent and earning below 80% AMI qualifies for emergency rental assistance covering up to 12 months of back-owed rent.',
    nextStep: 'Contact HRA or visit the nearest DSS Benefits Access Center. Bring lease, landlord contact, and proof of income.',
    url: 'https://www.nyc.gov/housing', deadline: 'Apply ASAP', savings: 'Up to $18,000',
  },
  {
    id: 4, name: 'WIC Program', fullName: 'Women, Infants & Children Nutrition',
    category: 'Nutrition', Icon: ChildCareIcon, color: '#C0006A', bg: '#FFF0F7',
    badge: 'Recommended', eligibility: 90,
    summary: 'Provides monthly grocery benefits, formula, and free nutrition counseling. Income within 185% FPL qualifies. Covers children up to age 5.',
    nextStep: 'Find a WIC clinic at wic4u.com or call 1-800-522-5006.',
    url: 'https://www.health.ny.gov/prevention/nutrition/wic/', deadline: null, savings: '$60 / mo',
  },
  {
    id: 5, name: 'Child Care Voucher', fullName: 'ACS Child Care Subsidy Program',
    category: 'Childcare', Icon: SchoolIcon, color: '#B45309', bg: '#FFFBEB',
    badge: 'Recommended', eligibility: 88,
    summary: 'NYC ACS subsidies cover up to 90% of daycare and after-school costs for children under 13 whose parent is working or in job training.',
    nextStep: 'Apply at the nearest ACS office or call 311.',
    url: 'https://www.nyc.gov/site/acs/early-care/child-care-subsidies.page', deadline: null, savings: 'Up to $1,200 / mo',
  },
  {
    id: 6, name: 'HEAP — Utility Assistance', fullName: 'Home Energy Assistance Program',
    category: 'Utilities', Icon: ElectricBoltIcon, color: '#1D4ED8', bg: '#EFF6FF',
    badge: 'Seasonal', eligibility: 92,
    summary: 'Receive $300–$850 toward heating and utility bills each winter season if household income is under the HEAP limit.',
    nextStep: 'Apply at the HRA Benefits Access Center or dial 311 and say "HEAP." Applications open in November.',
    url: 'https://www.nyc.gov/site/hra/help/heap.page', deadline: 'Nov – Mar season', savings: 'Up to $850',
  },
  {
    id: 7, name: 'Earned Income Tax Credit', fullName: 'Federal + NYC EITC Refund',
    category: 'Financial', Icon: AttachMoneyIcon, color: '#047857', bg: '#ECFDF5',
    badge: 'Tax Benefit', eligibility: 97,
    summary: 'With 2 children and earned income under $30,000, qualifies for a combined federal + NYC EITC refund of up to $7,500. Fully refundable.',
    nextStep: 'File taxes free through NYC Free Tax Prep (call 311) or a VITA site.',
    url: 'https://www.nyc.gov/site/dca/consumers/file-your-taxes.page', deadline: 'April 15 deadline', savings: 'Up to $7,500 / yr',
  },
  {
    id: 8, name: 'Unemployment Insurance', fullName: 'NY State UI Benefits',
    category: 'Employment', Icon: WorkIcon, color: '#4338CA', bg: '#EEF2FF',
    badge: 'Time-Sensitive', eligibility: 85,
    summary: 'Recently laid off workers are eligible for up to $504/week in NY unemployment benefits for up to 26 weeks while seeking new employment.',
    nextStep: 'File a claim at labor.ny.gov/ui or call 1-888-209-8124. There is a 7-day waiting period — apply now.',
    url: 'https://labor.ny.gov/ui/claimantinfo/beforeyouapplyfaq.shtm', deadline: 'Apply within 30 days', savings: 'Up to $504 / wk',
  },
]

const MOCK_PROFILE = {
  name: 'Maria Rodriguez', initials: 'MR', age: 34,
  location: 'West Farms, Bronx NY 10460', household: 3, children: 2,
  income: '$18,500 / yr', status: 'Recently Unemployed',
  ethnicity: 'Hispanic / Latina', language: 'Spanish (primary)',
  housing: 'Renting — behind on payments', insurance: 'Uninsured',
}

const QUICK_CHIPS = ['Food & Groceries', 'Health Insurance', 'Housing Help', 'Childcare', 'Cash Assistance', 'Utility Bills']

// ─── Helpers ──────────────────────────────────────────────────

function parseMonthlySavings(savings) {
  if (!savings) return 0
  const s = String(savings).toLowerCase().replace(/,/g, '')
  const match = s.match(/\$?([\d.]+)/)
  if (!match) return 0
  const num = parseFloat(match[1])
  if (isNaN(num)) return 0
  if (s.includes('yr') || s.includes('year') || s.includes('annual')) return Math.round(num / 12)
  if (s.includes('wk') || s.includes('week')) return Math.round(num * 4.33)
  return num
}

function mapToCard(program, index) {
  const cat = program.category || ''
  return {
    id: index,
    name: program.name,
    fullName: program.fullName || program.name,
    category: cat,
    Icon: CATEGORY_ICON_MAP[cat] || WorkIcon,
    color: CATEGORY_COLOR_MAP[cat] || '#003087',
    bg: CATEGORY_BG_MAP[cat] || '#E8EEF7',
    badge: program.badge || 'Recommended',
    eligibility: program.eligibility || 85,
    summary: program.summary || program.why_it_matches || '',
    nextStep: program.nextStep || program.how_to_apply || '',
    url: program.url || '#',
    deadline: program.deadline || null,
    savings: program.savings || 'See details',
  }
}

function buildProfileDisplay(p) {
  const EMPLOYMENT_LABELS = {
    'full-time': 'Employed Full-time', 'part-time': 'Employed Part-time',
    'unemployed': 'Unemployed', 'self-employed': 'Self-employed',
    'student': 'Student', 'disability': 'On Disability / SSI', 'retired': 'Retired',
  }
  const HOUSING_LABELS = {
    'renting': 'Renting', 'homeowner': 'Homeowner',
    'with-family': 'Living with family/friends', 'shelter': 'Staying in shelter',
    'unhoused': 'No stable housing',
  }
  const INSURANCE_LABELS = {
    'employer': 'Employer plan', 'medicaid-medicare': 'Medicaid / Medicare',
    'other': 'Other / Marketplace', 'none': 'Uninsured',
  }
  const RACE_LABELS = {
    'hispanic': 'Hispanic / Latino', 'black': 'Black / African American',
    'white': 'White / Caucasian', 'asian': 'Asian', 'native': 'Native American',
  }

  const householdSize = (p.adults || 1) + (p.children || 0)
  const annual = p.monthlyIncome ? `$${(Number(p.monthlyIncome) * 12).toLocaleString()} / yr` : 'Not specified'
  let housing = HOUSING_LABELS[p.housingType] || p.housingType || 'Not specified'
  if (p.behindOnRent) housing += ' — behind on payments'

  return {
    household: `${householdSize} person${householdSize > 1 ? 's' : ''}${p.children > 0 ? ` (${p.children} child${p.children > 1 ? 'ren' : ''})` : ''}`,
    income: annual,
    status: EMPLOYMENT_LABELS[p.employmentStatus] || p.employmentStatus || 'Not specified',
    housing,
    insurance: INSURANCE_LABELS[p.healthInsurance] || 'Not specified',
    language: p.language ? p.language.charAt(0).toUpperCase() + p.language.slice(1) : 'Not specified',
    location: p.zip ? `ZIP ${p.zip}, New York City` : 'New York City',
    ethnicity: RACE_LABELS[p.race] || '',
  }
}

function generateWhySummary(profile) {
  const reasons = []
  if (profile.monthlyIncome && Number(profile.monthlyIncome) * 12 < 35000) reasons.push('income below the federal poverty threshold')
  if (profile.children > 0) reasons.push(`${profile.children} dependent child${profile.children > 1 ? 'ren' : ''}`)
  if (profile.employmentStatus === 'unemployed' || profile.recentlyLostJob) reasons.push('recent job loss')
  if (profile.behindOnRent || profile.evictionRisk) reasons.push('housing instability')
  if (profile.healthInsurance === 'none') reasons.push('lack of health coverage')
  if (!reasons.length) return 'Matched based on your household profile and New York City residency.'
  const last = reasons.pop()
  return `Matched by ${reasons.length ? reasons.join(', ') + ' and ' : ''}${last}.`
}

// ─── Sub-components ───────────────────────────────────────────

function ProfileRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 0.85, borderBottom: '1px solid #F1F5F9' }}>
      <Typography sx={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, flexShrink: 0 }}>{label}</Typography>
      <Typography sx={{ fontSize: 12, color: '#1E293B', fontWeight: 600, textAlign: 'right', ml: 1.5, lineHeight: 1.4 }}>{value}</Typography>
    </Box>
  )
}

function ProgramCard({ program, index }) {
  const [open, setOpen] = useState(false)
  const badge = BADGE_STYLES[program.badge] || { bg: '#F1F5F9', color: '#334155' }

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: '#fff',
        border: '1px solid #E8ECEF',
        borderRadius: '16px',
        overflow: 'visible',
        transition: 'transform 0.24s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.24s ease',
        '@keyframes fadeUp': {
          from: { opacity: 0, transform: 'translateY(18px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        animation: 'fadeUp 0.4s ease both',
        animationDelay: `${index * 60}ms`,
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: `0 20px 48px -8px ${program.color}28, 0 4px 12px rgba(0,0,0,0.06)`,
          borderColor: `${program.color}44`,
        },
        '&:hover .card-icon': {
          '@keyframes iconBounce': {
            '0%': { transform: 'scale(1) translateY(0)' },
            '35%': { transform: 'scale(1.18) translateY(-6px)' },
            '65%': { transform: 'scale(1.08) translateY(-2px)' },
            '100%': { transform: 'scale(1) translateY(0)' },
          },
          animation: 'iconBounce 0.55s cubic-bezier(0.34,1.56,0.64,1)',
        },
      }}
    >
      <CardContent sx={{ p: '20px 22px 18px' }}>

        <Box sx={{ display: 'flex', gap: 1.75, mb: 1.75, alignItems: 'flex-start' }}>
          <Box
            className="card-icon"
            sx={{ width: 46, height: 46, borderRadius: '12px', backgroundColor: program.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <program.Icon sx={{ color: program.color, fontSize: 24 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, pt: 0.25 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#0F172A', lineHeight: 1.2, mb: 0.25 }}>
              {program.name}
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: '#94A3B8', lineHeight: 1.3 }}>
              {program.fullName}
            </Typography>
          </Box>
          <Chip
            label={program.badge}
            size="small"
            sx={{ backgroundColor: badge.bg, color: badge.color, fontWeight: 700, fontSize: 10, height: 20, borderRadius: '6px', flexShrink: 0, mt: 0.25 }}
          />
        </Box>

        <Box sx={{ mb: 1.75 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
            <Typography sx={{ fontSize: 11, color: '#64748B', fontWeight: 600, letterSpacing: 0.3 }}>ELIGIBILITY MATCH</Typography>
            <Typography sx={{ fontSize: 11, color: program.color, fontWeight: 800 }}>{program.eligibility}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={program.eligibility}
            sx={{
              height: 5, borderRadius: 99, backgroundColor: '#F1F5F9',
              '& .MuiLinearProgress-bar': { borderRadius: 99, background: `linear-gradient(90deg, ${program.color}bb, ${program.color})` },
            }}
          />
        </Box>

        <Box sx={{ mb: 1.75 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, backgroundColor: program.bg, borderRadius: '8px', px: 1.25, py: 0.4 }}>
            <Typography sx={{ fontSize: 12, color: program.color, fontWeight: 700 }}>{program.savings}</Typography>
          </Box>
        </Box>

        <Typography sx={{ fontSize: 13, color: '#475569', lineHeight: 1.7, mb: 1.75 }}>
          {program.summary}
        </Typography>

        {open && (
          <Box
            sx={{
              backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', p: 1.5, mb: 1.75,
              '@keyframes slideDown': { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
              animation: 'slideDown 0.2s ease',
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#003087', mb: 0.5, letterSpacing: 0.3 }}>NEXT STEP</Typography>
            <Typography sx={{ fontSize: 12.5, color: '#475569', lineHeight: 1.65 }}>{program.nextStep}</Typography>
            {program.deadline && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                <WarningAmberIcon sx={{ fontSize: 13, color: '#D97706' }} />
                <Typography sx={{ fontSize: 11.5, color: '#D97706', fontWeight: 700 }}>{program.deadline}</Typography>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            onClick={() => setOpen(v => !v)}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.4, cursor: 'pointer', opacity: 0.6, transition: 'opacity 0.15s', '&:hover': { opacity: 1 } }}
          >
            {open ? <ExpandLessIcon sx={{ fontSize: 16, color: '#64748B' }} /> : <ExpandMoreIcon sx={{ fontSize: 16, color: '#64748B' }} />}
            <Typography sx={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{open ? 'Less' : 'How to apply'}</Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Button
            size="small"
            href={program.url}
            target="_blank"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />}
            sx={{
              backgroundColor: program.color, color: '#fff', fontSize: 12, fontWeight: 700,
              borderRadius: '9px', px: 1.5, py: 0.55, textTransform: 'none', boxShadow: 'none', minWidth: 0,
              transition: 'filter 0.15s, transform 0.15s',
              '&:hover': { backgroundColor: program.color, filter: 'brightness(0.85)', transform: 'scale(1.04)', boxShadow: 'none' },
            }}
          >
            Apply
          </Button>
        </Box>

      </CardContent>
    </Card>
  )
}

// ─── Main page ────────────────────────────────────────────────

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
      setApiResults((data.matches || []).map((r, i) => mapToCard({ ...r, summary: r.why_it_matches, nextStep: r.how_to_apply }, i)))
    } catch { /* silently fall back */ }
    setSearching(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch() }
  }

  // Derive display data
  const hasRealData = storedPrograms.length > 0
  const basePrograms = hasRealData ? storedPrograms.map((p, i) => mapToCard(p, i)) : MOCK_PROGRAMS
  const displayedPrograms = apiResults.length > 0 ? apiResults : basePrograms
  const isCustomSearch = apiResults.length > 0

  const profileDisplay = storedProfile ? buildProfileDisplay(storedProfile) : null
  const displayName = storedProfile?.firstName || user?.user_metadata?.first_name || (user?.email ? user.email.split('@')[0] : null)
  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : 'NY'

  // Dynamic stats
  const totalMonthly = basePrograms.reduce((sum, p) => sum + parseMonthlySavings(p.savings), 0)
  const urgentCount = basePrograms.filter(p => ['Urgent', 'High Priority', 'Time-Sensitive'].includes(p.badge)).length
  const avgEligibility = basePrograms.length > 0
    ? Math.round(basePrograms.reduce((sum, p) => sum + (p.eligibility || 85), 0) / basePrograms.length)
    : 94

  const STATS = [
    { label: 'Programs Matched', value: String(basePrograms.length), Icon: StarIcon, color: '#003087', bg: '#E8EEF7' },
    { label: 'Est. Monthly Value', value: totalMonthly > 0 ? `$${totalMonthly.toLocaleString()}+` : '$2,100+', Icon: AttachMoneyIcon, color: '#047857', bg: '#ECFDF5' },
    { label: 'Urgent Actions', value: String(urgentCount), Icon: WarningAmberIcon, color: '#B45309', bg: '#FFFBEB' },
    { label: 'Profile Match', value: `${avgEligibility}%`, Icon: TrendingUpIcon, color: '#7B2FBE', bg: '#F5EEFF' },
  ]

  const urgentProgramNames = basePrograms
    .filter(p => ['Urgent', 'High Priority'].includes(p.badge))
    .slice(0, 2)
    .map(p => p.name)

  const whySummary = storedProfile ? generateWhySummary(storedProfile) : 'Matched by income below the federal poverty line, single-parent status, recent job loss, and location in a high food-insecurity neighborhood.'

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
                  '@keyframes sparkle': { '0%,100%': { opacity: 1, transform: 'scale(1) rotate(0deg)' }, '50%': { opacity: 0.7, transform: 'scale(1.2) rotate(20deg)' } },
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
                sx={{ fontSize: 14.5, color: '#0F172A', '& ::placeholder': { color: '#94A3B8', opacity: 1, transition: 'opacity 0.4s' }, '& input': { py: 0.25 } }}
              />
              {query && (
                <IconButton size="small" onClick={() => { setQuery(''); setApiResults([]) }} sx={{ color: '#CBD5E1', mr: -0.5, '&:hover': { color: '#64748B' } }}>
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
                {searching ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SendIcon sx={{ color: '#fff', fontSize: 17 }} />}
              </Box>
            </Box>

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
                '@keyframes bannerIn': { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
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
                  backgroundColor: '#fff', color: '#003087', fontWeight: 700, fontSize: 13, textTransform: 'none',
                  borderRadius: '10px', px: 2.5, py: 0.85, flexShrink: 0,
                  '&:hover': { backgroundColor: '#EEF4FF', transform: 'translateY(-1px)', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' },
                  transition: 'all 0.15s ease',
                }}
              >
                Complete profile
              </Button>
            </Box>
          )}

          {/* Stats row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
            {STATS.map(({ label, value, Icon, color, bg }, i) => (
              <Card
                key={label}
                elevation={0}
                sx={{
                  border: '1px solid #E8ECEF', borderRadius: '14px', backgroundColor: '#fff',
                  transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                  '@keyframes statFadeUp': { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                  animation: 'statFadeUp 0.4s ease both',
                  animationDelay: `${i * 70}ms`,
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 28px rgba(0,0,0,0.08)' },
                  '&:hover .stat-icon': {
                    '@keyframes statPop': {
                      '0%': { transform: 'scale(1) rotate(0deg)' },
                      '40%': { transform: 'scale(1.3) rotate(-10deg)' },
                      '70%': { transform: 'scale(1.1) rotate(5deg)' },
                      '100%': { transform: 'scale(1) rotate(0deg)' },
                    },
                    animation: 'statPop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                  },
                }}
              >
                <CardContent sx={{ p: '18px 20px 16px' }}>
                  <Box sx={{ width: 38, height: 38, borderRadius: '10px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                    <Icon className="stat-icon" sx={{ color, fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1, letterSpacing: -0.5, mb: 0.4 }}>
                    {value}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{label}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Main grid: profile (left) + programs (right) */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: 3, alignItems: 'start' }}>

            {/* Profile panel */}
            <Card
              elevation={0}
              sx={{ border: '1px solid #E8ECEF', borderRadius: '16px', backgroundColor: '#fff', position: 'sticky', top: 80 }}
            >
              <CardContent sx={{ p: '20px 22px 20px' }}>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Avatar
                    sx={{ width: 44, height: 44, background: 'linear-gradient(135deg, #E85D04, #FF8C00)', fontWeight: 800, fontSize: 15, flexShrink: 0 }}
                  >
                    {initials}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                      {displayName || (hasRealData ? 'Your Profile' : 'Maria Rodriguez')}
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 500 }}>
                      {profileDisplay?.ethnicity || 'Hispanic / Latina'} · New York City
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #001F52, #003087)',
                    borderRadius: '12px', px: 2, py: 1.5, mb: 2.5,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: 10.5, color: '#7FA8D4', fontWeight: 600, letterSpacing: 0.4, mb: 0.3 }}>PROFILE MATCH</Typography>
                    <Typography sx={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: -1 }}>{avgEligibility}%</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: 10.5, color: '#7FA8D4', fontWeight: 600, letterSpacing: 0.4, mb: 0.3 }}>MATCHED</Typography>
                    <Typography sx={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: -1 }}>{basePrograms.length}</Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <ProfileRow label="Location" value={profileDisplay?.location || MOCK_PROFILE.location} />
                  <ProfileRow label="Household" value={profileDisplay?.household || `${MOCK_PROFILE.household} people (${MOCK_PROFILE.children} children)`} />
                  <ProfileRow label="Income" value={profileDisplay?.income || MOCK_PROFILE.income} />
                  <ProfileRow label="Employment" value={profileDisplay?.status || MOCK_PROFILE.status} />
                  <ProfileRow label="Housing" value={profileDisplay?.housing || MOCK_PROFILE.housing} />
                  <ProfileRow label="Insurance" value={profileDisplay?.insurance || MOCK_PROFILE.insurance} />
                  <ProfileRow label="Language" value={profileDisplay?.language || MOCK_PROFILE.language} />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, letterSpacing: 0.4, mb: 0.75 }}>
                  WHY THESE PROGRAMS
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.65, mb: 2 }}>
                  {whySummary}
                </Typography>

                <Box sx={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', p: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.5 }}>
                    <WarningAmberIcon sx={{ fontSize: 14, color: '#D97706' }} />
                    <Typography sx={{ fontSize: 11.5, color: '#D97706', fontWeight: 700 }}>Urgent: Apply first</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: '#92400E', lineHeight: 1.55 }}>
                    {urgentCallout}
                  </Typography>
                </Box>

                {hasRealData && (
                  <Button
                    component={Link}
                    href="/onboarding"
                    fullWidth
                    sx={{
                      mt: 2, fontSize: 12.5, fontWeight: 600, textTransform: 'none',
                      color: '#64748B', borderRadius: '10px', border: '1px solid #E2E8F0',
                      py: 0.85,
                      '&:hover': { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' },
                    }}
                  >
                    Update my profile
                  </Button>
                )}

              </CardContent>
            </Card>

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
                    {displayedPrograms.length} matches · {isCustomSearch ? 'based on your search' : hasRealData ? 'personalized to your profile' : 'sample profile — complete yours to see yours'}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }} />
                {isCustomSearch && (
                  <Box
                    onClick={() => { setApiResults([]); setQuery('') }}
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.15s', '&:hover': { opacity: 1 } }}
                  >
                    <RefreshIcon sx={{ fontSize: 15, color: '#64748B' }} />
                    <Typography sx={{ fontSize: 12.5, color: '#64748B', fontWeight: 600 }}>Back to profile</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, backgroundColor: '#ECFDF5', borderRadius: '8px', px: 1.25, py: 0.5 }}>
                  <CheckCircleIcon sx={{ fontSize: 13, color: '#059669' }} />
                  <Typography sx={{ fontSize: 11.5, color: '#059669', fontWeight: 700 }}>Verified NYC programs</Typography>
                </Box>
              </Box>

              {searching && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, gap: 2 }}>
                  <CircularProgress size={32} sx={{ color: '#003087' }} />
                  <Typography sx={{ fontSize: 14, color: '#94A3B8' }}>Finding programs that match your situation…</Typography>
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
