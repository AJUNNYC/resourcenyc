'use client'
import { useState, useEffect } from 'react'
import { Box, Typography, Avatar, Button, Divider, CircularProgress } from '@mui/material'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import LogoutIcon from '@mui/icons-material/Logout'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', Icon: DashboardIcon },
  { label: 'Find Programs', href: '/intake', Icon: AutoAwesomeIcon },
  { label: 'Saved Programs', href: '/saved', Icon: BookmarkIcon, disabled: true },
]

function NavItem({ label, href, Icon, active, disabled }) {
  return (
    <Box
      component={disabled ? 'div' : Link}
      href={disabled ? undefined : href}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 1.5,
        py: 1,
        borderRadius: '10px',
        cursor: disabled ? 'default' : 'pointer',
        textDecoration: 'none',
        backgroundColor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
        opacity: disabled ? 0.4 : 1,
        transition: 'background-color 0.15s',
        '&:hover': disabled ? {} : {
          backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
        },
      }}
    >
      <Box
        sx={{
          width: 32, height: 32, borderRadius: '8px',
          backgroundColor: active ? 'rgba(255,255,255,0.14)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transition: 'background-color 0.15s',
        }}
      >
        <Icon sx={{ fontSize: 18, color: active ? '#fff' : 'rgba(255,255,255,0.5)' }} />
      </Box>
      <Typography sx={{ fontSize: 13.5, fontWeight: active ? 700 : 500, color: active ? '#fff' : 'rgba(255,255,255,0.55)', letterSpacing: -0.1 }}>
        {label}
      </Typography>
      {disabled && (
        <Box sx={{ ml: 'auto', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '5px', px: 0.75, py: 0.2 }}>
          <Typography sx={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: 0.3 }}>SOON</Typography>
        </Box>
      )}
    </Box>
  )
}

export function SideNav() {
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()
  const [localFirstName, setLocalFirstName] = useState('')

  const [localName, setLocalName] = useState({ first: '', last: '' })

  useEffect(() => {
    try {
      const p = localStorage.getItem('resourcenyc_profile')
      if (p) {
        const profile = JSON.parse(p)
        setLocalName({ first: profile.firstName || '', last: profile.lastName || '' })
      }
    } catch {}
  }, [])

  const firstName = user?.user_metadata?.first_name || localName.first
  const lastName = user?.user_metadata?.last_name || localName.last
  const displayName = firstName
    ? `${firstName} ${lastName}`.trim()
    : user?.email || ''
  const initials = firstName
    ? `${firstName[0]}${lastName[0] || ''}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        background: 'linear-gradient(180deg, #00112B 0%, #001A3D 60%, #002355 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2.5, pt: 3, pb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'linear-gradient(135deg, #003087, #0055CC)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0,48,135,0.45)',
            }}
          >
            <LocationCityIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 15.5, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: -0.3 }}>
              ResourceNYC
            </Typography>
            <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.32)', lineHeight: 1.3, fontWeight: 500 }}>
              Benefit Navigator
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 2 }} />

      {/* Nav items */}
      <Box sx={{ px: 1.5, py: 2.5, flex: 1 }}>
        <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.28)', letterSpacing: 0.9, px: 1.5, mb: 1.25 }}>
          MAIN MENU
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {NAV_ITEMS.map(item => (
            <NavItem
              key={item.href}
              {...item}
              active={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 2 }} />

      {/* User section */}
      <Box sx={{ px: 2, py: 2.5 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
            <CircularProgress size={20} sx={{ color: 'rgba(255,255,255,0.25)' }} />
          </Box>
        ) : user ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
              <Avatar
                sx={{
                  width: 34, height: 34,
                  background: 'linear-gradient(135deg, #E85D04, #FF8C00)',
                  fontSize: 12, fontWeight: 800, flexShrink: 0,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.15,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  {displayName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 10.5, color: 'rgba(255,255,255,0.35)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  {user.email}
                </Typography>
              </Box>
            </Box>
            <Box
              onClick={signOut}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 1.5, py: 0.85, borderRadius: '9px', cursor: 'pointer',
                backgroundColor: 'rgba(255,255,255,0.05)',
                transition: 'background-color 0.15s',
                '&:hover': { backgroundColor: 'rgba(239,68,68,0.15)' },
              }}
            >
              <LogoutIcon sx={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }} />
              <Typography sx={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                Sign out
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              component={Link}
              href="/login"
              fullWidth
              sx={{
                backgroundColor: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 600, fontSize: 13, textTransform: 'none',
                borderRadius: '9px', py: 0.8,
                border: '1px solid rgba(255,255,255,0.1)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
              }}
            >
              Log in
            </Button>
            <Button
              component={Link}
              href="/signup"
              fullWidth
              sx={{
                background: 'linear-gradient(135deg, #003087, #0055CC)',
                color: '#fff',
                fontWeight: 700, fontSize: 13, textTransform: 'none',
                borderRadius: '9px', py: 0.8,
                boxShadow: '0 2px 12px rgba(0,48,135,0.4)',
                '&:hover': { background: 'linear-gradient(135deg, #00215e, #003fa3)' },
              }}
            >
              Sign up free
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
