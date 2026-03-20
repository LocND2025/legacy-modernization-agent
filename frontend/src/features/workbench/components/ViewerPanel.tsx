import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import mermaid from 'mermaid'
import type { ProgramDocument } from './DocumentsPanel'

export interface ViewerPanelProps {
  selectedDocument: ProgramDocument | null
}

export function ViewerPanel({ selectedDocument }: ViewerPanelProps) {
  const isEmpty = !selectedDocument
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    mermaid.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'neutral' })
    // Chạy lại render cho tất cả block mermaid trong viewer
    mermaid.run()
  }, [selectedDocument])

  const handleDownload = () => {
    if (!selectedDocument) return
    const blob = new Blob([selectedDocument.markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    const baseName = selectedDocument.name?.trim() || `${selectedDocument.code}.md`
    anchor.download = baseName
      .replace(/[\\/:*?"<>|]+/g, '_')
      .replace(/\s+/g, '_')
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
        bgcolor: 'transparent',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          pt: 2,
          pb: 1.5,
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexShrink: 0,
        }}
      >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!isEmpty && (
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--glass-hover-bg)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--glass-glow)',
                color: 'var(--accent)',
                flexShrink: 0,
                transform: 'translateY(0)',
                transition:
                  'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  borderColor: 'var(--accent)',
                  boxShadow: '0 0 0 1px var(--glass-border), var(--glass-glow)',
                },
              }}
            >
              <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: 1,
                lineHeight: 1,
              }}
            >
              {isEmpty ? 'Viewer' : 'Program Viewer'}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
              {isEmpty ? 'No document selected' : selectedDocument.code}
            </Typography>
          </Box>
        </Box>

        {!isEmpty && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {/* <Box
              sx={{
                px: 1.5,
                py: 0.4,
                borderRadius: 999,
              bgcolor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)' }}>
                Programs · {selectedDocument.count}
              </Typography>
            </Box> */}

            <Tooltip title="Expand">
              <IconButton
                size="small"
                sx={{
                  color: 'var(--text-secondary)',
                  '&:hover': { bgcolor: 'var(--glass-hover-bg)', color: 'var(--text-primary)' },
                }}
                onClick={() => setIsExpanded(true)}
              >
                <OpenInFullOutlinedIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download">
              <IconButton
                size="small"
                sx={{
                  color: 'var(--text-secondary)',
                  '&:hover': { bgcolor: 'var(--glass-hover-bg)', color: 'var(--text-primary)' },
                }}
                onClick={handleDownload}
              >
                <FileDownloadOutlinedIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="More options">
              <IconButton
                size="small"
                sx={{
                  color: 'var(--text-secondary)',
                  '&:hover': { bgcolor: 'var(--glass-hover-bg)', color: 'var(--text-primary)' },
                }}
              >
                <MoreHorizOutlinedIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Content area */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          px: 3,
          py: 3,
          display: 'flex',
          alignItems: isEmpty ? 'center' : 'flex-start',
          justifyContent: isEmpty ? 'center' : 'center',
        }}
      >
        {isEmpty ? (
          <EmptyViewerState />
        ) : (
          <DocumentContent document={selectedDocument} />
        )}
      </Box>
      </Box>

      <Dialog
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: 'var(--bg-base)',
          },
        }}
      >
      <DialogTitle sx={{ color: 'var(--text-primary)', fontWeight: 800, pt: 2 }}>
        {selectedDocument?.name?.trim() || `${selectedDocument?.code ?? 'document'}.md`}
      </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
          }}
        >
          {selectedDocument ? <DocumentContent document={selectedDocument} /> : null}
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
            onClick={() => setIsExpanded(false)}
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

interface DocumentContentProps {
  document: ProgramDocument
}

