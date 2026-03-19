import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Chip,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Button,
  Stack,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import { GlobalTopNavbar } from '../workbench/components/GlobalTopNavbar'
import { getSessions, type SessionInfo } from '../../api/cobolApi'

type SessionSummary = {
  id: string
  name: string
  tech: string
  statusLabel: string
  updatedLabel: string
  owner: string
  group: 'COBOL' | 'Ungrouped'
  createdAt: string
  description: string
}

function useRevealOnScroll() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.15,
      },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

export function SessionsPage() {
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const data = await getSessions()
        if (!active) return

        setSessions(data.map(mapSessionToSummary))
      } catch (error) {
        console.error(error)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sessions
    return sessions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q),
    )
  }, [query, sessions])

  const cobol = filtered.filter((s) => s.group === 'COBOL')
  const ungrouped = filtered.filter((s) => s.group === 'Ungrouped')

  const handleOpen = (session: SessionSummary) => {
    navigate(`/dashboard/${session.id}`)
  }

  const heroReveal = useRevealOnScroll()
  const sessionsReveal = useRevealOnScroll()

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'var(--bg-base)',
        color: 'var(--text-primary)',
        '& .MuiTypography-root': {
          color: 'inherit',
        },
      }}
    >
      <GlobalTopNavbar />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          px: { xs: 2, md: 4 },
          pt: 4,
          pb: 6,
          overflowY: 'auto',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1200,
          }}
        >
          {/* Hero */}
          <Box
            ref={heroReveal.ref}
            className={`reveal ${heroReveal.visible ? 'is-visible' : ''}`}
            sx={{
              mb: 5,
              position: 'relative',
            }}
          >
            <Box
              className="glass-surface"
              sx={{
                px: { xs: 3, md: 4 },
                py: { xs: 3, md: 4 },
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
                gap: 4,
                alignItems: 'center',
              }}
            >
              <Box>
                <Chip
                  icon={<FolderOutlinedIcon />}
                  label="Sessions workspace"
                  size="small"
                  sx={{
                    mb: 1.5,
                    borderRadius: 'var(--fare-radius-pill)',
                    bgcolor: 'var(--glass-bg)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    '& .MuiChip-label': {
                      color: 'var(--text-primary)',
                    },
                    '& .MuiChip-icon': {
                      color: 'var(--text-secondary)',
                    },
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    mb: 1.5,
                    color: 'var(--text-primary)',
                  }}
                >
                  See every modernization session in one glass-clear workspace.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'var(--text-secondary)', maxWidth: 520, mb: 3 }}
                >
                  Search, resume, and compare AI-powered analysis runs across
                  COBOL and distributed systems without losing context.
                </Typography>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => navigate('/sessions/new')}
                    sx={{
                      borderRadius: 'var(--fare-radius-pill)',
                      px: 3.5,
                      py: 1,
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-base)',
                      boxShadow: 'var(--glass-shadow)',
                      '&:hover': {
                        backgroundColor: 'var(--accent-hover)',
                      },
                    }}
                    startIcon={<BoltOutlinedIcon />}
                  >
                    Start new session
                  </Button>
                  <Typography
                    variant="caption"
                    sx={{ color: 'var(--text-secondary)' }}
                  >
                    No uploads yet – try the demo COBOL workspace.
                  </Typography>
                </Stack>
              </Box>

              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 220, md: 260 },
                }}
              >
                <Box
                  className="glass-card"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 2.5,
                    transform: 'rotate(-1deg)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                      Active COBOL workspaces
                    </Typography>
                    <Chip
                      size="small"
                      label={`${sessions.length} total`}
                      sx={{
                        borderRadius: 'var(--fare-radius-pill)',
                        bgcolor: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        fontSize: 11,
                        color: 'var(--text-primary)',
                        '& .MuiChip-label': {
                          color: 'var(--text-primary)',
                        },
                      }}
                    />
                  </Box>
                  <Stack spacing={1}>
                    {sessions.slice(0, 3).map((s) => (
                      <Box
                        key={s.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: 12,
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <DescriptionOutlinedIcon
                            sx={{ fontSize: 16, color: 'var(--text-tertiary)' }}
                          />
                          <Typography variant="body2">{s.name}</Typography>
                        </Box>
                        <Typography variant="caption">{s.statusLabel}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Box>

            {/* Feature strip */}
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{ mt: 3 }}
            >
              <FeaturePill
                icon={<TimelineOutlinedIcon />}
                title="Timeline-aware analysis"
                description="Track how each session evolved, with context preserved across reruns."
              />
              <FeaturePill
                icon={<SecurityOutlinedIcon />}
                title="Workspace isolation"
                description="Each analysis is sandboxed, so experiments never pollute production."
              />
              <FeaturePill
                icon={<BoltOutlinedIcon />}
                title="Incremental modernization"
                description="Jump from overview into per-program dashboards in one click."
              />
            </Stack>
          </Box>

          {/* Search + recent sessions */}
          <Box
            ref={sessionsReveal.ref}
            className={`reveal ${sessionsReveal.visible ? 'is-visible' : ''}`}
            sx={{ mt: 5 }}
          >
            <Box
              className="glass-surface"
              sx={{
                p: 3,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search projects or sessions..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 999,
                      bgcolor: 'var(--glass-bg)',
                      color: 'var(--text-primary)',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'var(--text-secondary)',
                      opacity: 1,
                    },
                    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                      color: 'var(--text-secondary)',
                    },
                  }}
                />

                {/* View mode switch */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: 999,
                    border: '1px solid var(--glass-border)',
                    bgcolor: 'var(--glass-bg)',
                    overflow: 'hidden',
                  }}
                >
                  <Button
                    size="small"
                    onClick={() => setViewMode('list')}
                    sx={{
                      px: 1.8,
                      py: 0.4,
                      borderRadius: 0,
                      minWidth: 0,
                      fontSize: 11,
                      fontWeight: 500,
                      color:
                        viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      bgcolor:
                        viewMode === 'list' ? 'var(--glass-hover-bg)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'var(--glass-hover-bg)',
                      },
                    }}
                  >
                    List
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setViewMode('grid')}
                    sx={{
                      px: 1.8,
                      py: 0.4,
                      borderRadius: 0,
                      minWidth: 0,
                      fontSize: 11,
                      fontWeight: 500,
                      color:
                        viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      bgcolor:
                        viewMode === 'grid' ? 'var(--glass-hover-bg)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'var(--glass-hover-bg)',
                      },
                    }}
                  >
                    Grid
                  </Button>
                </Box>
              </Box>
            </Box>

            {cobol.length > 0 && (
              <SessionGroup
                title="COBOL"
                count={cobol.length}
                sessions={cobol}
                onOpen={handleOpen}
                viewMode={viewMode}
              />
            )}

            {ungrouped.length > 0 && (
              <SessionGroup
                title="Ungrouped Projects"
                count={ungrouped.length}
                sessions={ungrouped}
                onOpen={handleOpen}
                viewMode={viewMode}
                sx={{ mt: 4 }}
              />
            )}
          </Box>

          {/* Lightweight CTA + footer */}
          <Box sx={{ mt: 6, mb: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
              Ready to modernize another codebase?
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/sessions/new')}
              sx={{
                borderRadius: 'var(--fare-radius-pill)',
                borderColor: 'var(--border)',
              }}
            >
              Launch a fresh AI analysis
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

interface FeaturePillProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeaturePill({ icon, title, description }: FeaturePillProps) {
  return (
    <Box
      className="glass-card"
      sx={{
        p: 2,
        display: 'flex',
        gap: 1.5,
        alignItems: 'flex-start',
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'var(--glass-hover-bg)',
          color: 'var(--accent)',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.25 }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
          {description}
        </Typography>
      </Box>
    </Box>
  )
}


interface SessionGroupProps {
  title: string
  count: number
  sessions: SessionSummary[]
  onOpen: (session: SessionSummary) => void
  viewMode: 'list' | 'grid'
  sx?: object
}

function mapSessionToSummary(session: SessionInfo): SessionSummary {
  const createdAt = new Date(session.createdAt)
  const createdAtLabel = Number.isNaN(createdAt.getTime())
    ? session.createdAt
    : createdAt.toLocaleString()

  const status = normalizeStatus(session.status)
  return {
    id: session.id,
    name: session.name,
    tech: 'COBOL',
    statusLabel: status,
    updatedLabel: 'Updated recently',
    owner: 'You',
    group: 'COBOL',
    createdAt: createdAtLabel,
    description: `cobol · ${session.totalFiles} files`,
  }
}

function normalizeStatus(status: string): string {
  const s = status.toLowerCase()
  if (s === 'running' || s === 'queued') return 'Running'
  if (s.startsWith('complete')) return 'Completed'
  if (s === 'failed') return 'Failed'
  return 'Ready'
}

function SessionGroup({
  title,
  count,
  sessions,
  onOpen,
  viewMode,
  sx,
}: SessionGroupProps) {
  return (
    <Box sx={sx}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          mb: 1.5,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
          {count} workspace{count > 1 ? 's' : ''}
        </Typography>
      </Box>

      {viewMode === 'list' ? (
        <Box
          sx={{
            borderRadius: 1,
            overflow: 'hidden',
            border: '1px solid var(--border)',
            bgcolor: 'var(--bg-surface)',
          }}
        >
          {/* header row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2.5fr) 1fr 0.9fr 60px',
              px: 2,
              py: 0.75,
            borderBottom: '1px solid var(--border)',
            bgcolor: 'var(--bg-elevated)',
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: 'var(--text-secondary)', textTransform: 'uppercase' }}
            >
              Session name / ID
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'var(--text-secondary)', textTransform: 'uppercase' }}
            >
              Created
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'var(--text-secondary)', textTransform: 'uppercase' }}
            >
              Status
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'var(--text-secondary)', textAlign: 'right' }}
            >
              Actions
            </Typography>
          </Box>

          {/* body rows */}
          {sessions.map((session, index) => (
            <Box
              key={session.id}
              onClick={() => onOpen(session)}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2.5fr) 1fr 0.9fr 60px',
                px: 2,
                py: 1,
                alignItems: 'center',
                cursor: 'pointer',
                borderTop:
                  index === 0 ? 'none' : '1px solid var(--glass-border)',
                '&:hover': {
                  bgcolor: 'var(--glass-hover-bg)',
                },
              }}
            >
              {/* name / description / icon */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 2,
                  bgcolor: 'var(--glass-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <DescriptionOutlinedIcon
                  sx={{ fontSize: 18, color: 'var(--accent)' }}
                />
              </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.25,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ fontWeight: 500 }}
                  >
                    {session.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ color: 'var(--text-secondary)', fontSize: 11 }}
                  >
                    {session.description}
                  </Typography>
                </Box>
              </Box>

              {/* created */}
              <Typography
                variant="caption"
                sx={{ color: 'var(--text-secondary)', fontSize: 11 }}
              >
                {session.createdAt}
              </Typography>

              {/* status */}
              <Chip
                label={session.statusLabel}
                size="small"
                color="success"
                sx={{ borderRadius: 999, height: 22, justifySelf: 'flex-start' }}
              />

              {/* actions */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <ArrowForwardIosIcon
                  sx={{ fontSize: 14, color: 'var(--text-tertiary)' }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, minmax(0, 1fr))',
            },
            gap: 1.5,
          }}
        >
          {sessions.map((session) => (
            <Paper
              key={session.id}
              className="glass-card"
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1.6,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
              bgcolor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow)',
              minHeight: 120,
              transition:
                  'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease, background-color 0.16s ease',
              '&:hover': {
                  bgcolor: 'var(--glass-hover-bg)',
                  border: '1px solid var(--accent)',
                  boxShadow: 'var(--glass-glow)',
                  transform: 'translateY(-2px)',
              },
              }}
              onClick={() => onOpen(session)}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                bgcolor: 'var(--glass-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--glass-shadow)',
                }}
              >
                <DescriptionOutlinedIcon
                  sx={{ fontSize: 18, color: 'var(--accent)' }}
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.25,
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ fontWeight: 500, mb: 0.25 }}
                >
                  {session.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'var(--text-secondary)',
                    fontSize: 11,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {session.description}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: 'var(--text-secondary)', fontSize: 11 }}
                >
                  {session.createdAt}
                </Typography>
                <Chip
                  label={session.statusLabel}
                  size="small"
                  color="success"
                  sx={{ borderRadius: 999, height: 22 }}
                />
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  )
}

