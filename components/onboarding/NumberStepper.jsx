'use client'
import { Box, Typography, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

export function NumberStepper({ label, sublabel, value, onChange, min = 0, max = 10 }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.75,
        borderBottom: '1px solid #F1F5F9',
      }}
    >
      <Box>
        <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: '#0F172A' }}>{label}</Typography>
        {sublabel && (
          <Typography sx={{ fontSize: 12, color: '#94A3B8', mt: 0.2 }}>{sublabel}</Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton
          size="small"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          sx={{
            width: 34, height: 34,
            border: '1.5px solid #E5E7EB',
            borderRadius: '8px', p: 0,
            '&:disabled': { opacity: 0.3 },
            '&:hover:not(:disabled)': { borderColor: '#003087', backgroundColor: '#EEF4FF' },
          }}
        >
          <RemoveIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#0F172A', minWidth: 32, textAlign: 'center', lineHeight: 1 }}>
          {value}
        </Typography>
        <IconButton
          size="small"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          sx={{
            width: 34, height: 34,
            border: '1.5px solid #E5E7EB',
            borderRadius: '8px', p: 0,
            '&:disabled': { opacity: 0.3 },
            '&:hover:not(:disabled)': { borderColor: '#003087', backgroundColor: '#EEF4FF' },
          }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  )
}
