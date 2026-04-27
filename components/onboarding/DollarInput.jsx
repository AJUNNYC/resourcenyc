'use client'
import { Box, Typography, InputBase } from '@mui/material'

export function DollarInput({ label, sublabel, value, onChange, placeholder = '0' }) {
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
          '&:focus-within': {
            borderColor: '#003087',
            boxShadow: '0 0 0 3px rgba(0,48,135,0.1)',
            backgroundColor: '#fff',
          },
        }}
      >
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#94A3B8', mr: 0.5 }}>$</Typography>
        <InputBase
          fullWidth
          type="number"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          inputProps={{ min: 0 }}
          sx={{ fontSize: 15, color: '#0F172A', py: 1.1 }}
        />
      </Box>
    </Box>
  )
}
