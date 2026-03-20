import { useEffect, useMemo, useState } from 'react'
import type React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import InputBase from '@mui/material/InputBase'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { getFileContent, type SourceTreeNodeDto } from '../../../api/cobolApi'

type SourceNodeKind = 'folder' | 'file'

interface SourceNodeBase {
  id: string
  name: string
  kind: SourceNodeKind
}

interface SourceFolderNode extends SourceNodeBase {
  kind: 'folder'
  children: SourceNode[]
}

interface SourceFileNode extends SourceNodeBase {
  kind: 'file'
  path: string
  fileId?: string
}

type SourceNode = SourceFolderNode | SourceFileNode

const SOURCE_TREE: SourceNode[] = [
  {
    id: 'root',
    name: '# Source Tree (/app/data/cb/sessions/095b88b7-76b5-4419-8cc0-…)',
    kind: 'folder',
    children: [
      {
        id: 'cobol-root',
        name: 'cobol_internal_line_investigation',
        kind: 'folder',
        children: [
          {
            id: 'jcl-root',
            name: '01_JCL',
            kind: 'folder',
            children: [
              {
                id: 'dpmastjcl',
                name: 'DPMASTJCL',
                kind: 'folder',
                children: [],
              },
            ],
          },
          {
            id: 'pgm-root',
            name: '02_PGM(COBOL)',
            kind: 'folder',
            children: [
              {
                id: 'hd45-mast-srclib',
                name: 'HD45.MAST.SRCLIB',
                kind: 'folder',
                children: [],
              },
              {
                id: 'mast-root',
                name: 'MAST',
                kind: 'folder',
                children: [],
              },
              {
                id: 'tmu-mast-srclib',
                name: 'TMU.MAST.SRCLIB',
                kind: 'folder',
                children: [],
              },
            ],
          },
          {
            id: 'copy-root',
            name: '03_COPYQ\'AN',
            kind: 'folder',
            children: [
              {
                id: 'dp-cobcopy',
                name: 'DP.COBCOPY',
                kind: 'folder',
                children: [
                  {
                    id: 'hd89chos-cpy',
                    name: 'HD89CHOS.cpy',
                    kind: 'file',
                    path: 'cobol_internal_line_investigation/03_COPYQ\'AN/DP.COBCOPY/HD89CHOS.cpy',
                  },
                ],
              },
              {
                id: 'hd89m-copys',
                name: 'HD89M140.cpy',
                kind: 'file',
                path: 'cobol_internal_line_investigation/03_COPYQ\'AN/HD89M140.cpy',
              },
            ],
          },
        ],
      },
    ],
  },
]

const MOCK_SOURCE_CONTENT = `       01  HD89-CHOS-HDR-REC.
           03  TIAKUJKN                PIC  X(01).
           03  TYOSAYPN                PIC  X(02).
           03  TKEY-1                  PIC  X(01).
           03  TITKJU                  PIC  X(03).
           03  TUKKAKU                 PIC  X(02).
           03  JIKITSU                 PIC  X(03).
           03  SITYONAMA               PIC  X(08).
           03  TYOSAYN-4               PIC  X(04).
           03  TYOSAYN-VEN             PIC  X(02).
               ...
           03  TYOSAY-TERM             PIC  X(02).
`

interface SourcePanelProps {
  sessionId?: string
  treeData?: SourceTreeNodeDto[]
}

function mapTreeNode(node: SourceTreeNodeDto): SourceNode {
  if (node.kind === 'file') {
    return {
      id: node.id,
      name: node.name,
      kind: 'file',
      path: node.relativePath ?? node.name,
      fileId: node.fileId ?? undefined,
    }
  }

  return {
    id: node.id,
    name: node.name,
    kind: 'folder',
    children: node.children.map(mapTreeNode),
  }
}

