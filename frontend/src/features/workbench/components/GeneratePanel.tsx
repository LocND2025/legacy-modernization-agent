import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'

type TemplateScope = 'system' | 'program'

interface GenerateTemplate {
  id: string
  title: string
  description: string
  scope: TemplateScope
  cta: string
}

const GENERATE_TEMPLATES: GenerateTemplate[] = [
  {
    id: 'sys-cobol-program',
    title: 'Cobol Program',
    description: 'Generate documentation for all COBOL programs in this workspace.',
    scope: 'system',
    cta: 'Generate',
  },
  {
    id: 'sys-program',
    title: 'Program',
    description: 'High-level program catalog with key metadata and relationships.',
    scope: 'system',
    cta: 'Generate',
  },
  {
    id: 'sys-overview',
    title: 'program-overview',
    description: 'Single program/class overview documentation.',
    scope: 'system',
    cta: 'Generate',
  },
  {
    id: 'sys-api-list',
    title: 'API List',
    description: 'Catalog of all APIs with endpoints, methods, and permissions.',
    scope: 'system',
    cta: 'Generate',
  },
  {
    id: 'sys-c4',
    title: 'C4 Context Diagram',
    description: 'C4 model context diagram showing system boundaries.',
    scope: 'system',
    cta: 'Generate',
  },
  {
    id: 'sys-crud-matrix',
    title: 'CRUD Matrix',
    description: 'Screen/API/Job × Table CRUD operations matrix.',
    scope: 'system',
    cta: 'Generate',
  },
  {
    id: 'prog-spec',
    title: 'Cobol Program Specification',
    description:
      'Contains both the "Basic" (Business Intent) and "Detail" (Algorithms/Rules) views.',
    scope: 'program',
    cta: 'Select Program',
  },
  {
    id: 'prog-design',
    title: 'cobol-program-design',
    description: 'COBOL program design documentation (BD/DD).',
    scope: 'program',
    cta: 'Select Program',
  },
  {
    id: 'prog-api-design',
    title: 'API Design (BD/DD)',
    description: 'Detailed API specification with request/response and error handling.',
    scope: 'program',
    cta: 'Select Program',
  },
  {
    id: 'prog-basic',
    title: 'COBOL Basic Design',
    description:
      'Business-focused COBOL program basic design covering process flow and record structures.',
    scope: 'program',
    cta: 'Select Program',
  },
  {
    id: 'prog-bms',
    title: 'BMS Screen Design (COBOL-specific)',
    description:
      'CICS BMS screen design with MAPSET/MAP/DFHMDI definitions (mainframe only).',
    scope: 'program',
    cta: 'Select Program',
  },
  {
    id: 'prog-detail',
    title: 'COBOL Detail Design',
    description:
      'Implementation-focused COBOL program detail design with pseudocode and flowcharts.',
    scope: 'program',
    cta: 'Select Program',
  },
  {
    id: 'prog-jcl',
    title: 'JCL Job Design (COBOL-specific)',
    description: 'JCL batch job design with JOB/EXEC/DD statements, utilities, and PROC.',
    scope: 'program',
    cta: 'Select Program',
  },
  {
    id: 'prog-job',
    title: 'Job Design (BD/DD)',
    description:
      'Detailed batch job design specification with I/O, recovery, and monitoring.',
    scope: 'program',
    cta: 'Select Program',
  },
  {
    id: 'prog-screen',
    title: 'Screen Design (BD/DD)',
    description:
      'Detailed screen design with UI components, state, and API bindings for modernization.',
    scope: 'program',
    cta: 'Select Program',
  },
]

export function GeneratePanel() {
  const systemTemplates = GENERATE_TEMPLATES.filter(
    (tpl) => tpl.scope === 'system',
  )
  const programTemplates = GENERATE_TEMPLATES.filter(
    (tpl) => tpl.scope === 'program',
  )

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        px: 3,
        py: 2.75,
        gap: 3,
        color: 'var(--text-primary)',
        '& .MuiTypography-root': {
          color: 'inherit',
        },
        '& .MuiChip-root': {
          color: 'var(--text-primary)',
        },
      }}
    >
      {/* Top banner */}
      <Box
        sx={{
          borderRadius: 2,
          px: 2.5,
          py: 1.75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          bgcolor: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--glass-hover-bg)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-glow)',
              color: 'var(--accent)',
              flexShrink: 0,
            }}
          >
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
              LLM Document Generation
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
              Generate documentation using AI for this workspace.
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Chip
            label="23 templates"
            size="small"
            sx={{
              borderRadius: 999,
              bgcolor: 'var(--bg-surface)',
              border: '1px solid var(--glass-border)',
              fontSize: 11,
            }}
          />
          <Button
            variant="contained"
            size="small"
            sx={{
              borderRadius: '999px',
              textTransform: 'none',
              fontSize: 12,
              px: 2,
            }}
          >
            Generate All
          </Button>
        </Stack>
      </Box>

      {/* System-wide section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
            System-Wide Documentation
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Generate documentation for the entire system. These documents cover system-level
            information.
          </Typography>
        </Box>

        <TemplateGrid templates={systemTemplates} />
      </Box>

      {/* Program-scope section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
            Program-Scope Documentation
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Generate documentation for specific programs. Click a template to go to Programs
            tab and select a program.
          </Typography>
        </Box>

        <TemplateGrid templates={programTemplates} />
      </Box>
    </Box>
  )
}

interface TemplateGridProps {
  templates: GenerateTemplate[]
}

function TemplateGrid({ templates }: TemplateGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 2,
      }}
    >
      {templates.map((tpl) => (
        <TemplateCard key={tpl.id} template={tpl} />
      ))}
    </Box>
  )
}

interface TemplateCardProps {
  template: GenerateTemplate
}

function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        bgcolor: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        px: 2,
        py: 1.75,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        minHeight: 130,
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '10px',
            border: '1px solid var(--glass-border)',
            bgcolor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ArticleOutlinedIcon sx={{ fontSize: 16, color: 'var(--accent)' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
            {template.title}
          </Typography>
        <Typography sx={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
            {template.description}
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ flex: 1 }} />

      {/* Gradient button bar */}
      <Button
        fullWidth
        size="small"
        sx={{
          mt: 0.25,
          borderRadius: '999px',
          textTransform: 'none',
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--on-accent)',
          backgroundImage: 'var(--accent-gradient)',
          boxShadow: 'var(--glass-shadow)',
          '&:hover': {
            backgroundImage: 'var(--accent-gradient)',
            boxShadow: 'var(--glass-shadow), var(--glass-glow)',
          },
        }}
      >
        {template.cta}
      </Button>
    </Box>
  )
}

