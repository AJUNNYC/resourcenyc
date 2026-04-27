import WorkIcon from '@mui/icons-material/Work'
import { CATEGORY_ICON_MAP, CATEGORY_COLOR_MAP, CATEGORY_BG_MAP } from './constants'

// ─── Savings parser ────────────────────────────────────────────
// Converts a savings string like "$740 / mo" or "Up to $7,500 / yr"
// into a monthly dollar number for summing stats.

export function parseMonthlySavings(savings) {
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

// ─── Program normaliser ────────────────────────────────────────
// Maps a raw API result (or mock program object) to the shape that
// ProgramCard and ProfilePanel expect.

export function mapToCard(program, index) {
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

// ─── Profile display builder ───────────────────────────────────
// Converts the raw onboarding profile object into human-readable
// strings for display in the ProfilePanel.

export function buildProfileDisplay(p) {
  const EMPLOYMENT_LABELS = {
    'full-time':    'Employed Full-time',
    'part-time':    'Employed Part-time',
    'unemployed':   'Unemployed',
    'self-employed':'Self-employed',
    'student':      'Student',
    'disability':   'On Disability / SSI',
    'retired':      'Retired',
  }
  const HOUSING_LABELS = {
    'renting':     'Renting',
    'homeowner':   'Homeowner',
    'with-family': 'Living with family/friends',
    'shelter':     'Staying in shelter',
    'unhoused':    'No stable housing',
  }
  const INSURANCE_LABELS = {
    'employer':         'Employer plan',
    'medicaid-medicare':'Medicaid / Medicare',
    'other':            'Other / Marketplace',
    'none':             'Uninsured',
  }
  const RACE_LABELS = {
    'hispanic':'Hispanic / Latino',
    'black':   'Black / African American',
    'white':   'White / Caucasian',
    'asian':   'Asian',
    'native':  'Native American',
  }

  const householdSize = (p.adults || 1) + (p.children || 0)
  const annual = p.monthlyIncome
    ? `$${(Number(p.monthlyIncome) * 12).toLocaleString()} / yr`
    : 'Not specified'
  let housing = HOUSING_LABELS[p.housingType] || p.housingType || 'Not specified'
  if (p.behindOnRent) housing += ' — behind on payments'

  return {
    household: `${householdSize} person${householdSize > 1 ? 's' : ''}${
      p.children > 0 ? ` (${p.children} child${p.children > 1 ? 'ren' : ''})` : ''
    }`,
    income: annual,
    status: EMPLOYMENT_LABELS[p.employmentStatus] || p.employmentStatus || 'Not specified',
    housing,
    insurance: INSURANCE_LABELS[p.healthInsurance] || 'Not specified',
    language: p.language
      ? p.language.charAt(0).toUpperCase() + p.language.slice(1)
      : 'Not specified',
    location: p.zip ? `ZIP ${p.zip}, New York City` : 'New York City',
    ethnicity: RACE_LABELS[p.race] || '',
  }
}

// ─── "Why these programs" summary ─────────────────────────────

export function generateWhySummary(profile) {
  const reasons = []
  if (profile.monthlyIncome && Number(profile.monthlyIncome) * 12 < 35000)
    reasons.push('income below the federal poverty threshold')
  if (profile.children > 0)
    reasons.push(`${profile.children} dependent child${profile.children > 1 ? 'ren' : ''}`)
  if (profile.employmentStatus === 'unemployed' || profile.recentlyLostJob)
    reasons.push('recent job loss')
  if (profile.behindOnRent || profile.evictionRisk)
    reasons.push('housing instability')
  if (profile.healthInsurance === 'none')
    reasons.push('lack of health coverage')
  if (!reasons.length)
    return 'Matched based on your household profile and New York City residency.'
  const last = reasons.pop()
  return `Matched by ${reasons.length ? reasons.join(', ') + ' and ' : ''}${last}.`
}