function DocumentContent({ document }: DocumentContentProps) {
  const cleanedMarkdown = document.markdown.replace(
    /^<!--[\s\S]*?-->\s*/,
    '',
  )

  return (
    <Box
      sx={{
        width: '100%',
        // maxWidth: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      {/* Info card */}
      {/* <Box
        sx={{
          p: 2.5,
          borderRadius: '14px',
          bgcolor: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 700, fontSize: 16, letterSpacing: 0.3 }}>
            {document.code}
          </Typography>
          <Box
            sx={{
              px: 1.25,
              py: 0.3,
              borderRadius: 999,
              bgcolor: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
            }}
          >
            <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: 'var(--success)' }}>
              Active
            </Typography>
          </Box>
        </Box>

        <Typography sx={{ color: 'var(--text-secondary)', fontSize: 12.5, lineHeight: 1.7 }}>
          COBOL program <strong>{document.code}</strong> の詳細設計書（detail_design.md）のプレビューです。
          実際のシステムでは、この内容がリポジトリ上の Markdown ファイルから読み込まれます。
        </Typography>
      </Box> */}

      {/* Markdown preview */}
      <Box
        sx={{
          mt: 1,
          borderRadius: 2,
          border: '1px solid var(--glass-border)',
          bgcolor: 'var(--bg-elevated)',
          p: 2,
          maxHeight: '100%',
          overflow: 'auto',
          fontSize: 20,
          lineHeight: 1.8,
          '& h1': {
            fontSize: 40,
            fontWeight: 700,
            mb: 1.5,
          },
          '& h2': {
            fontSize: 32,
            fontWeight: 600,
            mt: 2,
            mb: 1,
          },
          '& h3': {
            fontSize: 28,
            fontWeight: 600,
            mt: 1.5,
            mb: 0.75,
          },
          '& p': {
            mb: 1,
            color: 'var(--text-secondary)',
          },
          '& ul, & ol': {
            pl: 3,
            mb: 1.25,
          },
          '& code': {
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: 14,
            bgcolor: 'var(--bg-elevated)',
            px: 0.5,
            py: 0.1,
            borderRadius: 0.75,
          },
          '& pre code': {
            display: 'block',
            bgcolor: 'var(--bg-elevated)',
            p: 1.5,
            borderRadius: 1.5,
            border: '1px solid var(--border)',
            whiteSpace: 'pre',
            overflowX: 'auto',
          },
          '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 14,
            mb: 2,
          },
          '& th, & td': {
            border: '1px solid var(--border)',
            padding: '4px 8px',
          },
          '& th': {
            bgcolor: 'var(--bg-elevated)',
            fontWeight: 600,
          },
          '& hr': {
            border: 'none',
            borderTop: '1px solid var(--border)',
            my: 2,
          },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={
            {
              code(props) {
                const {
                  inline,
                  className,
                  children,
                  ...rest
                } = props as {
                  inline?: boolean
                  className?: string
                  children?: React.ReactNode
                }

                const match = /language-(\w+)/.exec(className || '')
                const lang = match && match[1]

                if (!inline && lang === 'mermaid') {
                  return (
                    <Box
                      component="div"
                      className="mermaid"
                      sx={{ my: 2 }}
                      {...rest}
                    >
                      {String(children).replace(/\n$/, '')}
                    </Box>
                  )
                }

                return (
                  <Box
                    component="code"
                    className={className}
                    {...rest}
                  >
                    {children}
                  </Box>
                )
              },
            } satisfies Components
          }
        >
          {cleanedMarkdown}
        </ReactMarkdown>
      </Box>
    </Box>
  )
}

function EmptyViewerState() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2.5,
      }}
    >
      {/* Glow icon container */}
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <Box
          sx={{
            position: 'absolute',
            inset: -16,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, var(--glass-hover-bg) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--glass-bg)',
            border: '1px dashed var(--glass-border)',
            boxShadow: 'var(--glass-glow)',
          }}
        >
          <DescriptionOutlinedIcon
            sx={{ fontSize: 36, color: 'var(--text-secondary)' }}
          />
        </Box>
      </Box>

      <Box sx={{ maxWidth: 340 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.75 }}>
          Select a document to view
        </Typography>
        <Typography
          sx={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}
        >
          Choose a program document from the sidebar to view details, analysis,
          and code excerpts here.
        </Typography>
      </Box>
    </Box>
  )
}