export function SourcePanel({ sessionId, treeData }: SourcePanelProps) {
  const mappedTree = useMemo(
    () => (treeData ? treeData.map(mapTreeNode) : SOURCE_TREE),
    [treeData],
  )
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    root: true,
    'cobol-root': true,
    'copy-root': true,
    'dp-cobcopy': true,
  })
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [fileContent, setFileContent] = useState(MOCK_SOURCE_CONTENT)
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    if (!treeData || treeData.length === 0) return

    const expandedMap: Record<string, boolean> = {}
    const expandFolders = (nodes: SourceNode[], depth: number) => {
      for (const node of nodes) {
        if (node.kind === 'folder') {
          if (depth <= 1) expandedMap[node.id] = true
          expandFolders(node.children, depth + 1)
        }
      }
    }
    expandFolders(mappedTree, 0)
    setExpanded(expandedMap)
  }, [treeData, mappedTree])

  const handleToggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const selectedPath =
    (findFileNodeById(mappedTree, selectedFileId ?? '') as SourceFileNode | undefined)
      ?.path ?? ''

  const selectedNode = findFileNodeById(mappedTree, selectedFileId ?? '') as
    | SourceFileNode
    | undefined

  const handleSelectFile = async (id: string) => {
    setSelectedFileId(id)
    const fileNode = findFileNodeById(mappedTree, id) as SourceFileNode | undefined
    if (!fileNode) return

    if (sessionId && fileNode.fileId) {
      try {
        const content = await getFileContent(fileNode.fileId)
        setFileContent(content || '')
      } catch (error) {
        console.error(error)
        setFileContent('Failed to load file content.')
      }
      return
    }

    setFileContent(MOCK_SOURCE_CONTENT)
  }

  const handleDownload = () => {
    if (!selectedNode) return
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    const fileName = (selectedNode.name || 'source.txt')
      .replace(/[\\/:*?"<>|]+/g, '_')
      .replace(/\s+/g, '_')
    anchor.download = fileName
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  return (
    <>
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
          '& .MuiListItemText-primary': {
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
          <DescriptionOutlinedIcon sx={{ fontSize: 18, color: 'var(--accent)' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600 }}>Source Explorer</Typography>
          <Typography sx={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
            Browse and view project files.
          </Typography>
        </Box>
      </Box>

      {/* Main split view */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '320px minmax(0, 1fr)',
          gap: 2,
        }}
      >
        {/* Left: tree */}
        <Box
          sx={{
            borderRadius: 2,
            border: '1px solid var(--glass-border)',
            bgcolor: 'var(--glass-bg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Tree header search */}
          <Box
            sx={{
              px: 1.75,
              py: 1.25,
              borderBottom: '1px solid var(--glass-border)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.25,
                py: 0.6,
                borderRadius: '10px',
                bgcolor: 'var(--bg-surface)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <SearchIcon sx={{ fontSize: 16, color: 'var(--text-secondary)' }} />
              <InputBase
                placeholder="Filter files..."
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

          {/* Tree list */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              px: 0.75,
              py: 0.75,
            }}
          >
            {mappedTree.length === 0 ? (
              <Box sx={{ px: 1.25, py: 1 }}>
                <Typography sx={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                  No source files available for this session.
                </Typography>
              </Box>
            ) : (
              <List dense disablePadding>
                {mappedTree.map((node) => (
                  <SourceTreeNode
                    key={node.id}
                    node={node}
                    level={0}
                    expanded={expanded}
                    onToggle={handleToggle}
                    selectedFileId={selectedFileId}
                    onSelectFile={handleSelectFile}
                    query={query}
                  />
                ))}
              </List>
            )}
          </Box>
        </Box>

        {/* Right: viewer */}
        <Box
          sx={{
            borderRadius: 2,
            border: '1px solid var(--glass-border)',
            bgcolor: 'var(--bg-elevated)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Viewer header */}
          <Box
            sx={{
              px: 2,
              py: 1.25,
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                color: 'var(--text-secondary)',
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {selectedPath || 'Select a source file from the tree.'}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<OpenInFullOutlinedIcon sx={{ fontSize: 16 }} />}
                onClick={() => setIsFullScreen(true)}
                disabled={!selectedNode}
                sx={{
                  borderRadius: '999px',
                  fontSize: 12,
                  textTransform: 'none',
                  borderColor: 'var(--glass-border)',
                  color: 'var(--text-primary)',
                }}
              >
                Expand
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadOutlinedIcon sx={{ fontSize: 16 }} />}
                onClick={handleDownload}
                disabled={!selectedNode}
                sx={{
                  borderRadius: '999px',
                  fontSize: 12,
                  textTransform: 'none',
                  borderColor: 'var(--glass-border)',
                  color: 'var(--text-primary)',
                }}
              >
                Download
              </Button>
            </Stack>
          </Box>

          {/* Code viewer */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: 'auto',
              px: 3,
              py: 2,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: 12,
              color: 'var(--code-fg)',
              background: 'var(--code-bg)',
            }}
          >
            <CodeBlockWithLineNumbers content={selectedNode ? fileContent : 'Select a source file from the tree.'} />
          </Box>
        </Box>
      </Box>
      </Box>

      <Dialog
        open={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        fullScreen
        PaperProps={{
          sx: { bgcolor: 'var(--bg-base)' },
        }}
      >
        <DialogTitle sx={{ color: 'var(--text-primary)', fontWeight: 800, pt: 2 }}>
          {selectedNode?.name?.trim() || 'source'}
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2.5,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: 12,
              color: 'var(--code-fg)',
              background: 'var(--code-bg)',
              minHeight: '100%',
            }}
          >
            <CodeBlockWithLineNumbers
              content={selectedNode ? fileContent : 'Select a source file from the tree.'}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            position: 'sticky',
            bottom: 0,
            bgcolor: 'var(--bg-base)',
            py: 1.5,
            px: 3,
          }}
        >
          <Button
            variant="contained"
            onClick={() => setIsFullScreen(false)}
            sx={{
              borderRadius: 999,
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-base)',
              '&:hover': { backgroundColor: 'var(--accent-hover)' },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

interface SourceTreeNodeProps {
  node: SourceNode
  level: number
  expanded: Record<string, boolean>
  onToggle: (id: string) => void
  selectedFileId: string | null
  onSelectFile: (id: string) => void
  query: string
}

function SourceTreeNode({
  node,
  level,
  expanded,
  onToggle,
  selectedFileId,
  onSelectFile,
  query,
}: SourceTreeNodeProps) {
  const matchesQuery =
    !query ||
    node.name.toLowerCase().includes(query.toLowerCase()) ||
    (node.kind === 'file' &&
      (node as SourceFileNode).path.toLowerCase().includes(query.toLowerCase()))

  if (node.kind === 'folder') {
    const isExpanded = expanded[node.id] ?? false
    const hasChildren = node.children.length > 0
    const visibleChildren = node.children
      .map((child) => (
        <SourceTreeNode
          key={child.id}
          node={child}
          level={level + 1}
          expanded={expanded}
          onToggle={onToggle}
          selectedFileId={selectedFileId}
          onSelectFile={onSelectFile}
          query={query}
        />
      ))
      .filter(Boolean) as React.ReactElement[]

    if (!matchesQuery && visibleChildren.length === 0) {
      return null
    }

    return (
      <Box>
        <ListItemButton
          onClick={() => hasChildren && onToggle(node.id)}
          sx={{
            pl: 1 + level * 1.75,
            pr: 1.25,
            py: 0.4,
            borderRadius: '8px',
            mb: 0.15,
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
            {hasChildren ? (
              isExpanded ? (
                <ExpandMoreIcon sx={{ fontSize: 16, color: 'var(--text-secondary)' }} />
              ) : (
                <ChevronRightIcon sx={{ fontSize: 16, color: 'var(--text-secondary)' }} />
              )
            ) : (
              <Box sx={{ width: 16 }} />
            )}
          </ListItemIcon>
          <FolderOutlinedIcon
            sx={{ fontSize: 16, color: isExpanded ? 'var(--accent)' : 'var(--text-secondary)', mr: 1 }}
          />
          <ListItemText
            primaryTypographyProps={{
              fontSize: 12,
              color: 'var(--text-primary)',
            }}
            primary={node.name}
          />
        </ListItemButton>
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          {visibleChildren}
        </Collapse>
      </Box>
    )
  }

  if (!matchesQuery) {
    return null
  }

  const isSelected = selectedFileId === node.id

  return (
    <ListItemButton
      onClick={() => onSelectFile(node.id)}
      selected={isSelected}
      sx={{
        pl: 1 + level * 1.75 + 2,
        pr: 1.25,
        py: 0.4,
        borderRadius: '8px',
        mb: 0.15,
        '&.Mui-selected': {
          bgcolor: 'var(--glass-hover-bg)',
          '&:hover': {
            bgcolor: 'var(--glass-hover-bg)',
          },
        },
      }}
    >
      <DescriptionOutlinedIcon
        sx={{ fontSize: 15, color: isSelected ? 'var(--accent)' : 'var(--text-secondary)', mr: 1 }}
      />
      <ListItemText
        primaryTypographyProps={{
          fontSize: 12,
          color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
        }}
        primary={node.name}
      />
    </ListItemButton>
  )
}

interface CodeBlockWithLineNumbersProps {
  content: string
}

function CodeBlockWithLineNumbers({ content }: CodeBlockWithLineNumbersProps) {
  const lines = content.split('\n')

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        columnGap: 2,
      }}
    >
      <Box
        sx={{
          pr: 1,
          textAlign: 'right',
          color: 'var(--code-muted)',
          userSelect: 'none',
        }}
      >
        {lines.map((_, index) => (
          <Typography
            key={index}
            component="div"
            sx={{
              fontSize: 11,
              lineHeight: 1.6,
            }}
          >
            {String(index + 1).padStart(4, '0')}
          </Typography>
        ))}
      </Box>
      <Box>
        {lines.map((line, index) => (
          <Typography
            key={index}
            component="div"
            sx={{
              fontSize: 12,
              lineHeight: 1.6,
            }}
          >
            {line}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

function findFileNodeById(nodes: SourceNode[], id: string): SourceNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.kind === 'folder') {
      const child = findFileNodeById(node.children, id)
      if (child) return child
    }
  }
  return undefined
}

