'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box, Typography, Button, LinearProgress, IconButton,
  InputBase, CircularProgress,
} from '@mui/material'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import WorkIcon from '@mui/icons-material/Work'
import SchoolIcon from '@mui/icons-material/School'
import BusinessIcon from '@mui/icons-material/Business'
import HomeIcon from '@mui/icons-material/Home'
import ApartmentIcon from '@mui/icons-material/Apartment'
import GroupIcon from '@mui/icons-material/Group'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import StoreIcon from '@mui/icons-material/Store'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

const TOTAL_STEPS = 5

// ─── Reusable sub-components ──────────────────────────────────

function SelectCard({ label, icon: Icon, value, selected, onSelect }) {
  return (
    <Box
      onClick={() => onSelect(value)}
      sx={{
        border: selected ? '2px solid #003087' : '1.5px solid #E5E7EB',
        borderRadius: '12px',
        p: 1.75,
        cursor: 'pointer',
        backgroundColor: selected ? '#EEF4FF' : '#FAFAFA',
        transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
        textAlign: 'center',
        '&:hover': {
          borderColor: '#003087',
          backgroundColor: '#EEF4FF',
          transform: 'translateY(-3px)',
          boxShadow: '0 6px 16px rgba(0,48,135,0.12)',
        },
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: '10px',
          backgroundColor: selected ? '#003087' : '#E8ECEF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.15s',
        }}
      >
        <Icon sx={{ color: selected ? '#fff' : '#6B7280', fontSize: 22 }} />
      </Box>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: selected ? '#003087' : '#374151', lineHeight: 1.35 }}>
        {label}
      </Typography>
    </Box>
  )
}

function NumberStepper({ label, sublabel, value, onChange, min = 0, max = 10 }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.75,
        borderBottom: '1px solid #F1F5F9',
      }}
    >
      <Box>
        <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: '#0F172A' }}>{label}</Typography>
        {sublabel && <Typography sx={{ fontSize: 12, color: '#94A3B8', mt: 0.2 }}>{sublabel}</Typography>}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton
          size="small"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          sx={{
            width: 34, height: 34,
            border: '1.5px solid #E5E7EB',
            borderRadius: '8px', p: 0,
            '&:disabled': { opacity: 0.3 },
            '&:hover:not(:disabled)': { borderColor: '#003087', backgroundColor: '#EEF4FF' },
          }}
        >
          <RemoveIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#0F172A', minWidth: 32, textAlign: 'center', lineHeight: 1 }}>
          {value}
        </Typography>
        <IconButton
          size="small"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          sx={{
            width: 34, height: 34,
            border: '1.5px solid #E5E7EB',
            borderRadius: '8px', p: 0,
            '&:disabled': { opacity: 0.3 },
            '&:hover:not(:disabled)': { borderColor: '#003087', backgroundColor: '#EEF4FF' },
          }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  )
}

