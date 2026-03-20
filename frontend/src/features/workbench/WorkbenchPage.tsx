import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box } from '@mui/material'
import { GlobalTopNavbar } from './components/GlobalTopNavbar'
import { SessionHeaderBar } from './components/SessionHeaderBar'
import { LeftNavRail } from './components/LeftNavRail'
import {
  DocumentsPanel,
  type ProgramDocument,
} from './components/DocumentsPanel'
import { ViewerPanel } from './components/ViewerPanel'
import { FloatingStatusDock } from './components/FloatingStatusDock'
import { OverviewPanel } from './components/OverviewPanel'
import { ProgramsPanel } from './components/ProgramsPanel'
import { SourcePanel } from './components/SourcePanel'
import { GeneratePanel } from './components/GeneratePanel'
import { TemplatesPanel } from './components/TemplatesPanel'
import {
  getSession,
  getSessionAnalysisStatus,
  getSessionDocuments,
  getSessionPrograms,
  getSessionSourceTree,
  type SessionInfo,
  type SessionAnalysisStatus,
  type SourceTreeNodeDto,
} from '../../api/cobolApi'
import type { ProgramRow } from './components/ProgramsPanel'

export function WorkbenchPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [activeNav, setActiveNav] = useState<
    'docs' | 'overview' | 'programs' | 'source' | 'generate' | 'templates'
  >('docs')
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  )
  const [documents, setDocuments] = useState<ProgramDocument[]>([])
  const [programs, setPrograms] = useState<ProgramRow[]>([])
  const [sourceTree, setSourceTree] = useState<SourceTreeNodeDto[]>([])
  const [analysisStatus, setAnalysisStatus] = useState<SessionAnalysisStatus | null>(null)
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)

  const docsBadge = useMemo(() => {
    // `getSessionDocuments` trả về từng markdown document (vd: _design/_flow/_summary),
    // nên badge "Docs" nên phản ánh tổng số items markdown.
    return documents.length
  }, [documents])

  const programsBadge = useMemo(() => programs.length, [programs])

  const selectedDocument: ProgramDocument | null = useMemo(() => {
    if (!selectedDocumentId) return null
    return documents.find((doc) => doc.id === selectedDocumentId) ?? null
  }, [documents, selectedDocumentId])

  const panelDeck = useMemo(
    () =>
      [
        { key: 'overview', node: <OverviewPanel programs={programs} /> },
        { key: 'programs', node: <ProgramsPanel /> },
        { key: 'source', node: <SourcePanel /> },
        { key: 'generate', node: <GeneratePanel /> },
        { key: 'templates', node: <TemplatesPanel /> },
      ] as const,
    [programs],
  )

  useEffect(() => {
    document.body.classList.add('workbench-no-scroll')
    return () => {
      document.body.classList.remove('workbench-no-scroll')
    }
  }, [])

  useEffect(() => {
    if (!sessionId) return

    let active = true
    const loadSession = async () => {
      try {
        const session = await getSession(sessionId)
        if (active) {
          setSessionInfo(session)
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadSession()
    return () => {
      active = false
    }
  }, [sessionId])

  const reloadSessionWorkbenchData = useCallback(async (): Promise<{
    documents: ProgramDocument[]
    status: SessionAnalysisStatus
  } | null> => {
    if (!sessionId) return null
    try {
      const status = await getSessionAnalysisStatus(sessionId)

      let docs: Awaited<ReturnType<typeof getSessionDocuments>> = []
      let programItems: Awaited<ReturnType<typeof getSessionPrograms>> = []
      let tree: Awaited<ReturnType<typeof getSessionSourceTree>> = []

      try {
        ;[docs, programItems, tree] = await Promise.all([
          getSessionDocuments(sessionId),
          getSessionPrograms(sessionId),
          getSessionSourceTree(sessionId),
        ])
      } catch (panelError) {
        console.warn(panelError)
      }

      const docCounts = docs.reduce<Record<string, number>>((acc, doc) => {
        acc[doc.programCode] = (acc[doc.programCode] ?? 0) + 1
        return acc
      }, {})

      const mappedDocs: ProgramDocument[] = docs.map((doc) => ({
        id: doc.id,
        fileId: doc.fileId,
        code: doc.programCode,
        name: doc.name,
        count: docCounts[doc.programCode] ?? 1,
        markdown: doc.content,
      }))
      setDocuments(mappedDocs)
      setPrograms(
        programItems.map((p) => ({
          fileId: p.fileId,
          name: p.fileName,
          loc: p.loc,
          type: 'BATCH',
          tags: p.tags,
          path: p.relativePath,
          status: p.status,
        })),
      )
      setSourceTree(tree)
      setAnalysisStatus(status)

      return { documents: mappedDocs, status }
    } catch (error) {
      console.error(error)
      return null
    }
  }, [sessionId])

  useEffect(() => {
    if (!sessionId) return

    let active = true
    let timer: number | undefined

    const poll = async () => {
      const result = await reloadSessionWorkbenchData()
      if (!active || !result) return

      const shouldPoll =
        result.status.status === 'queued' || result.status.status === 'running'
      if (shouldPoll) {
        timer = window.setTimeout(poll, 2000)
      }
    }

    poll()
    return () => {
      active = false
      if (timer) {
        window.clearTimeout(timer)
      }
    }
  }, [sessionId, reloadSessionWorkbenchData])

  const handleProgramRegenerateComplete = useCallback(
    async (fileId: string) => {
      // Retry briefly to handle eventual consistency between analyze and docs query.
      for (let attempt = 0; attempt < 4; attempt += 1) {
        const result = await reloadSessionWorkbenchData()
        if (!result) return
        const next = result.documents.find((d) => d.fileId === fileId)
        if (next) {
          setSelectedDocumentId(next.id)
          return
        }
        await new Promise((resolve) => window.setTimeout(resolve, 500))
      }
    },
    [reloadSessionWorkbenchData],
  )

  useEffect(() => {
    if (documents.length === 0) {
      if (selectedDocumentId !== null) {
        setSelectedDocumentId(null)
      }
      return
    }

    const stillExists = selectedDocumentId
      ? documents.some((doc) => doc.id === selectedDocumentId)
      : false

    // If current selection vanished after re-gen, fallback to newest first item.
    if (!selectedDocumentId || !stillExists) {
      setSelectedDocumentId(documents[0].id)
    }
  }, [documents, selectedDocumentId])

  return (
    <Box
      sx={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'var(--bg-base)',
        overflow: 'hidden',
      }}
    >
      {/* Top bars */}
      <Box sx={{ flexShrink: 0 }}>
        <GlobalTopNavbar />
        <SessionHeaderBar
          session={
            sessionInfo
              ? {
              name: sessionInfo.name,
              tech: 'IBM ZOS ENTERPRISE COBOL',
              statusLabel: analysisStatus?.status ?? sessionInfo.status,
              updatedLabel: `Created ${new Date(sessionInfo.createdAt).toLocaleString()}`,
              owner: 'You',
            }
              : undefined
          }
        />
      </Box>

      {/* Main workspace */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          gap: 3,
          p: 2,
          pt: 1.75,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Left nav rail */}
        <LeftNavRail
          activeItem={activeNav}
          onChange={(next) => startTransition(() => setActiveNav(next))}
          docsBadge={docsBadge}
          programsBadge={programsBadge}
        />

        {activeNav === 'docs' ? (
          <>
            {/* Documents panel */}
            <Box
              key="docs-sidebar"
              className="glass-card"
              sx={{
                width: 450,
                flexShrink: 0,
                height: '100%',
                borderRadius: 'var(--next-frame-radius-lg)',
                bgcolor: 'var(--bg-surface)',
                overflow: 'hidden',
              }}
            >
              <Box className="page-transition" sx={{ height: '100%' }}>
                <DocumentsPanel
                  documents={documents}
                  selectedId={selectedDocumentId}
                  onSelect={setSelectedDocumentId}
                />
              </Box>
            </Box>

            {/* Main viewer panel */}
            <Box
              key="docs-viewer"
              className="glass-card"
              sx={{
                flex: 1,
                minWidth: 0,
                height: '100%',
                borderRadius: 'var(--next-frame-radius-lg)',
                bgcolor: 'var(--bg-surface)',
                overflow: 'hidden',
              }}
            >
              <Box className="page-transition" sx={{ height: '100%' }}>
                <ViewerPanel selectedDocument={selectedDocument} />
              </Box>
            </Box>
          </>
        ) : (
          <Box
            className="glass-card"
            sx={{
              flex: 1,
              minWidth: 0,
              height: '100%',
              borderRadius: 'var(--next-frame-radius-lg)',
              bgcolor: 'var(--bg-surface)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {panelDeck.map((panel) => {
              const isActive = activeNav === panel.key
              return (
                <Box
                  key={panel.key}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? 'translateY(0) scale(1)'
                      : 'translateY(8px) scale(0.995)',
                    transition:
                      'opacity 180ms ease, transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1)',
                    willChange: 'opacity, transform',
                    pointerEvents: isActive ? 'auto' : 'none',
                    visibility: isActive ? 'visible' : 'hidden',
                    contain: 'layout paint',
                  }}
                >
                  <Box className="page-transition" sx={{ height: '100%' }}>
                    {panel.key === 'programs' ? (
                      <ProgramsPanel
                        programs={programs}
                        onRegenerateComplete={handleProgramRegenerateComplete}
                      />
                    ) : panel.key === 'source' ? (
                      <SourcePanel sessionId={sessionId} treeData={sourceTree} />
                    ) : (
                      panel.node
                    )}
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}

        <FloatingStatusDock sessionId={sessionId ?? ''} analysisStatus={analysisStatus} />
      </Box>
    </Box>
  )
}
