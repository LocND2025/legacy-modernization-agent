import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import type { SelectChangeEvent } from '@mui/material/Select'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useState } from 'react'

export interface SessionHeaderBarProps {
  session?: {
    name: string
    tech: string
    statusLabel: string
    updatedLabel: string
    owner: string
  }
}

export function SessionHeaderBar({ session }: SessionHeaderBarProps) {
  const [language, setLanguage] = useState('jp')

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value)
  }

  const title = session?.name ?? 'Cobol sample'
  const tech = session?.tech ?? 'IBM ZOS ENTERPRISE COBOL'
  const statusLabel = session?.statusLabel ?? 'Active'
  const updatedLabel = session?.updatedLabel ?? 'Updated 3 min ago'
  const owner = session?.owner ?? 'You'

  return (
    <Box
      sx={{
        px: 3,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--glass-border)',
        backgroundColor: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        position: 'relative',
        transition: 'background-color 0.3s ease, border-color 0.2s ease',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: -2,
          backgroundImage:
            'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 10%, var(--accent-gradient) 55%, rgba(0,0,0,0) 100%)',
          opacity: 0.22,
          filter: 'blur(22px) saturate(120%)',
          transform: 'translateY(-8px)',
          pointerEvents: 'none',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(900px 140px at 18% 0%, rgba(168,85,247,0.22) 0%, transparent 70%), radial-gradient(900px 160px at 78% 0%, rgba(37,99,235,0.20) 0%, transparent 72%)',
          opacity: 0.55,
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
        {/* Session avatar */}
        <Avatar
          sx={{
            width: 34,
            height: 34,
            backgroundImage: 'var(--accent-gradient)',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--on-accent)',
            boxShadow: 'var(--glass-glow)',
          }}
        >
          {title.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}
            >
              {title}
            </Typography>
            {/* Tech badge */}
            <Box
              sx={{
                px: 1.25,
                py: 0.25,
                borderRadius: 999,
                bgcolor: 'var(--glass-bg)',
                border: '1px solid transparent',
                backgroundImage:
                  'linear-gradient(var(--glass-bg), var(--glass-bg)), var(--accent-gradient)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: 'var(--glass-inset-highlight-subtle)',
              }}
            >
              <Typography
                sx={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: 'var(--accent)',
                  letterSpacing: 0.4,
                  lineHeight: 1,
                }}
              >
                {tech}
              </Typography>
            </Box>
          </Box>

          {/* Meta row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Pulsing active dot */}
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'var(--success)',
                boxShadow: '0 0 6px var(--success-border)',
                animation: 'pulse-dot 2s ease-in-out infinite',
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{ fontSize: 11.5, color: 'var(--text-secondary)', fontWeight: 500 }}
            >
              {statusLabel}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'var(--border)', mx: 0.25 }}>
              ·
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
              {updatedLabel}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'var(--border)', mx: 0.25 }}>
              ·
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
              Owner: {owner}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Language selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
        <Typography
          variant="body2"
          sx={{ color: 'var(--text-secondary)', fontSize: 12 }}
        >
          Language
        </Typography>
        <Select
          size="small"
          value={language}
          onChange={handleLanguageChange}
          IconComponent={KeyboardArrowDownIcon}
          sx={{
            minWidth: 140,
            borderRadius: 999,
            bgcolor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'var(--glass-blur)',
            fontSize: 12.5,
            fontWeight: 500,
            color: 'var(--text-primary)',
            '& .MuiSelect-select': {
              py: 0.65,
              px: 1.75,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover': {
              borderColor: 'var(--border)',
            },
            '&.Mui-focused': {
              borderColor: 'var(--accent)',
              boxShadow: 'var(--focus-ring)',
            },
          }}
        >
          <MenuItem value="jp" sx={{ fontSize: 12.5 }}>JP Japanese</MenuItem>
          <MenuItem value="en" sx={{ fontSize: 12.5 }}>EN English</MenuItem>
          <MenuItem value="fr" sx={{ fontSize: 12.5 }}>FR French</MenuItem>
        </Select>
      </Box>
    </Box>
  )
}
