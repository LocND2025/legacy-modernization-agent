import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'

const METRIC_CARDS = [
  {
    id: 'cobol-programs',
    label: 'COBOL programs',
    value: 35,
    icon: <CodeOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: 'jcl-files',
    label: 'JCL files',
    value: 63,
    icon: <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: 'other-files',
    label: 'Other files',
    value: 10,
    icon: <FolderOutlinedIcon sx={{ fontSize: 18 }} />,
  },
]

const DETECTED_ARTEFACTS = [
  'Stack IBM ZOS Enterprise Cobol · 108',
  'Stack Micro Focus Cobol Emulated Mainframe · 108',
  'Stack JP Mainframe Cobol · 108',
  'Stack JP Mainframe ACOS4 · 108',
  'Stack JP Mainframe VOS3 · 108',
  'JCL Files · 63',
  'Stack Netcobol Distributed · 45',
]

const DETECTED_STACKS = [
  'ibm_zos_enterprise_cobol · 108',
  'micro_focus_cobol_emulated_mainframe · 108',
  'jp_mainframe_gz4 · 108',
  'jp_mainframe_vos3 · 108',
  'netcobol_distributed · 45',
  'gnu_cobol_generic · 45',
]

const E2E_CHAIN_TABS = [
  'CICS Online End-to-End Chain',
  'IMS TM Online End-to-End Chain',
  'JP Mainframe TP Online Chain (RQS / TPL / AM)',
  'Distributed COBOL Online Chain',
  'Mainframe Batch Chain',
  'Distributed Batch Chain',
]

const SAMPLE_BUSINESS_PROGRAMS = [
  'HD89A300.cbl',
  'DELETE.cbl',
  'JOINT.cbl',
  'HD89COND.cbl',
  'HD89Q010.cbl',
  'HD89A080.cbl',
  'DSCOPJ4.cbl',
  'ZH79C120.cbl',
  'SEARCH01.cbl',
  'CONDSET6.cbl',
]

