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
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import GoogleIcon from '@mui/icons-material/Google'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const LEFT_STATS = [
  { value: '2.2M', label: 'New Yorkers living in poverty' },
  { value: '100+', label: 'free city & state programs available' },
  { value: '35%', label: 'food insecurity in West Farms, Bronx' },
]

const BENEFITS = [
  'Matched to programs in under 60 seconds',
  'Works in Spanish, English, and 8 other languages',
  'Upload documents to unlock more matches',
  'Always free — no ads, no upsells',
]

function Field({ label, type = 'text', placeholder, value, onChange, rightEl }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#374151', mb: 0.75, letterSpacing: 0.1 }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          border: '1.5px solid #E5E7EB',
          borderRadius: '11px',
          px: 1.75,
          py: 0.25,
          backgroundColor: '#FAFAFA',
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

export default function SignUp() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', zip: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')

  function set(key) {
    return e => setForm(f => ({ ...f, [key]: e.target.value }))
  }

  function validate() {
    const e = {}
    if (!form.firstName.trim()) e.firstName = true
    if (!form.email.trim() || !form.email.includes('@')) e.email = true
    if (form.password.length < 6) e.password = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleGoogleSignIn() {
    if (!supabase) {
      setAuthError('Auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
      return
    }
    setGoogleLoading(true)
    setAuthError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setAuthError(error.message)
      setGoogleLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setAuthError('')

    if (!supabase) {
      setAuthError('Auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          zip: form.zip,
        },
      },
    })

    if (error) {
      const msg = error.message || ''
      if (msg.includes('rate limit') || msg.includes('rate exceeded') || msg.includes('email rate')) {
        setAuthError('Too many sign-up attempts. Please wait a few minutes and try again, or ask the app admin to disable email confirmation in Supabase.')
      } else if (msg === 'User already registered') {
        setAuthError('An account with this email already exists. Try logging in.')
      } else {
        setAuthError(msg)
      }
      setLoading(false)
      return
    }

    router.push('/onboarding')
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Slim top bar */}
      <Box
        sx={{
          px: 4,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
            Already have an account?
          </Typography>
          <Button
            component={Link}
            href="/login"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: 13.5,
              textTransform: 'none',
              border: '1px solid rgba(255,255,255,0.28)',
              borderRadius: '9px',
              px: 2,
              py: 0.6,
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255,255,255,0.08)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.16)' },
            }}
          >
            Log in
          </Button>
        </Box>
      </Box>

      {/* Main split */}
      <Box sx={{ flex: 1, display: 'flex', minHeight: '100vh' }}>

        {/* ── Left panel ── */}
        <Box
          sx={{
            width: { xs: '0%', md: '48%' },
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            px: 7,
            py: 8,
            background: 'linear-gradient(160deg, #00112B 0%, #001F52 50%, #003087 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative orbs */}
          <Box sx={{ position: 'absolute', top: -120, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,120,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', bottom: -100, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,47,190,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              sx={{
                fontSize: 38,
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.15,
                letterSpacing: -1,
                mb: 1.5,
              }}
            >
              Find the help<br />you deserve.
            </Typography>
            <Typography sx={{ fontSize: 15, color: '#7FA8D4', lineHeight: 1.7, mb: 5, maxWidth: 380 }}>
              NYC has over 100 free programs for food, health, housing, and more. We cut through the confusion so you can get the help you need — fast.
            </Typography>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 3, mb: 5, flexWrap: 'wrap' }}>
              {LEFT_STATS.map(({ value, label }) => (
                <Box key={value}>
                  <Typography sx={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: -1 }}>
                    {value}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#5580B0', fontWeight: 500, mt: 0.25, maxWidth: 110, lineHeight: 1.4 }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 4 }} />

            {/* Benefit list */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {BENEFITS.map(b => (
                <Box key={b} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#4ADE80', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 14, color: '#A8C4E0', lineHeight: 1.4 }}>{b}</Typography>
                </Box>
              ))}
            </Box>

            {/* Testimonial */}
            <Box
              sx={{
                mt: 5,
                p: 2.5,
                borderRadius: '14px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.09)',
              }}
            >
              <Typography sx={{ fontSize: 14, color: '#C8DEFF', lineHeight: 1.65, fontStyle: 'italic', mb: 1.5 }}>
                "I didn't know I qualified for anything. ResourceNYC found me food stamps, Medicaid for my kids, and a rental voucher in one sitting."
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #E85D04, #FF8C00)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  MR
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
                    Maria R.
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: '#5580B0' }}>
                    West Farms, Bronx
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── Right panel — form ── */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            px: { xs: 3, md: 7 },
            py: 10,
            backgroundColor: '#fff',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 420 }}>

            {/* Heading */}
            <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#0F172A', letterSpacing: -0.5, mb: 0.75 }}>
              Create your account
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#64748B', mb: 3.5, lineHeight: 1.5 }}>
              Free forever. No credit card. Start finding programs in under a minute.
            </Typography>

            {/* Google SSO */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              startIcon={googleLoading
                ? <CircularProgress size={16} sx={{ color: '#6B7280' }} />
                : <GoogleIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderColor: '#E5E7EB',
                color: '#374151',
                fontWeight: 600,
                fontSize: 14,
                textTransform: 'none',
                borderRadius: '11px',
                py: 1.1,
                mb: 2.5,
                '&:hover': { borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' },
                '&:disabled': { borderColor: '#E5E7EB', color: '#9CA3AF' },
              }}
            >
              {googleLoading ? 'Redirecting to Google…' : 'Continue with Google'}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography sx={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500, flexShrink: 0 }}>
                or sign up with email
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

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 0 }}>
                <Box>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: errors.firstName ? '#EF4444' : '#374151', mb: 0.75, letterSpacing: 0.1 }}>
                    First name {errors.firstName && '· required'}
                  </Typography>
                  <Box
                    sx={{
                      border: `1.5px solid ${errors.firstName ? '#FCA5A5' : '#E5E7EB'}`,
                      borderRadius: '11px',
                      px: 1.75,
                      py: 0.25,
                      backgroundColor: errors.firstName ? '#FFF5F5' : '#FAFAFA',
                      mb: 2,
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
                      placeholder="Maria"
                      value={form.firstName}
                      onChange={set('firstName')}
                      sx={{ fontSize: 14, color: '#111827', py: 1 }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#374151', mb: 0.75, letterSpacing: 0.1 }}>
                    Last name
                  </Typography>
                  <Box
                    sx={{
                      border: '1.5px solid #E5E7EB',
                      borderRadius: '11px',
                      px: 1.75,
                      py: 0.25,
                      backgroundColor: '#FAFAFA',
                      mb: 2,
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
                      placeholder="Rodriguez"
                      value={form.lastName}
                      onChange={set('lastName')}
                      sx={{ fontSize: 14, color: '#111827', py: 1 }}
                    />
                  </Box>
                </Box>
              </Box>

              <Field
                label={`Email address${errors.email ? ' · enter a valid email' : ''}`}
                type="email"
                placeholder="maria@example.com"
                value={form.email}
                onChange={set('email')}
              />

              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: errors.password ? '#EF4444' : '#374151', mb: 0.75, letterSpacing: 0.1 }}>
                  Password {errors.password && '· at least 6 characters'}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: `1.5px solid ${errors.password ? '#FCA5A5' : '#E5E7EB'}`,
                    borderRadius: '11px',
                    px: 1.75,
                    py: 0.25,
                    backgroundColor: errors.password ? '#FFF5F5' : '#FAFAFA',
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
                    type={showPw ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={set('password')}
                    sx={{ fontSize: 14, color: '#111827', py: 1 }}
                  />
                  <IconButton size="small" onClick={() => setShowPw(v => !v)} sx={{ color: '#9CA3AF', mr: -0.5 }}>
                    {showPw ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                  </IconButton>
                </Box>
              </Box>

              <Field
                label="ZIP code (optional — helps find local programs)"
                placeholder="e.g. 10460"
                value={form.zip}
                onChange={set('zip')}
              />

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                endIcon={loading ? <CircularProgress size={16} sx={{ color: 'rgba(255,255,255,0.7)' }} /> : <ArrowForwardIcon sx={{ fontSize: 17 }} />}
                sx={{
                  mt: 0.5,
                  background: loading ? '#94A3B8' : 'linear-gradient(135deg, #003087, #0055CC)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: 'none',
                  borderRadius: '12px',
                  py: 1.35,
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(0,48,135,0.28)',
                  transition: 'filter 0.15s, transform 0.15s, box-shadow 0.15s',
                  '&:hover': loading ? {} : {
                    filter: 'brightness(1.1)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 28px rgba(0,48,135,0.36)',
                    background: 'linear-gradient(135deg, #003087, #0055CC)',
                  },
                  '&:active': { transform: 'translateY(0)' },
                }}
              >
                {loading ? 'Creating your account…' : 'Create free account'}
              </Button>

              <Typography sx={{ fontSize: 11.5, color: '#9CA3AF', textAlign: 'center', mt: 2, lineHeight: 1.6 }}>
                By signing up you agree to our Terms of Service and Privacy Policy.
                Your data is never sold or shared.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
