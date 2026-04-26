'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box, Typography, Button, InputBase, IconButton,
  Divider, CircularProgress,
} from '@mui/material'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import GoogleIcon from '@mui/icons-material/Google'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const PERKS = [
  'Your matched programs saved to your profile',
  'Track application status across programs',
  'Get notified when new programs open',
  'Pick up right where you left off',
]

function Field({ label, type = 'text', placeholder, value, onChange, error, rightEl }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: error ? '#EF4444' : '#374151', mb: 0.75, letterSpacing: 0.1 }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          border: `1.5px solid ${error ? '#FCA5A5' : '#E5E7EB'}`,
          borderRadius: '11px',
          px: 1.75,
          py: 0.25,
          backgroundColor: error ? '#FFF5F5' : '#FAFAFA',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          '&:focus-within': {
            borderColor: '#003087',
            boxShadow: '0 0 0 3px rgba(0,48,135,0.1)',
            backgroundColor: '#fff',
          },
        }}
      >
        <InputBase
          fullWidth
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          sx={{ fontSize: 14, color: '#111827', py: 1, '& ::placeholder': { color: '#9CA3AF', opacity: 1 } }}
        />
        {rightEl}
      </Box>
    </Box>
  )
}

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')

  function validate() {
    const e = {}
    if (!email.trim() || !email.includes('@')) e.email = true
    if (!password) e.password = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setAuthError('')

    if (!supabase) {
      setAuthError('Auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setAuthError(error.message === 'Invalid login credentials'
        ? 'Incorrect email or password. Please try again.'
        : error.message)
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <Box
        sx={{
          px: 4, py: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        }}
      >
        <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
          <Box
            sx={{
              width: 30, height: 30, borderRadius: '8px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <LocationCityIcon sx={{ color: '#fff', fontSize: 17 }} />
          </Box>
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>
            ResourceNYC
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)' }}>
            Don't have an account?
          </Typography>
          <Button
            component={Link}
            href="/signup"
            sx={{
              color: '#fff', fontWeight: 700, fontSize: 13.5, textTransform: 'none',
              border: '1px solid rgba(255,255,255,0.28)', borderRadius: '9px',
              px: 2, py: 0.6,
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255,255,255,0.08)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.16)' },
            }}
          >
            Sign up free
          </Button>
        </Box>
      </Box>

      {/* Split layout */}
      <Box sx={{ flex: 1, display: 'flex', minHeight: '100vh' }}>

        {/* Left panel */}
        <Box
          sx={{
            width: { xs: '0%', md: '48%' },
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            px: 7, py: 8,
            background: 'linear-gradient(160deg, #00112B 0%, #001F52 50%, #003087 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', top: -120, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,120,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', bottom: -100, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,47,190,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              sx={{
                fontSize: 38, fontWeight: 900, color: '#fff',
                lineHeight: 1.15, letterSpacing: -1, mb: 1.5,
              }}
            >
              Welcome<br />back.
            </Typography>
            <Typography sx={{ fontSize: 15, color: '#7FA8D4', lineHeight: 1.7, mb: 5, maxWidth: 360 }}>
              Pick up right where you left off. Your matched programs and saved progress are waiting.
            </Typography>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 4 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
              {PERKS.map(p => (
                <Box key={p} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#4ADE80', flexShrink: 0, mt: 0.15 }} />
                  <Typography sx={{ fontSize: 14, color: '#A8C4E0', lineHeight: 1.5 }}>{p}</Typography>
                </Box>
              ))}
            </Box>

            {/* Returning user card */}
            <Box
              sx={{
                mt: 5, p: 2.5, borderRadius: '14px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.09)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #E85D04, #FF8C00)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0,
                  }}
                >
                  MR
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
                    Maria R.
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: '#5580B0' }}>
                    8 programs matched · Last active today
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['SNAP', 'Medicaid', 'Rental Assist.', '+5 more'].map(tag => (
                  <Box
                    key={tag}
                    sx={{
                      px: 1.25, py: 0.35,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '6px',
                    }}
                  >
                    <Typography sx={{ fontSize: 11.5, color: '#7FA8D4', fontWeight: 600 }}>{tag}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right panel — form */}
        <Box
          sx={{
            flex: 1,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            px: { xs: 3, md: 7 }, py: 10,
            backgroundColor: '#fff',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>

            <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#0F172A', letterSpacing: -0.5, mb: 0.75 }}>
              Log in to your account
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#64748B', mb: 3.5, lineHeight: 1.5 }}>
              Enter your email and password to continue.
            </Typography>

            {/* Google SSO */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon sx={{ fontSize: 18 }} />}
              disabled={loading}
              sx={{
                borderColor: '#E5E7EB', color: '#374151',
                fontWeight: 600, fontSize: 14, textTransform: 'none',
                borderRadius: '11px', py: 1.1, mb: 2.5,
                '&:hover': { borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' },
              }}
            >
              Continue with Google
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography sx={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500, flexShrink: 0 }}>
                or continue with email
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            {/* Auth error */}
            {authError && (
              <Box
                sx={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '10px',
                  px: 2, py: 1.25, mb: 2.5,
                }}
              >
                <Typography sx={{ fontSize: 13.5, color: '#991B1B' }}>{authError}</Typography>
              </Box>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Field
                label={errors.email ? 'Email address · enter a valid email' : 'Email address'}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={errors.email}
              />

              <Field
                label={errors.password ? 'Password · required' : 'Password'}
                type={showPw ? 'text' : 'password'}
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={errors.password}
                rightEl={
                  <IconButton size="small" onClick={() => setShowPw(v => !v)} sx={{ color: '#9CA3AF', mr: -0.5 }}>
                    {showPw ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                  </IconButton>
                }
              />

              {/* Forgot password */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1, mb: 2.5 }}>
                <Typography
                  sx={{ fontSize: 12.5, color: '#003087', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  Forgot password?
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                endIcon={loading ? <CircularProgress size={16} sx={{ color: 'rgba(255,255,255,0.7)' }} /> : <ArrowForwardIcon sx={{ fontSize: 17 }} />}
                sx={{
                  background: loading ? '#94A3B8' : 'linear-gradient(135deg, #003087, #0055CC)',
                  color: '#fff',
                  fontWeight: 700, fontSize: 15, textTransform: 'none',
                  borderRadius: '12px', py: 1.35,
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(0,48,135,0.28)',
                  transition: 'filter 0.15s, transform 0.15s, box-shadow 0.15s',
                  '&:hover': loading ? {} : {
                    filter: 'brightness(1.1)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 28px rgba(0,48,135,0.36)',
                    background: 'linear-gradient(135deg, #003087, #0055CC)',
                  },
                  '&:active': { transform: 'translateY(0)' },
                  '&.Mui-disabled': { color: '#fff' },
                }}
              >
                {loading ? 'Signing you in…' : 'Log in'}
              </Button>

              <Typography sx={{ fontSize: 13, color: '#64748B', textAlign: 'center', mt: 2.5 }}>
                Don't have an account?{' '}
                <Box
                  component={Link}
                  href="/signup"
                  sx={{ color: '#003087', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Sign up free
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
