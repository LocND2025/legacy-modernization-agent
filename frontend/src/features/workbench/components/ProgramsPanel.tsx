import { useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import { analyzeCobolFile, getFileContent } from '../../../api/cobolApi'

type ArtefactKind =
  | 'programs'
  | 'copybooks'
  | 'jcl'
  | 'cics'
  | 'ims'
  | 'database'
  | 'scheduler'
  | 'config'
  | 'all'

export interface ProgramRow {
  name: string
  loc: number
  type: 'BATCH' | 'ONLINE'
  tags: string[]
  path: string
  fileId?: string
  status?: string
}

const getFileName = (row: ProgramRow) => row.path.split('/').pop() || row.name
const getFileExtension = (row: ProgramRow) =>
  getFileName(row).split('.').pop()?.toLowerCase() ?? ''
const includesAny = (value: string, terms: string[]) => terms.some((term) => value.includes(term))

const ARTEFACT_TAB_DEFS: {
  id: ArtefactKind
  label: string
  predicate: (row: ProgramRow) => boolean
}[] = [
  {
    id: 'programs',
    label: 'Programs',
    predicate: (row) => ['cbl', 'cob', 'cobol', 'pco'].includes(getFileExtension(row)),
  },
  {
    id: 'copybooks',
    label: 'Copybooks',
    predicate: (row) => ['cpy', 'copy'].includes(getFileExtension(row)),
  },
  {
    id: 'jcl',
    label: 'JCL Jobs',
    predicate: (row) => ['jcl', 'job', 'proc', 'cntl'].includes(getFileExtension(row)),
  },
  {
    id: 'cics',
    label: 'CICS/BMS',
    predicate: (row) =>
      includesAny(`${row.path} ${row.name}`.toLowerCase(), ['cics', 'bms', 'mapset']),
  },
  {
    id: 'ims',
    label: 'IMS',
    predicate: (row) => includesAny(`${row.path} ${row.name}`.toLowerCase(), ['ims', 'psb', 'dbd']),
  },
  {
    id: 'database',
    label: 'Database',
    predicate: (row) =>
      includesAny(`${row.path} ${row.name}`.toLowerCase(), ['db2', 'sql', 'ddl', 'database']),
  },
  {
    id: 'scheduler',
    label: 'Scheduler',
    predicate: (row) =>
      includesAny(`${row.path} ${row.name}`.toLowerCase(), ['scheduler', 'sched', 'controlm', 'autosys']),
  },
  {
    id: 'config',
    label: 'Config',
    predicate: (row) =>
      ['cfg', 'conf', 'json', 'yaml', 'yml', 'xml', 'ini', 'properties'].includes(
        getFileExtension(row),
      ) || includesAny(`${row.path} ${row.name}`.toLowerCase(), ['config', 'settings']),
  },
  {
    id: 'all',
    label: 'All artefacts',
    predicate: () => true,
  },
]

const PROGRAM_ROWS: ProgramRow[] = [
  {
    name: 'CONDSET6.cbl',
    loc: 168,
    type: 'BATCH',
    tags: ['MAIN', 'CALL'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/CONDSET6.cbl',
  },
  {
    name: 'DELETE.cbl',
    loc: 57,
    type: 'BATCH',
    tags: ['MAIN'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/DELETE.cbl',
  },
  {
    name: 'DSCOPY.cbl',
    loc: 159,
    type: 'BATCH',
    tags: ['MAIN', 'COPY'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/DSCOPY.cbl',
  },
  {
    name: 'GOCHECK.cbl',
    loc: 23,
    type: 'BATCH',
    tags: ['MAIN'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/GOCHECK.cbl',
  },
  {
    name: 'HD25SPT3.cbl',
    loc: 163,
    type: 'BATCH',
    tags: ['MAIN'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/HD45.MAST.SRCLIB/HD25SPT3.cbl',
  },
  {
    name: 'HD45SP98.cbl',
    loc: 87,
    type: 'BATCH',
    tags: ['MAIN'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/HD45.MAST.SRCLIB/HD45SP98.cbl',
  },
  {
    name: 'HD89A001.cbl',
    loc: 235,
    type: 'BATCH',
    tags: ['MAIN', 'CALL'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/HD89A001.cbl',
  },
  {
    name: 'HD89A012.cbl',
    loc: 314,
    type: 'BATCH',
    tags: ['MAIN', 'CALL', 'COPY'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/HD89A012.cbl',
  },
  // duplicated rows for pagination demo
  {
    name: 'HD89M110.cbl',
    loc: 142,
    type: 'BATCH',
    tags: ['MAIN'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/HD89M110.cbl',
  },
  {
    name: 'HD89M130.cbl',
    loc: 201,
    type: 'BATCH',
    tags: ['MAIN', 'CALL'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/HD89M130.cbl',
  },
  {
    name: 'HD89M140.cbl',
    loc: 178,
    type: 'BATCH',
    tags: ['MAIN'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/HD89M140.cbl',
  },
  {
    name: 'HD89M150.cbl',
    loc: 190,
    type: 'BATCH',
    tags: ['MAIN', 'CALL'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/HD89M150.cbl',
  },
  {
    name: 'HD89M160.cbl',
    loc: 207,
    type: 'BATCH',
    tags: ['MAIN'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/HD89M160.cbl',
  },
  {
    name: 'HD89Q140.cbl',
    loc: 132,
    type: 'BATCH',
    tags: ['MAIN', 'CALL'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/HD89Q140.cbl',
  },
  {
    name: 'HD89Q150.cbl',
    loc: 156,
    type: 'BATCH',
    tags: ['MAIN'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/HD89Q150.cbl',
  },
  {
    name: 'HD89Q160.cbl',
    loc: 121,
    type: 'BATCH',
    tags: ['MAIN', 'COPY'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/HD89Q160.cbl',
  },
  {
    name: 'ZH79C120.cbl',
    loc: 188,
    type: 'BATCH',
    tags: ['MAIN'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/ZH79C120.cbl',
  },
  {
    name: 'SEARCH01.cbl',
    loc: 211,
    type: 'BATCH',
    tags: ['MAIN', 'CALL'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/SEARCH01.cbl',
  },
  {
    name: 'JNT89A01.cbl',
    loc: 175,
    type: 'BATCH',
    tags: ['MAIN'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/JNT89A01.cbl',
  },
  {
    name: 'JNT89A02.cbl',
    loc: 164,
    type: 'BATCH',
    tags: ['MAIN', 'CALL'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/JNT89A02.cbl',
  },
  {
    name: 'JNT89A03.cbl',
    loc: 199,
    type: 'BATCH',
    tags: ['MAIN'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/JNT89A03.cbl',
  },
  {
    name: 'JNT89A04.cbl',
    loc: 187,
    type: 'BATCH',
    tags: ['MAIN'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/JNT89A04.cbl',
  },
  {
    name: 'JNT89A05.cbl',
    loc: 222,
    type: 'BATCH',
    tags: ['MAIN', 'CALL'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/JNT89A05.cbl',
  },
  {
    name: 'JNT89A06.cbl',
    loc: 134,
    type: 'BATCH',
    tags: ['MAIN'],
    path: 'cobol_internal_line_investigation/02_PMC/COBOL/MAST/JNT89A06.cbl',
  },
]

const SORT_OPTIONS = [
  { id: 'name-asc', label: 'Name ↑' },
  { id: 'name-desc', label: 'Name ↓' },
  { id: 'loc-desc', label: 'LOC ↓' },
  { id: 'loc-asc', label: 'LOC ↑' },
]

interface ProgramsPanelProps {
  programs?: ProgramRow[]
  /** Gọi sau khi backend phân tích lại xong (để refresh Docs / trạng thái). */
  onRegenerateComplete?: (fileId: string) => void | Promise<void>
}

export function ProgramsPanel({
  programs,
  onRegenerateComplete,
}: ProgramsPanelProps) {
  const [activeTab, setActiveTab] = useState<ArtefactKind>('programs')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<string>('name-asc')
  const [page, setPage] = useState(0)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)
  const [isViewFullScreen, setIsViewFullScreen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<ProgramRow | null>(null)
  const [selectedContent, setSelectedContent] = useState<string>('')
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [regeneratingFileId, setRegeneratingFileId] = useState<string | null>(null)
  const rowsPerPage = 20

  const sourceRows = useMemo(() => programs ?? PROGRAM_ROWS, [programs])

  const artefactTabs = useMemo(
    () =>
      ARTEFACT_TAB_DEFS.map((tab) => ({
        id: tab.id,
        label: tab.label,
        count: sourceRows.filter(tab.predicate).length,
      })),
    [sourceRows],
  )

  const rowsByActiveTab = useMemo(() => {
    const tab = ARTEFACT_TAB_DEFS.find((item) => item.id === activeTab)
    if (!tab) return sourceRows
    return sourceRows.filter(tab.predicate)
  }, [activeTab, sourceRows])

  const filteredRows = useMemo(() => {
    let rows = rowsByActiveTab

    const trimmed = query.trim().toLowerCase()
    if (trimmed) {
      rows = rows.filter(
        (row) =>
          row.name.toLowerCase().includes(trimmed) ||
          row.path.toLowerCase().includes(trimmed),
      )
    }

    const sorted = [...rows]
    switch (sort) {
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'loc-desc':
        sorted.sort((a, b) => b.loc - a.loc)
        break
      case 'loc-asc':
        sorted.sort((a, b) => a.loc - b.loc)
        break
      case 'name-asc':
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return sorted
  }, [rowsByActiveTab, query, sort])

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage))
  const currentPage = Math.min(page, pageCount - 1)
  const paginatedRows = useMemo(
    () =>
      filteredRows.slice(
        currentPage * rowsPerPage,
        currentPage * rowsPerPage + rowsPerPage,
      ),
    [filteredRows, currentPage, rowsPerPage],
  )

  const startIndex = currentPage * rowsPerPage + 1
  const endIndex = Math.min(filteredRows.length, (currentPage + 1) * rowsPerPage)

  const getDisplayFileName = (row: ProgramRow) => getFileName(row)

  const blurActiveElement = () => {
    const active = document.activeElement
    if (active instanceof HTMLElement) {
      active.blur()
    }
  }

  const handleOpenView = async (row: ProgramRow) => {
    blurActiveElement()
    setSelectedRow(row)
    setViewDialogOpen(true)
    setIsLoadingContent(true)
    setSelectedContent('')
    try {
      if (row.fileId) {
        const content = await getFileContent(row.fileId)
        setSelectedContent(content || '')
      } else {
        setSelectedContent('File content is not available because fileId is missing.')
      }
    } catch (error) {
      console.error(error)
      setSelectedContent('Failed to load file content.')
    } finally {
      setIsLoadingContent(false)
    }
  }

  const handleDownload = () => {
    if (!selectedRow) return
    const blob = new Blob([selectedContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = getDisplayFileName(selectedRow)
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  const handleOpenInfo = (row: ProgramRow) => {
    blurActiveElement()
    setSelectedRow(row)
    setInfoDialogOpen(true)
  }

  const handleRegenerate = async (row: ProgramRow) => {
    if (!row.fileId) {
      setToast(`Cannot re-generate: no file id for ${getDisplayFileName(row)}.`)
      return
    }
    setRegeneratingFileId(row.fileId)
    try {
      await analyzeCobolFile(row.fileId)
      setToast(`Design documents re-generated for ${getDisplayFileName(row)}.`)
      await onRegenerateComplete?.(row.fileId)
    } catch (error) {
      console.error(error)
      setToast(`Re-generate failed for ${getDisplayFileName(row)}.`)
    } finally {
      setRegeneratingFileId(null)
    }
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        px: 3,
        py: 2.75,
        gap: 2,
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
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
          }}
        >
          <CodeOutlinedIcon sx={{ fontSize: 18, color: 'var(--accent)' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600 }}>COBOL Programs</Typography>
          <Typography sx={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
            Generate documentation for individual programs.
          </Typography>
        </Box>
      </Box>

      {/* Tabs + filters */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderRadius: 2,
          px: 1.75,
          py: 1.25,
          bgcolor: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          TabIndicatorProps={{ style: { display: 'none' } }}
          sx={{
            minHeight: 0,
            borderRadius: 999,
            px: 0.5,
            py: 0.5,
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-inset-highlight-subtle)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            '& .MuiTabs-flexContainer': {
              gap: 0.25,
            },
            '& .MuiTabs-scrollButtons': {
              width: 30,
              height: 30,
              borderRadius: 999,
              color: 'var(--text-secondary)',
              transition:
                'opacity 0.18s ease, background-color 0.18s ease, color 0.18s ease',
              opacity: 0,
              pointerEvents: 'none',
              '&:hover': {
                bgcolor: 'var(--glass-hover-bg)',
                color: 'var(--text-primary)',
              },
              '&.Mui-disabled': {
                opacity: 0,
              },
            },
            '&:hover .MuiTabs-scrollButtons': {
              opacity: 1,
              pointerEvents: 'auto',
            },
            '& .MuiTab-root': {
              minHeight: 0,
              px: 2,
              py: 0.6,
              borderRadius: 999,
              textTransform: 'none',
              fontSize: 12.5,
              fontWeight: 600,
              color: 'var(--text-secondary)',
              alignItems: 'center',
              gap: 0.75,
              transition:
                'background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
              '&:hover': {
                bgcolor: 'var(--glass-hover-bg)',
                color: 'var(--text-primary)',
                transform: 'translateY(-1px)',
              },
            },
            '& .MuiTab-root.Mui-selected': {
              bgcolor: 'var(--glass-hover-bg)',
              color: 'var(--text-primary)',
              boxShadow: 'inset 0 0 0 1px var(--accent)',
            },
            '& .MuiTab-root.Mui-selected:hover': {
              bgcolor: 'var(--glass-hover-bg)',
              boxShadow: 'inset 0 0 0 1px var(--accent-hover)',
            },
          }}
        >
          {artefactTabs.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              label={
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <span>{tab.label}</span>
                  <Chip
                    label={tab.count}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      px: 0.6,
                      borderRadius: 999,
                      border: '1px solid var(--glass-border)',
                      bgcolor: 'var(--bg-surface)',
                    }}
                  />
                </Stack>
              }
            />
          ))}
        </Tabs>

        <Box sx={{ flex: 1 }} />

        {/* Filter input */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.25,
            py: 0.55,
            borderRadius: '999px',
            bgcolor: 'var(--bg-surface)',
            border: '1px solid var(--glass-border)',
            maxWidth: 260,
          }}
        >
          <SearchIcon sx={{ fontSize: 16, color: 'var(--text-secondary)' }} />
          <InputBase
            placeholder="Filter..."
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

        {/* Sort select */}
        <Select
          size="small"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          sx={{
            fontSize: 12,
            minWidth: 110,
            borderRadius: 999,
            bgcolor: 'var(--bg-surface)',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--glass-border)',
            },
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <MenuItem key={opt.id} value={opt.id} sx={{ fontSize: 12 }}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
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
            py: 1.25,
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Showing {startIndex.toLocaleString()} - {endIndex.toLocaleString()} of{' '}
            {filteredRows.length.toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
          }}
        >
          {paginatedRows.length === 0 ? (
            <Box sx={{ px: 2, py: 2.5 }}>
              <Typography sx={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                No program files found in this session yet.
              </Typography>
            </Box>
          ) : (
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
              '& thead th.MuiTableCell-stickyHeader': {
                backgroundColor: 'var(--bg-surface)',
              },
              '& td': {
                borderBottom: '1px solid var(--glass-border)',
                fontSize: 12.5,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell width="26%">Name</TableCell>
                <TableCell width="8%">LOC</TableCell>
                <TableCell width="9%">Type</TableCell>
                <TableCell width="18%">Tags</TableCell>
                <TableCell>Path</TableCell>
                <TableCell align="center" width="12%">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row, index) => (
                <TableRow
                  key={`${row.fileId ?? row.path ?? row.name}-${index}`}
                  hover
                  sx={{
                    '&:hover': {
                      bgcolor: 'var(--glass-hover-bg)',
                    },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          fontFeatureSettings: '"tnum" 1, "lnum" 1',
                        }}
                      >
                        {getDisplayFileName(row)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12.5,
                        fontFeatureSettings: '"tnum" 1, "lnum" 1',
                      }}
                    >
                      {row.loc}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.type}
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
                    <Stack direction="row" spacing={0.75} flexWrap="wrap">
                      {row.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: 10,
                            borderRadius: 999,
                            bgcolor: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                          }}
                        />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 520,
                      }}
                    >
                      {row.path}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => handleOpenView(row)}>
                          <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Info">
                        <IconButton size="small" onClick={() => handleOpenInfo(row)}>
                          <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Re-generate design documents">
                        <span>
                          <IconButton
                            size="small"
                            disabled={!row.fileId || regeneratingFileId === row.fileId}
                            onClick={() => void handleRegenerate(row)}
                            aria-busy={regeneratingFileId === row.fileId}
                          >
                            {regeneratingFileId === row.fileId ? (
                              <CircularProgress size={14} thickness={5} />
                            ) : (
                              <AutorenewIcon sx={{ fontSize: 16 }} />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </Box>

        {/* Pagination footer */}
        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              disabled={currentPage === 0}
              onClick={() => setPage(0)}
            >
              <FirstPageIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              size="small"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeftIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              size="small"
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              <ChevronRightIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              size="small"
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPage(pageCount - 1)}
            >
              <LastPageIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
          <Typography sx={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
            Page {currentPage + 1} of {pageCount}
          </Typography>
        </Box>
      </Box>
      <Dialog
        open={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false)
          setIsViewFullScreen(false)
        }}
        fullWidth
        maxWidth="lg"
        fullScreen={isViewFullScreen}
      >
        <DialogTitle sx={{ color: 'var(--text-primary)' }}>
          View Source - {selectedRow ? getDisplayFileName(selectedRow) : ''}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            bgcolor: 'var(--code-bg)',
            color: 'var(--code-fg)',
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: 12,
            whiteSpace: 'pre',
            overflowX: 'auto',
          }}
        >
          {isLoadingContent ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <CircularProgress size={16} />
              <Typography sx={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                Loading source code...
              </Typography>
            </Stack>
          ) : (
            selectedContent || 'No content available.'
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<OpenInFullOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={() => setIsViewFullScreen(true)}
            disabled={isViewFullScreen}
          >
            Expand
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={handleDownload}
            disabled={!selectedContent}
          >
            Download
          </Button>
          <Button
            onClick={() => {
              setViewDialogOpen(false)
              setIsViewFullScreen(false)
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ color: 'var(--text-primary)' }}>
          File Info — {selectedRow ? getDisplayFileName(selectedRow) : ''}
        </DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <Stack spacing={1.25}>
              <Typography sx={{ fontSize: 13 }}>
                <strong>Name:</strong> {getDisplayFileName(selectedRow)}
              </Typography>
              <Typography sx={{ fontSize: 13 }}>
                <strong>Path:</strong> {selectedRow.path}
              </Typography>
              <Typography sx={{ fontSize: 13 }}>
                <strong>LOC:</strong> {selectedRow.loc}
              </Typography>
              <Typography sx={{ fontSize: 13 }}>
                <strong>Type:</strong> {selectedRow.type}
              </Typography>
              <Typography sx={{ fontSize: 13 }}>
                <strong>Status:</strong> {selectedRow.status ?? 'unknown'}
              </Typography>
              <Typography sx={{ fontSize: 13 }}>
                <strong>Tags:</strong> {selectedRow.tags.join(', ') || '-'}
              </Typography>
              <Typography sx={{ fontSize: 13 }}>
                <strong>File ID:</strong> {selectedRow.fileId ?? '-'}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="info" variant="filled" onClose={() => setToast(null)}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  )
}

