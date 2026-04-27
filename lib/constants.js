import HomeIcon from '@mui/icons-material/Home'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'

// ─── Search bar placeholder cycle ─────────────────────────────

export const PLACEHOLDER_CYCLE = [
  "I'm a single mom in the Bronx with 2 kids and no food for tonight...",
  "I just lost my job and I can't pay rent this month...",
  "My family doesn't have health insurance and my child needs a doctor...",
  'We are behind on utility bills and facing shutoff...',
  'I need childcare so I can go back to work...',
]

// ─── Category display maps ─────────────────────────────────────

export const CATEGORY_ICON_MAP = {
  Food: FastfoodIcon,
  Health: LocalHospitalIcon,
  Housing: HomeIcon,
  Nutrition: ChildCareIcon,
  Childcare: SchoolIcon,
  Utilities: ElectricBoltIcon,
  Financial: AttachMoneyIcon,
  Employment: WorkIcon,
  Education: SchoolIcon,
}

export const CATEGORY_COLOR_MAP = {
  Food: '#E85D04',
  Health: '#0077B6',
  Housing: '#7B2FBE',
  Nutrition: '#C0006A',
  Childcare: '#B45309',
  Utilities: '#1D4ED8',
  Financial: '#047857',
  Employment: '#4338CA',
  Education: '#0369A1',
}

export const CATEGORY_BG_MAP = {
  Food: '#FFF4EE',
  Health: '#EEF7FC',
  Housing: '#F5EEFF',
  Nutrition: '#FFF0F7',
  Childcare: '#FFFBEB',
  Utilities: '#EFF6FF',
  Financial: '#ECFDF5',
  Employment: '#EEF2FF',
  Education: '#E0F2FE',
}

// ─── Badge styles ──────────────────────────────────────────────

export const BADGE_STYLES = {
  'High Priority':   { bg: '#FEE2E2', color: '#991B1B' },
  'Urgent':          { bg: '#F3E8FF', color: '#6B21A8' },
  'Recommended':     { bg: '#E0F2FE', color: '#075985' },
  'Seasonal':        { bg: '#DBEAFE', color: '#1E40AF' },
  'Tax Benefit':     { bg: '#D1FAE5', color: '#065F46' },
  'Time-Sensitive':  { bg: '#FEF3C7', color: '#92400E' },
}

// ─── Quick-search chips ────────────────────────────────────────

export const QUICK_CHIPS = [
  'Food & Groceries',
  'Health Insurance',
  'Housing Help',
  'Childcare',
  'Cash Assistance',
  'Utility Bills',
]

// ─── Mock / demo data (shown before a real profile is set up) ──

export const MOCK_PROFILE = {
  name: 'Maria Rodriguez',
  initials: 'MR',
  age: 34,
  location: 'West Farms, Bronx NY 10460',
  household: 3,
  children: 2,
  income: '$18,500 / yr',
  status: 'Recently Unemployed',
  ethnicity: 'Hispanic / Latina',
  language: 'Spanish (primary)',
  housing: 'Renting — behind on payments',
  insurance: 'Uninsured',
}

