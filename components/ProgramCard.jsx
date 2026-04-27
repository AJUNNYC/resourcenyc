'use client'
import { useState } from 'react'
import {
  Box, Typography, Card, CardContent, Chip,
  LinearProgress, Button,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { BADGE_STYLES } from '@/lib/constants'

// ─── ProfileRow ────────────────────────────────────────────────
// A single label/value row used inside ProfilePanel.

export function ProfileRow({ label, value }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        py: 0.85,
        borderBottom: '1px solid #F1F5F9',
      }}
    >
      <Typography sx={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 12,
          color: '#1E293B',
          fontWeight: 600,
          textAlign: 'right',
          ml: 1.5,
          lineHeight: 1.4,
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

// ─── ProgramCard ───────────────────────────────────────────────
// Displays a single matched benefit program with eligibility bar,
// savings estimate, summary, and expandable "how to apply" section.

export function ProgramCard({ program, index }) {
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
          to:   { opacity: 1, transform: 'translateY(0)' },
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
            '0%':   { transform: 'scale(1) translateY(0)' },
            '35%':  { transform: 'scale(1.18) translateY(-6px)' },
            '65%':  { transform: 'scale(1.08) translateY(-2px)' },
            '100%': { transform: 'scale(1) translateY(0)' },
          },
          animation: 'iconBounce 0.55s cubic-bezier(0.34,1.56,0.64,1)',
        },
      }}
    >
      <CardContent sx={{ p: '20px 22px 18px' }}>

        {/* Header row: icon, name, badge */}
        <Box sx={{ display: 'flex', gap: 1.75, mb: 1.75, alignItems: 'flex-start' }}>
          <Box
            className="card-icon"
            sx={{
              width: 46, height: 46, borderRadius: '12px',
              backgroundColor: program.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
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
            sx={{
              backgroundColor: badge.bg, color: badge.color,
              fontWeight: 700, fontSize: 10, height: 20,
              borderRadius: '6px', flexShrink: 0, mt: 0.25,
            }}
          />
        </Box>

        {/* Eligibility bar */}
        <Box sx={{ mb: 1.75 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
            <Typography sx={{ fontSize: 11, color: '#64748B', fontWeight: 600, letterSpacing: 0.3 }}>
              ELIGIBILITY MATCH
            </Typography>
            <Typography sx={{ fontSize: 11, color: program.color, fontWeight: 800 }}>
              {program.eligibility}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={program.eligibility}
            sx={{
              height: 5, borderRadius: 99, backgroundColor: '#F1F5F9',
              '& .MuiLinearProgress-bar': {
                borderRadius: 99,
                background: `linear-gradient(90deg, ${program.color}bb, ${program.color})`,
              },
            }}
          />
        </Box>

        {/* Savings chip */}
        <Box sx={{ mb: 1.75 }}>
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.5,
              backgroundColor: program.bg, borderRadius: '8px', px: 1.25, py: 0.4,
            }}
          >
            <Typography sx={{ fontSize: 12, color: program.color, fontWeight: 700 }}>
              {program.savings}
            </Typography>
          </Box>
        </Box>

        {/* Summary */}
        <Typography sx={{ fontSize: 13, color: '#475569', lineHeight: 1.7, mb: 1.75 }}>
          {program.summary}
        </Typography>

        {/* Expandable "how to apply" */}
        {open && (
          <Box
            sx={{
              backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
              borderRadius: '10px', p: 1.5, mb: 1.75,
              '@keyframes slideDown': {
                from: { opacity: 0, transform: 'translateY(-8px)' },
                to:   { opacity: 1, transform: 'translateY(0)' },
              },
              animation: 'slideDown 0.2s ease',
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#003087', mb: 0.5, letterSpacing: 0.3 }}>
              NEXT STEP
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: '#475569', lineHeight: 1.65 }}>
              {program.nextStep}
            </Typography>
            {program.deadline && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                <WarningAmberIcon sx={{ fontSize: 13, color: '#D97706' }} />
                <Typography sx={{ fontSize: 11.5, color: '#D97706', fontWeight: 700 }}>
                  {program.deadline}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Footer: expand toggle + apply button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            onClick={() => setOpen(v => !v)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.4,
              cursor: 'pointer', opacity: 0.6,
              transition: 'opacity 0.15s', '&:hover': { opacity: 1 },
            }}
          >
            {open
              ? <ExpandLessIcon sx={{ fontSize: 16, color: '#64748B' }} />
              : <ExpandMoreIcon sx={{ fontSize: 16, color: '#64748B' }} />}
            <Typography sx={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
              {open ? 'Less' : 'How to apply'}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Button
            size="small"
            href={program.url}
            target="_blank"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />}
            sx={{
              backgroundColor: program.color, color: '#fff',
              fontSize: 12, fontWeight: 700,
              borderRadius: '9px', px: 1.5, py: 0.55,
              textTransform: 'none', boxShadow: 'none', minWidth: 0,
              transition: 'filter 0.15s, transform 0.15s',
              '&:hover': {
                backgroundColor: program.color,
                filter: 'brightness(0.85)',
                transform: 'scale(1.04)',
                boxShadow: 'none',
              },
            }}
          >
            Apply
          </Button>
        </Box>

      </CardContent>
    </Card>
  )
}