function YesNoToggle({ label, value, onChange }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
      <Typography sx={{ fontSize: 13.5, color: '#374151', fontWeight: 500, flex: 1, mr: 2, lineHeight: 1.45 }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.75, flexShrink: 0 }}>
        {['Yes', 'No'].map(opt => {
          const active = (opt === 'Yes' && value === true) || (opt === 'No' && value === false)
          return (
            <Box
              key={opt}
              onClick={() => onChange(opt === 'Yes')}
              sx={{
                px: 2, py: 0.6,
                borderRadius: '8px',
                border: active ? '2px solid #003087' : '1.5px solid #E5E7EB',
                backgroundColor: active ? '#EEF4FF' : '#FAFAFA',
                cursor: 'pointer',
                fontSize: 13.5, fontWeight: 700,
                color: active ? '#003087' : '#6B7280',
                transition: 'all 0.15s ease',
                '&:hover': { borderColor: '#003087', backgroundColor: '#EEF4FF', color: '#003087' },
              }}
            >
              {opt}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

function DollarInput({ label, sublabel, value, onChange, placeholder = '0' }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: '#374151', mb: sublabel ? 0.4 : 0.75 }}>
        {label}
      </Typography>
      {sublabel && (
        <Typography sx={{ fontSize: 12, color: '#94A3B8', mb: 0.75 }}>{sublabel}</Typography>
      )}
      <Box
        sx={{
          display: 'flex', alignItems: 'center',
          border: '1.5px solid #E5E7EB', borderRadius: '10px', px: 1.5,
          backgroundColor: '#FAFAFA',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          '&:focus-within': { borderColor: '#003087', boxShadow: '0 0 0 3px rgba(0,48,135,0.1)', backgroundColor: '#fff' },
        }}
      >
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#94A3B8', mr: 0.5 }}>$</Typography>
        <InputBase
          fullWidth type="number" placeholder={placeholder}
          value={value} onChange={e => onChange(e.target.value)}
          inputProps={{ min: 0 }}
          sx={{ fontSize: 15, color: '#0F172A', py: 1.1 }}
        />
      </Box>
    </Box>
  )
}

function CheckCard({ label, checked, onChange }) {
  return (
    <Box
      onClick={onChange}
      sx={{
        border: checked ? '2px solid #003087' : '1.5px solid #E5E7EB',
        borderRadius: '10px', px: 1.5, py: 1.1,
        cursor: 'pointer',
        backgroundColor: checked ? '#EEF4FF' : '#FAFAFA',
        display: 'flex', alignItems: 'center', gap: 1,
        transition: 'all 0.15s ease',
        '&:hover': { borderColor: '#003087', backgroundColor: '#EEF4FF' },
      }}
    >
      <Box
        sx={{
          width: 18, height: 18, borderRadius: '5px', flexShrink: 0,
          border: checked ? 'none' : '1.5px solid #D1D5DB',
          backgroundColor: checked ? '#003087' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s ease',
        }}
      >
        {checked && <CheckCircleIcon sx={{ color: '#fff', fontSize: 14 }} />}
      </Box>
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: checked ? '#003087' : '#374151' }}>
        {label}
      </Typography>
    </Box>
  )
}

function PillOption({ label, active, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        border: active ? '2px solid #003087' : '1.5px solid #E5E7EB',
        borderRadius: '8px', px: 1.4, py: 0.85,
        cursor: 'pointer',
        backgroundColor: active ? '#EEF4FF' : '#FAFAFA',
        transition: 'all 0.15s ease',
        '&:hover': { borderColor: '#003087', backgroundColor: '#EEF4FF' },
      }}
    >
      <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: active ? '#003087' : '#374151' }}>
        {label}
      </Typography>
    </Box>
  )
}

// ─── Loading screen ────────────────────────────────────────────

