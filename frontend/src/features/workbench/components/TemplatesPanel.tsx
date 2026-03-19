import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import SearchIcon from '@mui/icons-material/Search'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

interface WorkspaceTemplate {
  id: string
  documentKind: string
  name: string
  language: string
  scope: 'system' | 'program'
  category: string
  status: 'Active' | 'Draft'
  version: string
}

const MOCK_TEMPLATES: WorkspaceTemplate[] = [
  {
    id: 'cobol_program_detail',
    documentKind: 'cobol_program_detail',
    name: 'Cobol Program Specification',
    language: 'cobol',
    scope: 'program',
    category: 'cobol',
    status: 'Active',
    version: 'v6',
  },
  {
    id: 'cobol_program',
    documentKind: 'cobol_program',
    name: 'Cobol Program',
    language: 'cobol',
    scope: 'system',
    category: 'general',
    status: 'Active',
    version: 'v6',
  },
  {
    id: 'cobol_program_design',
    documentKind: 'cobol_program_design',
    name: 'cobol-program-design',
    language: 'cobol',
    scope: 'program',
    category: 'general',
    status: 'Active',
    version: 'v7',
  },
  {
    id: 'program',
    documentKind: 'program',
    name: 'Program',
    language: 'legacy',
    scope: 'system',
    category: 'general',
    status: 'Active',
    version: 'v6',
  },
  {
    id: 'api_list',
    documentKind: 'api_list',
    name: 'API List',
    language: 'mixed',
    scope: 'system',
    category: 'api',
    status: 'Active',
    version: 'v3',
  },
  {
    id: 'screen_design',
    documentKind: 'screen_design',
    name: 'Screen Design (BD/DD)',
    language: 'ui',
    scope: 'program',
    category: 'frontend',
    status: 'Draft',
    version: 'v1',
  },
]

export function TemplatesPanel() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return MOCK_TEMPLATES
    return MOCK_TEMPLATES.filter(
      (tpl) =>
        tpl.documentKind.toLowerCase().includes(q) ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.category.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        px: 3,
        py: 2.75,
        gap: 2.5,
        color: 'var(--text-primary)',
        '& .MuiTypography-root': {
          color: 'inherit',
        },
        '& .MuiIconButton-root': {
          color: 'var(--text-secondary)',
        },
        '& .MuiTableCell-root': {
          color: 'var(--text-primary)',
        },
        '& .MuiChip-root': {
          color: 'var(--text-primary)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '10px',
            border: '1px solid var(--glass-border)',
            bgcolor: 'var(--glass-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glass-shadow)',
            flexShrink: 0,
          }}
        >
          <ArticleOutlinedIcon sx={{ fontSize: 18, color: 'var(--accent)' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
            Workspace Templates
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
            Workspace templates are copied from organization templates. You can customize them for
            this workspace.
          </Typography>
        </Box>
      </Box>

      {/* Search */}
      <Box
        sx={{
          borderRadius: 2,
          border: '1px solid var(--glass-border)',
          bgcolor: 'var(--glass-bg)',
          px: 2,
          py: 1.25,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.25,
            py: 0.65,
            borderRadius: '999px',
            border: '1px solid var(--glass-border)',
            bgcolor: 'var(--bg-surface)',
            minWidth: 260,
          }}
        >
          <SearchIcon sx={{ fontSize: 16, color: 'var(--text-secondary)' }} />
          <InputBase
            fullWidth
            placeholder="Search by name or kind..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              fontSize: 12.5,
              color: 'var(--text-primary)',
              '& input::placeholder': {
                color: 'var(--text-secondary)',
                opacity: 1,
              },
            }}
          />
        </Box>
      </Box>

      {/* Table */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          borderRadius: 2,
          border: '1px solid var(--glass-border)',
          bgcolor: 'var(--glass-bg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {filtered.length} templates in this workspace
          </Typography>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <Table
            size="small"
            stickyHeader
            sx={{
              '& th': {
                bgcolor: 'var(--bg-surface)',
                borderBottom: '1px solid var(--glass-border)',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: 0.7,
                color: 'var(--text-secondary)',
              },
              '& td': {
                borderBottom: '1px solid var(--glass-border)',
                fontSize: 12.5,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell width="20%">Document kind</TableCell>
                <TableCell width="28%">Name</TableCell>
                <TableCell width="10%">Language</TableCell>
                <TableCell width="10%">Scope</TableCell>
                <TableCell width="12%">Category</TableCell>
                <TableCell width="10%">Status</TableCell>
                <TableCell width="6%">Version</TableCell>
                <TableCell align="center" width="8%">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((tpl) => (
                <TableRow
                  key={tpl.id}
                  hover
                  sx={{
                    '&:hover': {
                      bgcolor: 'var(--glass-hover-bg)',
                    },
                  }}
                >
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {tpl.documentKind}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                      {tpl.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tpl.language}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 10,
                        borderRadius: 999,
                        bgcolor: 'var(--bg-surface)',
                        border: '1px solid var(--glass-border)',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tpl.scope}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 10,
                        borderRadius: 999,
                        bgcolor: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tpl.category}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 10,
                        borderRadius: 999,
                        bgcolor: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tpl.status}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 10,
                        borderRadius: 999,
                        bgcolor:
                          tpl.status === 'Active'
                            ? 'var(--success-bg)'
                            : 'var(--glass-bg)',
                        border:
                          tpl.status === 'Active'
                            ? '1px solid var(--success-border)'
                            : '1px solid var(--glass-border)',
                        color: tpl.status === 'Active' ? 'var(--success)' : 'var(--text-secondary)',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        fontFeatureSettings: '"tnum" 1, "lnum" 1',
                      }}
                    >
                      {tpl.version}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View template" placement="top">
                      <IconButton size="small">
                        <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  )
}

