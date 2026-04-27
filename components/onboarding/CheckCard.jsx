'use client'
import { Box, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export function CheckCard({ label, checked, onChange }) {
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