function LoadingScreen({ profile }) {
  const [stageIdx, setStageIdx] = useState(0)
  const stages = [
    'Reading your profile…',
    'Checking income eligibility…',
    'Searching 100+ NYC programs…',
    'Ranking your best matches…',
    'Preparing your dashboard…',
  ]

  useEffect(() => {
    if (stageIdx < stages.length - 1) {
      const t = setTimeout(() => setStageIdx(i => i + 1), 1100)
      return () => clearTimeout(t)
    }
  }, [stageIdx])

  const total = (profile.adults || 1) + (profile.children || 0)

  return (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <Box
        sx={{
          width: 80, height: 80, borderRadius: '20px',
          background: 'linear-gradient(135deg, #001F52, #003087)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mx: 'auto', mb: 3,
          '@keyframes aiPulse': {
            '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(0,48,135,0.3)' },
            '50%': { transform: 'scale(1.07)', boxShadow: '0 0 0 14px rgba(0,48,135,0)' },
          },
          animation: 'aiPulse 2s ease-in-out infinite',
        }}
      >
        <AutoAwesomeIcon sx={{ color: '#fff', fontSize: 36 }} />
      </Box>
      <Typography sx={{ fontSize: 21, fontWeight: 800, color: '#0F172A', mb: 0.75 }}>
        Finding your programs
      </Typography>
      <Typography sx={{ fontSize: 13.5, color: '#64748B', mb: 3.5, lineHeight: 1.6 }}>
        Analyzing your {total}-person household across NYC's full benefits directory.
      </Typography>
      <Box sx={{ textAlign: 'left', px: 1 }}>
        {stages.map((stage, i) => (
          <Box key={stage} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.85, opacity: i <= stageIdx ? 1 : 0.3, transition: 'opacity 0.4s ease' }}>
            <Box sx={{ flexShrink: 0, width: 18, display: 'flex', justifyContent: 'center' }}>
              {i < stageIdx
                ? <CheckCircleIcon sx={{ fontSize: 16, color: '#059669' }} />
                : i === stageIdx
                  ? <CircularProgress size={14} sx={{ color: '#003087' }} />
                  : <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #CBD5E1', mx: 'auto' }} />
              }
            </Box>
            <Typography sx={{ fontSize: 13.5, color: i <= stageIdx ? '#0F172A' : '#94A3B8', fontWeight: i === stageIdx ? 600 : 400 }}>
              {stage}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

// ─── Main page ─────────────────────────────────────────────────

export default function Onboarding() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [profile, setProfile] = useState({
    firstName: '',
    zip: '',
    adults: 1,
    children: 0,
    childrenAges: [],
    employmentStatus: '',
    monthlyIncome: '',
    recentlyLostJob: false,
    housingType: '',
    rentAmount: '',
    behindOnRent: false,
    behindOnUtilities: false,
    evictionRisk: false,
    healthInsurance: '',
    pregnantHousehold: false,
    currentBenefits: [],
    race: '',
    language: '',
    citizenship: '',
    isVeteran: false,
  })

  useEffect(() => {
    if (user) {
      setProfile(p => ({
        ...p,
        firstName: user.user_metadata?.first_name || '',
        zip: user.user_metadata?.zip || '',
      }))
    }
  }, [user])

  // Keep childrenAges array in sync with children count
  useEffect(() => {
    setProfile(p => {
      const ages = [...p.childrenAges]
      while (ages.length < p.children) ages.push('')
      return { ...p, childrenAges: ages.slice(0, p.children) }
    })
  }, [profile.children])

  function set(key) {
    return val => setProfile(p => ({ ...p, [key]: val }))
  }

  function toggleBenefit(val) {
    setProfile(p => {
      const list = p.currentBenefits
      if (val === 'none') {
        return { ...p, currentBenefits: list.includes('none') ? [] : ['none'] }
      }
      const without = list.filter(b => b !== 'none')
      return {
        ...p,
        currentBenefits: without.includes(val) ? without.filter(b => b !== val) : [...without, val],
      }
    })
  }

  function canProceed() {
    if (step === 1) return !!profile.employmentStatus
    if (step === 2) return !!profile.housingType
    if (step === 3) return !!profile.healthInsurance
    return true
  }

  async function handleFinish() {
    setLoading(true)
    setError('')
    setStep(5) // show loading screen

    try {
      const [data] = await Promise.all([
        fetch('/api/profile-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        }).then(r => r.json()),
        new Promise(resolve => setTimeout(resolve, 5000)), // minimum animation time
      ])

      if (!data.programs?.length) throw new Error('No programs returned. Please try again.')

      localStorage.setItem('resourcenyc_profile', JSON.stringify(profile))
      localStorage.setItem('resourcenyc_programs', JSON.stringify(data.programs))
      router.push('/')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setStep(4)
      setLoading(false)
    }
  }

  // ─── Option configs ──────────────────────────────────────────

  const EMPLOYMENT_OPTS = [
    { label: 'Full-time', value: 'full-time', icon: WorkIcon },
    { label: 'Part-time', value: 'part-time', icon: WorkIcon },
    { label: 'Unemployed', value: 'unemployed', icon: SearchIcon },
    { label: 'Self-employed', value: 'self-employed', icon: StoreIcon },
    { label: 'Student', value: 'student', icon: SchoolIcon },
    { label: 'Disability / SSI', value: 'disability', icon: LocalHospitalIcon },
    { label: 'Retired', value: 'retired', icon: BusinessIcon },
  ]

  const HOUSING_OPTS = [
    { label: 'Renting', value: 'renting', icon: ApartmentIcon },
    { label: 'Own my home', value: 'homeowner', icon: HomeIcon },
    { label: 'With family or friends', value: 'with-family', icon: GroupIcon },
    { label: 'Staying in a shelter', value: 'shelter', icon: LocalHospitalIcon },
    { label: 'No stable housing', value: 'unhoused', icon: SearchIcon },
  ]

  const INSURANCE_OPTS = [
    { label: 'Through my employer', value: 'employer', icon: BusinessIcon },
    { label: 'Medicaid or Medicare', value: 'medicaid-medicare', icon: LocalHospitalIcon },
    { label: 'Other / Marketplace', value: 'other', icon: SchoolIcon },
    { label: 'No insurance', value: 'none', icon: SearchIcon },
  ]

  const BENEFIT_OPTS = [
    { label: 'SNAP (Food Stamps)', value: 'snap' },
    { label: 'WIC', value: 'wic' },
    { label: 'Medicaid', value: 'medicaid' },
    { label: 'Section 8 / NYCHA', value: 'section8' },
    { label: 'Unemployment benefits', value: 'unemployment' },
    { label: 'SSI or SSDI', value: 'ssi-ssdi' },
    { label: 'Cash Assistance', value: 'cash-assistance' },
    { label: 'None of the above', value: 'none' },
  ]

  const STEP_TITLES = [
    'Your household',
    'Income & employment',
    'Your housing',
    'Health & current benefits',
    'A few final details',
  ]

  const STEP_DESCS = [
    'Tell us who lives with you — family programs depend on household size.',
    'Your work and income determine which assistance programs you can access.',
    'Housing status unlocks rental, utility, and emergency assistance programs.',
    'Coverage gaps and current enrollments help us avoid duplicate suggestions.',
    'Optional details that unlock eligibility for specific programs.',
  ]

  // ─── Step content ────────────────────────────────────────────

  function renderStepContent() {
    switch (step) {

      case 0:
        return (
          <Box>
            <NumberStepper label="Adults in your household" sublabel="Including yourself (age 18+)" value={profile.adults} onChange={set('adults')} min={1} max={8} />
            <NumberStepper label="Children" sublabel="Under 18 years old" value={profile.children} onChange={set('children')} min={0} max={8} />
            {profile.children > 0 && (
              <Box sx={{ mt: 2.5 }}>
                <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#64748B', mb: 1.25, letterSpacing: 0.3 }}>
                  CHILDREN'S AGES
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Array.from({ length: profile.children }).map((_, i) => (
                    <Box key={i} sx={{ flex: '0 0 calc(25% - 6px)', minWidth: 70 }}>
                      <Typography sx={{ fontSize: 11, color: '#94A3B8', mb: 0.4 }}>Child {i + 1}</Typography>
                      <Box
                        sx={{
                          border: '1.5px solid #E5E7EB', borderRadius: '8px', px: 1.25,
                          backgroundColor: '#FAFAFA',
                          '&:focus-within': { borderColor: '#003087', boxShadow: '0 0 0 3px rgba(0,48,135,0.1)', backgroundColor: '#fff' },
                        }}
                      >
                        <InputBase
                          type="number" fullWidth placeholder="Age"
                          value={profile.childrenAges[i] || ''}
                          onChange={e => {
                            const ages = [...profile.childrenAges]
                            ages[i] = e.target.value
                            set('childrenAges')(ages)
                          }}
                          inputProps={{ min: 0, max: 17 }}
                          sx={{ fontSize: 14, color: '#0F172A', py: 0.85 }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )

      case 1:
        return (
          <Box>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#64748B', mb: 1.25, letterSpacing: 0.3 }}>
              CURRENT EMPLOYMENT STATUS
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mb: 3 }}>
              {EMPLOYMENT_OPTS.map(opt => (
                <SelectCard key={opt.value} label={opt.label} icon={opt.icon} value={opt.value} selected={profile.employmentStatus === opt.value} onSelect={set('employmentStatus')} />
              ))}
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2.5 }}>
              <DollarInput
                label="Monthly household income"
                sublabel="Before taxes, all sources combined"
                value={profile.monthlyIncome}
                onChange={set('monthlyIncome')}
                placeholder="e.g. 1500"
              />
              <Box>
                <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: '#374151', mb: 0.4 }}>Annual income</Typography>
                <Typography sx={{ fontSize: 12, color: '#94A3B8', mb: 0.75 }}>Auto-calculated</Typography>
                <Box sx={{ border: '1.5px solid #E5E7EB', borderRadius: '10px', px: 1.5, py: 1.1, backgroundColor: '#F8FAFC' }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#64748B' }}>
                    ${profile.monthlyIncome ? (Number(profile.monthlyIncome) * 12).toLocaleString() : '0'} / yr
                  </Typography>
                </Box>
              </Box>
            </Box>
            {profile.employmentStatus && profile.employmentStatus !== 'unemployed' && (
              <YesNoToggle label="Did you lose a job in the past 12 months?" value={profile.recentlyLostJob} onChange={set('recentlyLostJob')} />
            )}
          </Box>
        )

      case 2:
        return (
          <Box>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#64748B', mb: 1.25, letterSpacing: 0.3 }}>
              CURRENT HOUSING SITUATION
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 3 }}>
              {HOUSING_OPTS.map(opt => (
                <SelectCard key={opt.value} label={opt.label} icon={opt.icon} value={opt.value} selected={profile.housingType === opt.value} onSelect={set('housingType')} />
              ))}
            </Box>
            {(profile.housingType === 'renting' || profile.housingType === 'homeowner') && (
              <Box sx={{ mb: 2.5 }}>
                <DollarInput
                  label={profile.housingType === 'renting' ? 'Monthly rent amount' : 'Monthly mortgage amount'}
                  sublabel="Leave blank if unsure"
                  value={profile.rentAmount}
                  onChange={set('rentAmount')}
                  placeholder="e.g. 1200"
                />
              </Box>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mt: 0.5 }}>
              <YesNoToggle label="Behind on rent or mortgage payments?" value={profile.behindOnRent} onChange={set('behindOnRent')} />
              <YesNoToggle label="Behind on utility bills (heat, electric, gas)?" value={profile.behindOnUtilities} onChange={set('behindOnUtilities')} />
              <YesNoToggle label="Received eviction notice or facing foreclosure?" value={profile.evictionRisk} onChange={set('evictionRisk')} />
            </Box>
          </Box>
        )

      case 3:
        return (
          <Box>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#64748B', mb: 1.25, letterSpacing: 0.3 }}>
              CURRENT HEALTH INSURANCE
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mb: 2.5 }}>
              {INSURANCE_OPTS.map(opt => (
                <SelectCard key={opt.value} label={opt.label} icon={opt.icon} value={opt.value} selected={profile.healthInsurance === opt.value} onSelect={set('healthInsurance')} />
              ))}
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <YesNoToggle label="Is anyone in your household currently pregnant?" value={profile.pregnantHousehold} onChange={set('pregnantHousehold')} />
            </Box>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#64748B', mb: 1.25, letterSpacing: 0.3 }}>
              CURRENTLY ENROLLED IN (select all that apply)
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0.85 }}>
              {BENEFIT_OPTS.map(opt => (
                <CheckCard key={opt.value} label={opt.label} checked={profile.currentBenefits.includes(opt.value)} onChange={() => toggleBenefit(opt.value)} />
              ))}
            </Box>
          </Box>
        )

      case 4:
        return (
          <Box>
            <Box sx={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', px: 2, py: 1.25, mb: 3 }}>
              <Typography sx={{ fontSize: 13, color: '#166534', lineHeight: 1.55 }}>
                These details are optional and help match you to programs with specific requirements — for example, veteran benefits or language-specific services. Your data is never sold or shared.
              </Typography>
            </Box>

            {/* ZIP */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: '#374151', mb: 0.75 }}>ZIP code</Typography>
              <Box sx={{ border: '1.5px solid #E5E7EB', borderRadius: '10px', px: 1.75, backgroundColor: '#FAFAFA', '&:focus-within': { borderColor: '#003087', boxShadow: '0 0 0 3px rgba(0,48,135,0.1)', backgroundColor: '#fff' } }}>
                <InputBase fullWidth placeholder="e.g. 10460" value={profile.zip} onChange={e => set('zip')(e.target.value)} sx={{ fontSize: 14.5, color: '#0F172A', py: 1 }} />
              </Box>
            </Box>

            {/* Race */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: '#374151', mb: 0.75 }}>
                Race / ethnicity{' '}
                <Typography component="span" sx={{ fontSize: 12, color: '#94A3B8', fontWeight: 400 }}>(optional)</Typography>
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.75 }}>
                {[
                  { label: 'Hispanic / Latino', value: 'hispanic' },
                  { label: 'Black / African American', value: 'black' },
                  { label: 'White / Caucasian', value: 'white' },
                  { label: 'Asian', value: 'asian' },
                  { label: 'Native American', value: 'native' },
                  { label: 'Prefer not to say', value: '' },
                ].map(opt => (
                  <PillOption key={opt.label} label={opt.label} active={profile.race === opt.value && opt.value !== ''} onClick={() => set('race')(opt.value)} />
                ))}
              </Box>
            </Box>

            {/* Language */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: '#374151', mb: 0.75 }}>
                Primary language{' '}
                <Typography component="span" sx={{ fontSize: 12, color: '#94A3B8', fontWeight: 400 }}>(optional)</Typography>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {['English', 'Spanish', 'Mandarin', 'Bengali', 'Haitian Creole', 'Russian', 'Korean', 'Arabic', 'Other'].map(lang => {
                  const val = lang.toLowerCase().split(' ')[0]
                  return (
                    <Box
                      key={lang}
                      onClick={() => set('language')(val)}
                      sx={{
                        border: profile.language === val ? '2px solid #003087' : '1.5px solid #E5E7EB',
                        borderRadius: '20px', px: 1.5, py: 0.5,
                        cursor: 'pointer',
                        backgroundColor: profile.language === val ? '#EEF4FF' : '#FAFAFA',
                        transition: 'all 0.15s ease',
                        '&:hover': { borderColor: '#003087', backgroundColor: '#EEF4FF' },
                      }}
                    >
                      <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: profile.language === val ? '#003087' : '#374151' }}>
                        {lang}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            </Box>

            {/* Citizenship */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: '#374151', mb: 0.75 }}>
                Immigration / citizenship status{' '}
                <Typography component="span" sx={{ fontSize: 12, color: '#94A3B8', fontWeight: 400 }}>(optional)</Typography>
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0.75 }}>
                {[
                  { label: 'U.S. Citizen', value: 'citizen' },
                  { label: 'Legal Permanent Resident', value: 'lpr' },
                  { label: 'DACA / Dreamer', value: 'daca' },
                  { label: 'Other documented', value: 'documented' },
                  { label: 'Undocumented', value: 'undocumented' },
                  { label: 'Prefer not to say', value: '' },
                ].map(opt => (
                  <PillOption key={opt.label} label={opt.label} active={profile.citizenship === opt.value && opt.value !== ''} onClick={() => set('citizenship')(opt.value)} />
                ))}
              </Box>
            </Box>

            {/* Veteran */}
            <YesNoToggle label="Are you a U.S. military veteran?" value={profile.isVeteran} onChange={set('isVeteran')} />

            {error && (
              <Box sx={{ mt: 2.5, px: 2, py: 1.5, backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px' }}>
                <Typography sx={{ fontSize: 13, color: '#991B1B' }}>{error}</Typography>
              </Box>
            )}
          </Box>
        )

      default:
        return null
    }
  }

  // ─── Render ───────────────────────────────────────────────────

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #00112B 0%, #001F52 50%, #003087 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        py: 4, px: 2,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* BG orbs */}
      <Box sx={{ position: 'absolute', top: -100, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,120,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: -100, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,47,190,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Logo */}
      <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', mb: 4, position: 'relative', zIndex: 1 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LocationCityIcon sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>ResourceNYC</Typography>
      </Box>

      {/* Card */}
      <Box
        sx={{
          width: '100%', maxWidth: 620,
          backgroundColor: '#fff',
          borderRadius: '20px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.28)',
          overflow: 'hidden',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Progress bar — only on questionnaire steps */}
        {step < 5 && (
          <LinearProgress
            variant="determinate"
            value={(step / TOTAL_STEPS) * 100}
            sx={{
              height: 4,
              backgroundColor: '#F1F5F9',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #001F52, #003087)',
                transition: 'transform 0.6s ease',
              },
            }}
          />
        )}

        <Box sx={{ px: { xs: 3, sm: 4.5 }, py: 4 }}>

          {/* Step header */}
          {step < 5 && (
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: '#94A3B8', letterSpacing: 0.6, mb: 0.4 }}>
                STEP {step + 1} OF {TOTAL_STEPS}
              </Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: -0.4, mb: 0.5, lineHeight: 1.2 }}>
                {STEP_TITLES[step]}
              </Typography>
              <Typography sx={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.55 }}>
                {STEP_DESCS[step]}
              </Typography>
            </Box>
          )}

          {/* Animated step body */}
          <Box
            key={step}
            sx={{
              '@keyframes stepSlideIn': {
                from: { opacity: 0, transform: 'translateX(20px)' },
                to: { opacity: 1, transform: 'translateX(0)' },
              },
              animation: 'stepSlideIn 0.28s ease',
            }}
          >
            {step === 5 ? <LoadingScreen profile={profile} /> : renderStepContent()}
          </Box>

          {/* Navigation */}
          {step < 5 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4 }}>

              <Button
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                sx={{
                  color: '#64748B', fontWeight: 600, fontSize: 13.5, textTransform: 'none',
                  borderRadius: '10px', px: 2, py: 0.75,
                  '&:disabled': { opacity: 0.3 },
                  '&:hover': { backgroundColor: '#F1F5F9' },
                }}
              >
                Back
              </Button>

              {/* Step dots */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: i === step ? 22 : 7,
                      height: 7,
                      borderRadius: '4px',
                      backgroundColor: i === step ? '#003087' : i < step ? '#94A3B8' : '#E2E8F0',
                      transition: 'all 0.35s ease',
                    }}
                  />
                ))}
              </Box>

              {step < TOTAL_STEPS - 1 ? (
                <Button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    background: canProceed() ? 'linear-gradient(135deg, #003087, #0055CC)' : '#E5E7EB',
                    color: canProceed() ? '#fff' : '#94A3B8',
                    fontWeight: 700, fontSize: 13.5, textTransform: 'none',
                    borderRadius: '10px', px: 2.5, py: 0.75, boxShadow: 'none',
                    transition: 'all 0.15s ease',
                    '&:hover': canProceed() ? { filter: 'brightness(1.1)', boxShadow: '0 4px 16px rgba(0,48,135,0.28)' } : {},
                  }}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={loading}
                  endIcon={loading
                    ? <CircularProgress size={14} sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    : <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                  }
                  sx={{
                    background: 'linear-gradient(135deg, #003087, #0055CC)',
                    color: '#fff', fontWeight: 700, fontSize: 13.5, textTransform: 'none',
                    borderRadius: '10px', px: 2.5, py: 0.75,
                    boxShadow: '0 4px 16px rgba(0,48,135,0.28)',
                    '&:hover': { filter: 'brightness(1.1)', boxShadow: '0 8px 24px rgba(0,48,135,0.36)' },
                  }}
                >
                  {loading ? 'Analyzing…' : 'Find my programs'}
                </Button>
              )}
            </Box>
          )}

        </Box>
      </Box>

      {step < 5 && (
        <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', mt: 2.5, position: 'relative', zIndex: 1 }}>
          Your information is private and secure — never sold or shared.
        </Typography>
      )}
    </Box>
  )
}
