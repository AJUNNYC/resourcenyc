'use client'
import { Box, Typography } from '@mui/material'

export function SelectCard({ label, icon: Icon, value, selected, onSelect }) {
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
          width: 42, height: 42, borderRadius: '10px',
          backgroundColor: selected ? '#003087' : '#E8ECEF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
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
