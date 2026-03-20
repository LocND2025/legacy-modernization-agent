import { useEffect, useMemo, useState, type ReactNode } from 'react'
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
import {
  getSessionAnalysisFiles,
  type SessionAnalysisFileStatus,
  type SessionAnalysisStatus,
} from '../../../api/cobolApi'

type MetricColor = 'info' | 'warning' | 'success' | 'danger' | 'idle'

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
  danger: {
    dot: 'var(--danger)',
    glow: 'var(--danger-border)',
  },
}

export interface FloatingStatusDockProps {
  sessionId: string
  analysisStatus: SessionAnalysisStatus | null
}

export function FloatingStatusDock({ sessionId, analysisStatus }: FloatingStatusDockProps) {
  const [open, setOpen] = useState(false)

  const [analysisFiles, setAnalysisFiles] = useState<SessionAnalysisFileStatus[]>([])
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)
  const [filesError, setFilesError] = useState<string | null>(null)

  const totalFiles = analysisStatus?.totalFiles ?? 0
  const processedFiles = analysisStatus?.processedFiles ?? 0
  const failedFiles = analysisStatus?.failedFiles ?? 0
  const queuedFiles = Math.max(0, totalFiles - processedFiles - failedFiles)

  const statusLower = analysisStatus?.status?.toLowerCase() ?? 'idle'
  const isRunning = statusLower === 'running'
  const isQueued = statusLower === 'queued'
  const isCompleted = statusLower === 'completed' || statusLower.startsWith('complete')

  const metrics = useMemo(() => {
    return [
      {
        label: 'Queued',
        value: queuedFiles,
        color: queuedFiles > 0 ? 'info' : 'idle',
        icon: <AutorenewOutlinedIcon />,
      },
      {
        label: 'Running',
        value: isRunning || isQueued ? processedFiles : 0,
        color: isRunning || isQueued ? 'warning' : 'idle',
        icon: <AccessTimeOutlinedIcon />,
      },
      {
        label: 'Done',
        value: isCompleted ? processedFiles : 0,
        color: isCompleted ? (failedFiles > 0 ? 'danger' : 'success') : 'idle',
        icon: <CheckCircleOutlineOutlinedIcon />,
      },
    ] as Array<{
      label: string
      value: number
      color: MetricColor
      icon: ReactNode
    }>
  }, [queuedFiles, isRunning, isQueued, processedFiles, isCompleted, failedFiles])

  useEffect(() => {
    if (!open) return
    if (!sessionId) return

    let active = true
    const fetchFiles = async () => {
      setIsLoadingFiles(true)
      setFilesError(null)
      try {
        const data = await getSessionAnalysisFiles(sessionId)
        if (!active) return
        setAnalysisFiles(data)
      } catch (e) {
        if (!active) return
        setFilesError(e instanceof Error ? e.message : 'Failed to load files')
      } finally {
        if (active) setIsLoadingFiles(false)
      }
    }

    fetchFiles()

    const shouldPoll = statusLower === 'queued' || statusLower === 'running'
    if (!shouldPoll) return () => { active = false }

    const t = window.setInterval(fetchFiles, 2000)
    return () => {
      active = false
      window.clearInterval(t)
    }
  }, [open, sessionId, statusLower])

  const { processingFiles, pendingFiles, completedFiles } = useMemo(() => {
    const processing: SessionAnalysisFileStatus[] = []
    const pending: SessionAnalysisFileStatus[] = []
    const completed: SessionAnalysisFileStatus[] = []

    for (const f of analysisFiles) {
      const s = (f.status ?? '').toLowerCase()
      if (s === 'processing') processing.push(f)
      else if (s === 'analyzed') completed.push(f)
      else if (s === 'failed') completed.push(f)
      else pending.push(f)
    }

    return {
      processingFiles: processing,
      pendingFiles: pending,
      completedFiles: completed,
    }
  }, [analysisFiles])

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
            borderRadius: 'var(--fare-radius-lg)',
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
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              Generation Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {totalFiles} files
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

          {/* Files list */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              px: 1.5,
              py: 1.25,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.25,
            }}
          >
            {filesError && (
              <Typography sx={{ fontSize: 12.5, color: 'var(--danger)' }}>
                {filesError}
              </Typography>
            )}

            {!isLoadingFiles && analysisFiles.length === 0 && (
              <Typography sx={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                No files found for this session yet.
              </Typography>
            )}

            {(() => {
              const getBadgeSx = (fileStatus: string) => {
                const s = fileStatus.toLowerCase()
                if (s === 'processing') {
                  return {
                    bgcolor: 'var(--warning-bg)',
                    border: '1px solid var(--warning-border)',
                    color: 'var(--warning)',
                    label: 'Processing',
                  }
                }
                if (s === 'analyzed') {
                  return {
                    bgcolor: 'var(--success-bg)',
                    border: '1px solid var(--success-border)',
                    color: 'var(--success)',
                    label: 'Done',
                  }
                }
                if (s === 'failed') {
                  return {
                    bgcolor: 'var(--danger-bg)',
                    border: '1px solid var(--danger-border)',
                    color: 'var(--danger)',
                    label: 'Failed',
                  }
                }
                return {
                  bgcolor: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                  label: 'Pending',
                }
              }

              const renderRows = (rows: SessionAnalysisFileStatus[]) =>
                rows.map((f) => {
                  const s = (f.status ?? '').toLowerCase()
                  const badge = getBadgeSx(s)
                  return (
                    <Box
                      key={f.fileId}
                      sx={{
                        borderRadius: 1.5,
                        border: '1px solid var(--glass-border)',
                        bgcolor: 'var(--bg-elevated)',
                        px: 1.25,
                        py: 0.8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        transition:
                          'background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease',
                        '&:hover': {
                          bgcolor: 'var(--glass-hover-bg)',
                          borderColor: 'var(--glass-border-strong)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.85, minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 7,
                            height: 7,
                            borderRadius: 999,
                            bgcolor: badge.color,
                            boxShadow: `0 0 10px ${badge.color}`,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: 12.5,
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 190,
                          }}
                          title={f.relativePath ?? f.fileName}
                        >
                          {f.fileName}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          px: 0.75,
                          py: 0.1,
                          borderRadius: 999,
                          border: badge.border,
                          bgcolor: badge.bgcolor,
                          color: badge.color,
                          fontSize: 11,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {badge.label}
                      </Box>
                    </Box>
                  )
                })

              const ProcessingSection = (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                      Processing
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                      {processingFiles.length}
                    </Typography>
                  </Box>
                  {renderRows(processingFiles.length ? processingFiles : analysisStatus?.currentFileName ? [{
                    fileId: analysisStatus.currentFileId ?? 'current',
                    fileName: analysisStatus.currentFileName ?? '',
                    relativePath: analysisStatus.currentFileName ?? '',
                    status: 'processing',
                  }] : [])}
                </Box>
              )

              const PendingSection = (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                      Pending
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                      {pendingFiles.length}
                    </Typography>
                  </Box>
                  {renderRows(pendingFiles)}
                </Box>
              )

              const CompletedSection = (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                      Completed
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                      {completedFiles.length}
                    </Typography>
                  </Box>
                  {renderRows(completedFiles)}
                </Box>
              )

              return (
                <>
                  {ProcessingSection}
                  <Box sx={{ borderTop: '1px solid var(--glass-border)', opacity: 0.9 }} />
                  {PendingSection}
                  <Box sx={{ borderTop: '1px solid var(--glass-border)', opacity: 0.9 }} />
                  {CompletedSection}
                </>
              )
            })()}
          </Box>
        </Paper>
      </Grow>
    </Box>
  )
}

