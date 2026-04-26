'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, CircularProgress, Typography } from '@mui/material'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    if (!supabase) {
      router.push('/onboarding')
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/onboarding')
      } else {
        router.push('/signup')
      }
    })
  }, [router])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #00112B 0%, #001F52 50%, #003087 100%)',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#fff', mb: 2 }} />
        <Typography sx={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>
          Signing you in…
        </Typography>
      </Box>
    </Box>
  )
}