export function OverviewPanel() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        px: 3,
        py: 2.75,
        gap: 3,
        color: 'var(--text-primary)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              color: 'var(--text-secondary)',
              fontWeight: 600,
            }}
          >
            Project overview
          </Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 600, mt: 0.75 }}>
            Analytics and high-level statistics
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: 'var(--text-secondary)', mt: 0.5 }}>
            Snapshot of COBOL assets discovered for this session&apos;s codebase.
          </Typography>
        </Box>
      </Box>

      {/* Top metrics row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          gap: 1.75,
        }}
      >
        {METRIC_CARDS.map((metric) => (
          <Box
            key={metric.id}
            sx={{
              width: 132,
              height: 110,
              borderRadius: 2,
              px: 1.5,
              py: 1.5,
              bgcolor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow)',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transform: 'translateY(0)',
              transition:
                'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background-color 0.18s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                bgcolor: 'var(--glass-hover-bg)',
                borderColor: 'var(--accent)',
                boxShadow:
                  'var(--glass-inset-highlight-subtle), var(--glass-shadow), var(--glass-glow)',
              },
              '&:hover .metric-icon': {
                transform: 'translateY(-1px) scale(1.03)',
                color: 'var(--accent)',
              },
            }}
          >
            {/* Icon badge */}
            <Box
              className="metric-icon"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 30,
                height: 30,
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-secondary)',
                boxShadow: 'var(--glass-inset-highlight-subtle)',
                transition: 'transform 0.18s ease, color 0.18s ease',
              }}
            >
              {metric.icon}
            </Box>

            <Typography
              sx={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                color: 'var(--text-secondary)',
                fontWeight: 600,
              }}
            >
              {metric.label}
            </Typography>
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 700,
                fontFeatureSettings: '"tnum" 1, "lnum" 1',
              }}
            >
              {metric.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Detected artefacts */}
      <Box
        sx={{
          borderRadius: 2,
          border: '1px solid var(--glass-border)',
          bgcolor: 'var(--glass-bg)',
          px: 2,
          py: 1.75,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
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
          <Typography
            sx={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: 'var(--text-secondary)',
              fontWeight: 600,
            }}
          >
            Detected artefacts
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: 'var(--accent)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { textDecoration: 'underline', opacity: 0.8 },
            }}
          >
            View all (738)
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: 'nowrap',
            overflowX: 'auto',
            pb: 0.5,
            '&::-webkit-scrollbar': { height: 6 },
          }}
        >
          {DETECTED_ARTEFACTS.map((label) => (
            <Chip
              key={label}
              label={label}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 999,
                borderColor: 'var(--glass-border)',
                bgcolor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: 11,
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Detected stacks */}
      <Box
        sx={{
          borderRadius: 2,
          border: '1px solid var(--glass-border)',
          bgcolor: 'var(--glass-bg)',
          px: 2,
          py: 1.75,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
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
          <Typography
            sx={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: 'var(--text-secondary)',
              fontWeight: 600,
            }}
          >
            Detected stacks
          </Typography>
          <Box
            sx={{
              px: 1,
              py: 0.2,
              borderRadius: 999,
              border: '1px solid var(--glass-border)',
              bgcolor: 'var(--bg-surface)',
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Dialect: 1
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {DETECTED_STACKS.map((label) => (
            <Chip
              key={label}
              label={label}
              size="small"
              sx={{
                borderRadius: 999,
                bgcolor: 'var(--bg-surface)',
                border: '1px solid var(--glass-border)',
                fontSize: 11,
                color: 'var(--text-primary)',
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Symbolic references */}
      <Box
        sx={{
          borderRadius: 2,
          border: '1px solid var(--glass-border)',
          bgcolor: 'var(--glass-bg)',
          px: 2,
          py: 1.75,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
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
          <Typography
            sx={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: 'var(--text-secondary)',
              fontWeight: 600,
            }}
          >
            Symbolic references
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: 'var(--accent)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { textDecoration: 'underline', opacity: 0.8 },
            }}
          >
            View edges
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'var(--glass-border)' }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <SymbolicReferenceItem title="VSAM datasets" value="No VSAM references" />
          <SymbolicReferenceItem title="SYSIN references" value="No SYSIN references" />
          <SymbolicReferenceItem title="IMS symbols" value="No IMS symbols" />
        </Box>
      </Box>

      {/* End-to-end chains */}
      <Box
        sx={{
          borderRadius: 2,
          border: '1px solid var(--glass-border)',
          bgcolor: 'var(--glass-bg)',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            px: 2,
            pt: 1.5,
            pb: 1,
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: 'var(--text-secondary)',
              fontWeight: 600,
            }}
          >
            End-to-end chains
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              overflowX: 'auto',
              pb: 0.5,
              '&::-webkit-scrollbar': { height: 6 },
            }}
          >
            {E2E_CHAIN_TABS.map((label, idx) => (
              <Chip
                key={label}
                label={label}
                size="small"
                clickable
                color={idx === 0 ? 'primary' : 'default'}
                variant={idx === 0 ? 'filled' : 'outlined'}
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  whiteSpace: 'nowrap',
                  color: idx === 0 ? 'var(--on-accent)' : 'var(--text-primary)',
                  borderColor: idx === 0 ? 'transparent' : 'var(--glass-border)',
                  bgcolor: idx === 0 ? 'var(--accent)' : 'var(--bg-surface)',
                }}
              />
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            px: 1.5,
            py: 1.5,
            gap: 1.5,
            overflow: 'hidden',
          }}
        >
          <ChainColumn title="Online entry (CICS transaction)" items={[]} />
          <ChainColumn title="CICS controller (logical region)" items={[]} />
          <ChainColumn
            title="Business program (CICS program)"
            items={SAMPLE_BUSINESS_PROGRAMS}
          />
          <ChainColumn title="UI resource (MAPSET / BMS map)" items={['HD89M010.map']} />
          <ChainColumn
            title="Data resource (DB / VSAM / file / MQ)"
            items={['VSAM: HD89MASTER', 'DB2: HD89_CUSTOMER']}
          />
        </Box>
      </Box>
    </Box>
  )
}

interface SymbolicReferenceItemProps {
  title: string
  value: string
}

function SymbolicReferenceItem({ title, value }: SymbolicReferenceItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
      }}
    >
      <Typography sx={{ fontSize: 12, color: 'var(--text-secondary)' }}>{title}</Typography>
      <Typography
        sx={{
          fontSize: 12,
          color: 'var(--text-secondary)',
          fontStyle: 'italic',
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

interface ChainColumnProps {
  title: string
  items: string[]
}

function ChainColumn({ title, items }: ChainColumnProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        maxHeight: '100%',
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          color: 'var(--text-secondary)',
          fontWeight: 600,
          mb: 1,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          pr: 0.5,
          '&::-webkit-scrollbar': { width: 6 },
        }}
      >
        {items.length === 0 ? (
          <Typography sx={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            No items detected
          </Typography>
        ) : (
          <Stack spacing={0.5}>
            {items.map((item) => (
              <Box
                key={item}
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  )
}

