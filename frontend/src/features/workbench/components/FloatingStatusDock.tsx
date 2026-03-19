import { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Grow from '@mui/material/Grow'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'

type MetricColor = 'info' | 'warning' | 'success' | 'idle'

const COLOR_MAP: Record<MetricColor, { dot: string; glow: string }> = {
  idle: {
    dot: 'var(--text-secondary)',
    glow: 'transparent',
  },
  info: {
    dot: 'var(--info)',
    glow: 'var(--info-glow)',
  },
  warning: {
    dot: 'var(--warning)',
    glow: 'var(--warning-border)',
  },
  success: {
    dot: 'var(--success)',
    glow: 'var(--success-border)',
  },
}

export function FloatingStatusDock() {
  const [open, setOpen] = useState(false)

  const metrics = [
    { label: 'Queued', value: 0, color: 'info' as MetricColor, icon: <AutorenewOutlinedIcon /> },
    {
      label: 'Running',
      value: 0,
      color: 'warning' as MetricColor,
      icon: <AccessTimeOutlinedIcon />,
    },
    {
      label: 'Success',
      value: 39,
      color: 'success' as MetricColor,
      icon: <CheckCircleOutlineOutlinedIcon />,
    },
  ]

  return (
    <Box
      sx={{
        position: 'absolute',
        right: 20,
        bottom: 20,
        pointerEvents: 'auto',
        zIndex: 1200,
      }}
    >
      {/* Status dock trigger */}
      <Paper
        elevation={0}
        className="glass-pill"
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          pointerEvents: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          px: 0.9,
          py: 0.5,
          borderRadius: 999,
          bgcolor: 'transparent',
          cursor: 'pointer',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          transform: open ? 'translateY(-4px) scale(1.02)' : 'none',
          boxShadow: open ? '0 0 0 1px var(--border-strong)' : 'none',
        }}
      >
        {/* Run button (does not toggle panel) */}
        <Tooltip title="Run analysis" placement="top">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              // TODO: wire to analysis trigger
            }}
            sx={{
              backgroundColor: 'var(--accent)',
              color: 'var(--on-accent)',
              borderRadius: 999,
              width: 26,
              height: 26,
              boxShadow: 'var(--glass-glow)',
              mr: 0.25,
              flexShrink: 0,
              transition: 'all 0.18s ease',
              '&:hover': {
                boxShadow: 'var(--glass-shadow)',
                transform: 'scale(1.08)',
              },
            }}
          >
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 13 }} />
          </IconButton>
        </Tooltip>

        {/* Compact metrics */}
        {metrics.map((metric, i) => {
          const colors = COLOR_MAP[metric.color]
          const isActive = metric.value > 0

          return (
            <Tooltip key={metric.label} title={metric.label} placement="top">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.4,
                  mx: i === 0 ? 0.3 : 0,
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'var(--scrim)',
                    color: colors.dot,
                    boxShadow: isActive ? `0 0 6px ${colors.glow}` : 'none',
                    animation:
                      isActive && metric.color !== 'success'
                        ? 'pulse-dot 2s ease-in-out infinite'
                        : 'none',
                    flexShrink: 0,
                    '& svg': {
                      fontSize: 13,
                    },
                  }}
                >
                  {metric.icon}
                </Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    lineHeight: 1,
                    fontFeatureSettings: '"tnum" 1',
                  }}
                >
                  {metric.value}
                </Typography>
              </Box>
            </Tooltip>
          )
        })}
      </Paper>

      {/* Animated generation status panel */}
      <Grow
        in={open}
        timeout={{ enter: 220, exit: 180 }}
        style={{ transformOrigin: 'bottom right' }}
      >
        <Paper
          elevation={0}
          className="glass-card"
          sx={{
            position: 'absolute',
            right: 0,
            bottom: 56,
            width: 340,
            maxHeight: 480,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: '18px',
            transform: open ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.96)',
            opacity: open ? 1 : 0,
            transition: 'transform 0.22s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.18s ease',
          }}
        >
          {/* Panel header */}
          <Box
            sx={{
              px: 1.75,
              py: 1.25,
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
              Generation Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                39 tasks
              </Typography>
              <IconButton size="small" sx={{ color: 'var(--text-secondary)' }}>
                <OpenInFullOutlinedIcon sx={{ fontSize: 15 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen(false)
                }}
                sx={{ color: 'var(--text-secondary)' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Tasks list */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              px: 1.5,
              py: 1.25,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {MOCK_TASKS.map((task) => (
              <Box
                key={task.id}
                sx={{
                  borderRadius: 1.5,
                  border: '1px solid var(--glass-border)',
                  bgcolor: 'var(--scrim)',
                  px: 1.25,
                  py: 0.85,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.4,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>
                    {task.name}
                  </Typography>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        px: 0.7,
                        py: 0.1,
                        borderRadius: 999,
                        border: '1px solid var(--glass-border)',
                        fontSize: 10,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      #{task.batch}
                    </Box>
                    <CheckCircleOutlineOutlinedIcon
                      sx={{ fontSize: 16, color: 'var(--success)' }}
                    />
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {task.duration} · {task.time}
                </Typography>
                <Typography
                  component="div"
                  sx={{
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: COLOR_MAP.info.dot,
                    }}
                  />
                  {task.program}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grow>
    </Box>
  )
}

interface MockTask {
  id: string
  name: string
  batch: number
  duration: string
  time: string
  program: string
}

const MOCK_TASKS: MockTask[] = [
  {
    id: '1',
    name: 'COBOL Detail Design',
    batch: 2,
    duration: '555 LNs',
    time: '17:12',
    program: 'HD89M160.cbl',
  },
  {
    id: '2',
    name: 'COBOL Basic Design',
    batch: 1,
    duration: '1M 05s',
    time: '17:09',
    program: 'HD89A012.cbl',
  },
  {
    id: '3',
    name: 'COBOL Detail Design',
    batch: 5,
    duration: '1M 14s',
    time: '17:07',
    program: 'HD89A012.cbl',
  },
  {
    id: '4',
    name: 'JCL Job Design (COBOL-specific)',
    batch: 1,
    duration: '19s',
    time: '16:42',
    program: 'HD89M110.jcl',
  },
  {
    id: '5',
    name: 'Screen Design (BD/DD)',
    batch: 1,
    duration: '43s',
    time: '16:38',
    program: 'HD89M140.cbl',
  },
]

