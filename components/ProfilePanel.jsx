'use client'
import {
  Box, Card, CardContent, Typography,
  Avatar, Divider, Button,
} from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Link from 'next/link'
import { ProfileRow } from './ProgramCard'
import { MOCK_PROFILE } from '@/lib/constants'

// ─── ProfilePanel ──────────────────────────────────────────────
// Sticky left sidebar on the main dashboard showing user profile
// details, match score, and urgency callout.

export function ProfilePanel({
  displayName,
  initials,
  profileDisplay,
  avgEligibility,
  matchCount,
  whySummary,
  urgentCallout,
  hasRealData,
}) {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #E8ECEF',
        borderRadius: '16px',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 80,
      }}
    >
      <CardContent sx={{ p: '20px 22px 20px' }}>

        {/* Avatar + name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Avatar
            sx={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #E85D04, #FF8C00)',
              fontWeight: 800, fontSize: 15, flexShrink: 0,
            }}
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

        {/* Match score banner */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #001F52, #003087)',
            borderRadius: '12px', px: 2, py: 1.5, mb: 2.5,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 10.5, color: '#7FA8D4', fontWeight: 600, letterSpacing: 0.4, mb: 0.3 }}>
              PROFILE MATCH
            </Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: -1 }}>
              {avgEligibility}%
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 10.5, color: '#7FA8D4', fontWeight: 600, letterSpacing: 0.4, mb: 0.3 }}>
              MATCHED
            </Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: -1 }}>
              {matchCount}
            </Typography>
          </Box>
        </Box>

        {/* Profile rows */}
        <Box sx={{ mb: 2 }}>
          <ProfileRow label="Location"   value={profileDisplay?.location   || MOCK_PROFILE.location} />
          <ProfileRow label="Household"  value={profileDisplay?.household  || `${MOCK_PROFILE.household} people (${MOCK_PROFILE.children} children)`} />
          <ProfileRow label="Income"     value={profileDisplay?.income     || MOCK_PROFILE.income} />
          <ProfileRow label="Employment" value={profileDisplay?.status     || MOCK_PROFILE.status} />
          <ProfileRow label="Housing"    value={profileDisplay?.housing    || MOCK_PROFILE.housing} />
          <ProfileRow label="Insurance"  value={profileDisplay?.insurance  || MOCK_PROFILE.insurance} />
          <ProfileRow label="Language"   value={profileDisplay?.language   || MOCK_PROFILE.language} />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Why these programs */}
        <Typography sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, letterSpacing: 0.4, mb: 0.75 }}>
          WHY THESE PROGRAMS
        </Typography>
        <Typography sx={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.65, mb: 2 }}>
          {whySummary}
        </Typography>

        {/* Urgency callout */}
        <Box
          sx={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '10px',
            p: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.5 }}>
            <WarningAmberIcon sx={{ fontSize: 14, color: '#D97706' }} />
            <Typography sx={{ fontSize: 11.5, color: '#D97706', fontWeight: 700 }}>
              Urgent: Apply first
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 12, color: '#92400E', lineHeight: 1.55 }}>
            {urgentCallout}
          </Typography>
        </Box>

        {/* Update profile link (only shown when real data is present) */}
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
  )
}
