import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'

type NavItemKey =
  | 'docs'
  | 'overview'
  | 'programs'
  | 'source'
  | 'generate'
  | 'templates'

export interface LeftNavRailProps {
  activeItem: NavItemKey
  onChange: (key: NavItemKey) => void
  docsBadge?: number
  programsBadge?: number
}

export function LeftNavRail({ activeItem, onChange, docsBadge, programsBadge }: LeftNavRailProps) {
  const items: Array<{
    key: NavItemKey
    label: string
    badge?: number
    icon: React.ReactNode
  }> = [
    {
      key: 'docs',
      label: 'Docs',
      badge: docsBadge,
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    { key: 'overview', label: 'Overview', icon: <DashboardOutlinedIcon sx={{ fontSize: 20 }} /> },
    {
      key: 'programs',
      label: 'Programs',
      badge: programsBadge,
      icon: <ListAltOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    { key: 'source', label: 'Source', icon: <CodeOutlinedIcon sx={{ fontSize: 20 }} /> },
    { key: 'generate', label: 'Generate', icon: <AutoAwesomeOutlinedIcon sx={{ fontSize: 20 }} /> },
    { key: 'templates', label: 'Templates', icon: <InsertDriveFileOutlinedIcon sx={{ fontSize: 20 }} /> },
  ]

  return (
    <Paper
      elevation={0}
      className="glass-card"
      sx={{
        width: 90,
        flexShrink: 0,
        height: '100%',
        borderRadius: 'var(--next-frame-radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 1.5,
        gap: 0.5,
        bgcolor: 'var(--bg-surface)',
        overflow: 'hidden',
      }}
    >
      {items.map((item) => {
        const isActive = item.key === activeItem
        return (
          <Tooltip key={item.key} title={item.label} placement="right" arrow>
            <Box
              role="button"
              tabIndex={0}
              aria-label={item.label}
              aria-pressed={isActive}
              onClick={() => onChange(item.key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onChange(item.key)
                }
              }}
              sx={{
                width: 68,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                py: 0.85,
                px: 0.5,
                borderRadius: '12px',
                cursor: 'pointer',
                position: 'relative',
                outline: 'none',
                bgcolor: isActive ? 'var(--glass-hover-bg)' : 'transparent',
                border: isActive
                  ? '1px solid var(--accent)'
                  : '1px solid transparent',
                boxShadow: isActive
                  ? 'var(--glass-inset-highlight-subtle), var(--glass-glow)'
                  : 'none',
                transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
                transition:
                  'background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
                '&:hover': {
                  bgcolor: 'var(--glass-hover-bg)',
                  border: isActive
                    ? '1px solid var(--accent-hover)'
                    : '1px solid var(--glass-border)',
                  transform: 'translateY(-2px)',
                },
                '&:focus-visible': {
                  boxShadow: 'var(--focus-ring)',
                  border: '1px solid var(--accent)',
                  bgcolor: 'var(--glass-hover-bg)',
                },
              }}
            >
              {/* Active indicator dot on left */}
              {isActive && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: -1,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 20,
                    borderRadius: '0 3px 3px 0',
                    background: 'var(--accent)',
                  }}
                />
              )}

              <Box
                sx={{
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.18s ease',
                }}
              >
                {item.badge ? (
                  <Badge
                    badgeContent={item.badge}
                    overlap="circular"
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: 9,
                        minWidth: 15,
                        height: 15,
                        bgcolor: 'var(--accent)',
                        color: 'var(--bg-base)',
                      },
                    }}
                  >
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </Box>

              <Typography
                variant="caption"
                sx={{
                  fontSize: 10.5,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  lineHeight: 1,
                  transition: 'color 0.18s ease',
                  letterSpacing: 0.2,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          </Tooltip>
        )
      })}
    </Paper>
  )
}
