'use client'
import { Box, Typography } from '@mui/material'

export function PillOption({ label, active, onClick }) {
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
