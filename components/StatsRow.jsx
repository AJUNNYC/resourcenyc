'use client'
import { Box, Card, CardContent, Typography } from '@mui/material'

// ─── StatsRow ──────────────────────────────────────────────────
// The four summary stat cards across the top of the dashboard.
// Receives a `stats` array: [{ label, value, Icon, color, bg }, ...]

export function StatsRow({ stats }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
      {stats.map(({ label, value, Icon, color, bg }, i) => (
        <Card
          key={label}
          elevation={0}
          sx={{
            border: '1px solid #E8ECEF',
            borderRadius: '14px',
            backgroundColor: '#fff',
            transition: 'transform 0.22s ease, box-shadow 0.22s ease',
            '@keyframes statFadeUp': {
              from: { opacity: 0, transform: 'translateY(12px)' },
              to:   { opacity: 1, transform: 'translateY(0)' },
            },
            animation: 'statFadeUp 0.4s ease both',
            animationDelay: `${i * 70}ms`,
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 28px rgba(0,0,0,0.08)' },
            '&:hover .stat-icon': {
              '@keyframes statPop': {
                '0%':   { transform: 'scale(1) rotate(0deg)' },
                '40%':  { transform: 'scale(1.3) rotate(-10deg)' },
                '70%':  { transform: 'scale(1.1) rotate(5deg)' },
                '100%': { transform: 'scale(1) rotate(0deg)' },
              },
              animation: 'statPop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
            },
          }}
        >
          <CardContent sx={{ p: '18px 20px 16px' }}>
            <Box
              sx={{
                width: 38, height: 38, borderRadius: '10px',
                backgroundColor: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mb: 1.5,
              }}
            >
              <Icon className="stat-icon" sx={{ color, fontSize: 20 }} />
            </Box>
            <Typography
              sx={{
                fontSize: 24, fontWeight: 800, color: '#0F172A',
                lineHeight: 1, letterSpacing: -0.5, mb: 0.4,
              }}
            >
              {value}
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
              {label}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
