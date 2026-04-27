'use client'
import { useState, useEffect } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const STAGES = [
  'Reading your profile…',
  'Checking income eligibility…',
  'Searching 100+ NYC programs…',
  'Ranking your best matches…',
  'Preparing your dashboard…',
]

export function LoadingScreen({ profile }) {
  const [stageIdx, setStageIdx] = useState(0)

  useEffect(() => {
    if (stageIdx < STAGES.length - 1) {
      const t = setTimeout(() => setStageIdx(i => i + 1), 1300)
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
            '0%, 100%': { transform: 'scale(1)',    boxShadow: '0 0 0 0 rgba(0,48,135,0.3)' },
            '50%':       { transform: 'scale(1.07)', boxShadow: '0 0 0 14px rgba(0,48,135,0)' },
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
        {STAGES.map((stage, i) => (
          <Box
            key={stage}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.5, py: 0.85,
              opacity: i <= stageIdx ? 1 : 0.3,
              transition: 'opacity 0.4s ease',
            }}
          >
            <Box sx={{ flexShrink: 0, width: 18, display: 'flex', justifyContent: 'center' }}>
              {i < stageIdx
                ? <CheckCircleIcon sx={{ fontSize: 16, color: '#059669' }} />
                : i === stageIdx
                  ? <CircularProgress size={14} sx={{ color: '#003087' }} />
                  : <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #CBD5E1', mx: 'auto' }} />
              }
            </Box>
            <Typography
              sx={{
                fontSize: 13.5,
                color: i <= stageIdx ? '#0F172A' : '#94A3B8',
                fontWeight: i === stageIdx ? 600 : 400,
              }}
            >
              {stage}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
