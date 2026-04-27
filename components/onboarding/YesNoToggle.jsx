'use client'
import { Box, Typography } from '@mui/material'

export function YesNoToggle({ label, value, onChange }) {
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