export const MOCK_PROGRAMS = [
  {
    id: 1,
    name: 'SNAP Benefits',
    fullName: 'Supplemental Nutrition Assistance Program',
    category: 'Food',
    Icon: FastfoodIcon,
    color: '#E85D04',
    bg: '#FFF4EE',
    badge: 'High Priority',
    eligibility: 98,
    summary:
      "Household of 3 earning $18,500/yr falls well below SNAP's 130% poverty threshold (~$30,000). With 2 dependent children, estimated monthly benefit of up to $740 loaded onto an EBT card.",
    nextStep:
      'Apply online via ACCESS HRA — takes ~20 min. Bring ID, proof of income, and a utility bill.',
    url: 'https://a069-access.nyc.gov/accesshra/',
    deadline: null,
    savings: '$740 / mo',
  },
  {
    id: 2,
    name: 'Medicaid',
    fullName: 'Free Health Insurance for Families',
    category: 'Health',
    Icon: LocalHospitalIcon,
    color: '#0077B6',
    bg: '#EEF7FC',
    badge: 'High Priority',
    eligibility: 99,
    summary:
      'Family of 3 earning under $33,000/yr qualifies for full Medicaid — zero premiums, zero copays. Covers doctor visits, dental, vision, prescriptions, and mental health for all members.',
    nextStep:
      'Apply at NY State of Health or walk into the nearest HRA office with ID and proof of income.',
    url: 'https://nystateofhealth.ny.gov/',
    deadline: null,
    savings: '$0 premiums',
  },
  {
    id: 3,
    name: 'Emergency Rental Assistance',
    fullName: 'NYC One Shot Deal / HRA Emergency Assistance',
    category: 'Housing',
    Icon: HomeIcon,
    color: '#7B2FBE',
    bg: '#F5EEFF',
    badge: 'Urgent',
    eligibility: 95,
    summary:
      'Behind on rent and earning below 80% AMI qualifies for emergency rental assistance covering back-owed rent.',
    nextStep:
      'Apply through HRA ACCESS or visit your local HRA Job Center. Bring lease, landlord info, and proof of income.',
    url: 'https://www.nyc.gov/site/hra/help/emergency-rental-assistance-program.page',
    deadline: 'Apply ASAP',
    savings: 'Up to $18,000',
  },
  {
    id: 4,
    name: 'WIC Program',
    fullName: 'Women, Infants & Children Nutrition',
    category: 'Nutrition',
    Icon: ChildCareIcon,
    color: '#C0006A',
    bg: '#FFF0F7',
    badge: 'Recommended',
    eligibility: 90,
    summary:
      'Provides monthly grocery benefits, formula, and free nutrition counseling. Income within 185% FPL qualifies. Covers children up to age 5.',
    nextStep: 'Find a WIC clinic or call 1-800-522-5006 to schedule an appointment.',
    url: 'https://www.health.ny.gov/prevention/nutrition/wic/',
    deadline: null,
    savings: '$60 / mo',
  },
  {
    id: 5,
    name: 'Child Care Voucher',
    fullName: 'ACS Child Care Subsidy Program',
    category: 'Childcare',
    Icon: SchoolIcon,
    color: '#B45309',
    bg: '#FFFBEB',
    badge: 'Recommended',
    eligibility: 88,
    summary:
      'NYC ACS subsidies cover up to 90% of daycare and after-school costs for children under 13 whose parent is working or in job training.',
    nextStep: 'Apply at the nearest ACS Child Care office or call 311.',
    url: 'https://www.nyc.gov/site/acs/early-care/child-care-subsidies.page',
    deadline: null,
    savings: 'Up to $1,200 / mo',
  },
  {
    id: 6,
    name: 'HEAP — Utility Assistance',
    fullName: 'Home Energy Assistance Program',
    category: 'Utilities',
    Icon: ElectricBoltIcon,
    color: '#1D4ED8',
    bg: '#EFF6FF',
    badge: 'Seasonal',
    eligibility: 92,
    summary:
      'Receive $300–$850 toward heating and utility bills each winter season if household income is under the HEAP limit.',
    nextStep:
      'Apply at an HRA Benefits Access Center or call 311. Applications open November through March.',
    url: 'https://www.nyc.gov/site/hra/help/heap.page',
    deadline: 'Nov – Mar season',
    savings: 'Up to $850',
  },
  {
    id: 7,
    name: 'Earned Income Tax Credit',
    fullName: 'Federal + NYC EITC Refund',
    category: 'Financial',
    Icon: AttachMoneyIcon,
    color: '#047857',
    bg: '#ECFDF5',
    badge: 'Tax Benefit',
    eligibility: 97,
    summary:
      'With 2 children and earned income under $30,000, qualifies for a combined federal + NYC EITC refund of up to $7,500. Fully refundable.',
    nextStep:
      'File taxes free through NYC Free Tax Prep (VITA sites). Call 311 or visit nyc.gov/taxprep to find a site.',
    url: 'https://www.nyc.gov/site/dca/consumers/file-your-taxes.page',
    deadline: 'April 15 deadline',
    savings: 'Up to $7,500 / yr',
  },
  {
    id: 8,
    name: 'Unemployment Insurance',
    fullName: 'NY State Unemployment Insurance',
    category: 'Employment',
    Icon: WorkIcon,
    color: '#4338CA',
    bg: '#EEF2FF',
    badge: 'Time-Sensitive',
    eligibility: 85,
    summary:
      'Recently laid off workers are eligible for up to $504/week in NY unemployment benefits for up to 26 weeks while seeking new employment.',
    nextStep:
      'File a claim online at the NY DOL site or call 1-888-209-8124. Apply within 30 days of job loss.',
    url: 'https://applications.labor.ny.gov/IndividualReg/',
    deadline: 'Apply within 30 days',
    savings: 'Up to $504 / wk',
  },
]
