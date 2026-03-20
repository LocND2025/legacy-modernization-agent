import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import type { SelectChangeEvent } from '@mui/material/Select'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalTopNavbar } from '../workbench/components/GlobalTopNavbar'
import {
  createSession,
  startSessionAnalysis,
  uploadFolderFilesToSession,
  uploadZipToSession,
} from '../../api/cobolApi'

export function NewSessionPage() {
  const [sourceLanguage, setSourceLanguage] = useState('auto')
  const [outputLanguage, setOutputLanguage] = useState('ja')
  const [sessionName, setSessionName] = useState('')
  const [projectPath, setProjectPath] = useState('')
  const [selectedZip, setSelectedZip] = useState<File | null>(null)
  const [selectedFolderFiles, setSelectedFolderFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const navigate = useNavigate()
  const zipInputRef = useRef<HTMLInputElement | null>(null)
  const folderInputRef = useRef<HTMLInputElement | null>(null)

  const handleSourceChange = (event: SelectChangeEvent) => {
    setSourceLanguage(event.target.value)
  }

  const handleOutputChange = (event: SelectChangeEvent) => {
    setOutputLanguage(event.target.value)
  }

  const handleUploadZip = () => {
    zipInputRef.current?.click()
  }

  const handleBrowseFolder = () => {
    folderInputRef.current?.click()
  }

  const handleStartAnalysis = async () => {
    setErrorMsg(null)
    if (!selectedZip && selectedFolderFiles.length === 0) {
      setErrorMsg('Please choose a ZIP file or select a folder first.')
      return
    }

    try {
      setIsSubmitting(true)
      const session = await createSession(sessionName || undefined)

      if (selectedZip) {
        await uploadZipToSession(session.id, selectedZip)
      } else if (selectedFolderFiles.length > 0) {
        await uploadFolderFilesToSession(session.id, selectedFolderFiles)
      }

      await startSessionAnalysis(session.id)
      navigate(`/dashboard/${session.id}`)
    } catch (error) {
      console.error(error)
      const message = error instanceof Error ? error.message : 'Failed to start analysis'
      setErrorMsg(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        bgcolor: 'var(--bg-base)',
        color: 'var(--text-primary)',
        '& .MuiTypography-root': {
          color: 'inherit',
        },
      }}
    >
      <GlobalTopNavbar />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          justifyContent: 'center',
          px: { xs: 2.5, md: 5 },
          pb: 6,
          pt: 4,
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1100,
          }}
        >
          <Box
            className="glass-surface"
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.15fr 1.1fr' },
              gap: 4,
              alignItems: 'center',
              mb: 4,
              px: { xs: 3, md: 4 },
              py: { xs: 3, md: 4 },
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'var(--text-secondary)', mb: 1, display: 'block' }}
              >
                NEW SESSION
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 1.5,
                  color: 'var(--text-primary)',
                }}
              >
                AI-powered code analysis, from ZIP to insights in minutes.
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'var(--text-secondary)', maxWidth: 480 }}
              >
                Drop a legacy repository or point to a folder path – we&apos;ll
                extract structure, programs, and relationships into a rich
                dashboard you can share with your team.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'stretch',
              }}
            >
              <Box
                sx={{
                  borderRadius: 3,
                  border: '1px dashed var(--glass-border)',
                  bgcolor: 'var(--glass-bg)',
                  minHeight: 260,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition:
                    'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, transform 0.15s ease',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(circle at top, var(--glass-hover-bg), transparent 55%)',
                    opacity: 0,
                    transition: 'opacity 0.25s ease',
                    pointerEvents: 'none',
                  },
                  '&:hover': {
                    borderColor: 'var(--accent)',
                    boxShadow: 'var(--glass-glow)',
                    bgcolor: 'var(--glass-hover-bg)',
                    transform: 'translateY(-2px)',
                    '&::before': {
                      opacity: 1,
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 3,
                  bgcolor: 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--glass-shadow)',
                  mb: 2.5,
                  border: '1px solid var(--border)',
                  }}
                >
                  <CloudUploadOutlinedIcon
                    sx={{ fontSize: 34, color: 'var(--accent)' }}
                  />
                </Box>
                <Typography
                  variant="body1"
                  sx={{ mb: 0.75, fontWeight: 600, textAlign: 'center' }}
                >
                  Drop your legacy project folder or ZIP here
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'var(--text-secondary)',
                    mb: 2.5,
                    textAlign: 'center',
                    maxWidth: 360,
                  }}
                >
                  We&apos;ll scan sources, detect programs, and build a navigable
                  analysis workspace.
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FolderOpenOutlinedIcon />}
                    onClick={handleBrowseFolder}
                    sx={{
                      borderRadius: 999,
                      borderColor: 'var(--border)',
                      px: 2.4,
                    }}
                  >
                    Browse Folder
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleUploadZip}
                    sx={{
                      borderRadius: 999,
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-base)',
                      px: 2.6,
                      '&:hover': { backgroundColor: 'var(--accent-hover)' },
                    }}
                  >
                    Upload ZIP
                  </Button>
                </Box>

                <input
                  ref={zipInputRef}
                  type="file"
                  accept=".zip"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null
                    setSelectedZip(file)
                    if (file) {
                      setSelectedFolderFiles([])
                      setProjectPath(file.name)
                    }
                  }}
                />
                <input
                  ref={folderInputRef}
                  type="file"
                  // @ts-expect-error non-standard browser property
                  webkitdirectory=""
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? [])
                    setSelectedFolderFiles(files)
                    if (files.length > 0) {
                      setSelectedZip(null)
                      const relative =
                        (files[0] as File & { webkitRelativePath?: string })
                          .webkitRelativePath ?? files[0].name
                      setProjectPath(relative.split('/')[0] ?? relative)
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              columnGap: 3,
              rowGap: 2.5,
              mb: 4,
            }}
          >
            {/* Row 1: PROJECT PATH + SOURCE LANGUAGE */}
            <Box>
              <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                PROJECT PATH
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="/path/to/your/project"
                value={projectPath}
                onChange={(e) => setProjectPath(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--border)',
                  },
                  '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--accent-hover)',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--accent)',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'var(--text-secondary)',
                    opacity: 1,
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                SOURCE LANGUAGE
              </Typography>
              <Select
                fullWidth
                size="small"
                value={sourceLanguage}
                onChange={handleSourceChange}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--border)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--accent-hover)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--accent)',
                  },
                  '& .MuiSelect-select': {
                    color: 'var(--text-primary)',
                  },
                }}
              >
                <MenuItem value="auto">Auto-detect</MenuItem>
                <MenuItem value="cobol">COBOL</MenuItem>
                <MenuItem value="java">Java</MenuItem>
                <MenuItem value="pli">PL/I</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </Box>

            {/* Row 2: SESSION NAME + OUTPUT LANGUAGE */}
            <Box>
              <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                SESSION NAME (optional)
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. insuranceCore"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--border)',
                  },
                  '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--accent-hover)',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--accent)',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'var(--text-secondary)',
                    opacity: 1,
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                OUTPUT LANGUAGE
              </Typography>
              <Select
                fullWidth
                size="small"
                value={outputLanguage}
                onChange={handleOutputChange}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--border)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--accent-hover)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--accent)',
                  },
                  '& .MuiSelect-select': {
                    color: 'var(--text-primary)',
                  },
                }}
              >
                <MenuItem value="ja">Japanese</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </Box>
          </Box>

          <Collapse in={Boolean(errorMsg)} unmountOnExit>
            <Alert
              severity="error"
              onClose={() => setErrorMsg(null)}
              sx={{
                mb: 2.5,
                borderRadius: 'var(--next-frame-radius-md)',
                bgcolor: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                color: 'var(--danger)',
                '& .MuiAlert-icon': { color: 'var(--danger)' },
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)',
              }}
            >
              {errorMsg}
            </Alert>
          </Collapse>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={
                isSubmitting ? (
                  <CircularProgress size={16} sx={{ color: 'var(--bg-base)' }} />
                ) : (
                  <ArrowForwardIcon />
                )
              }
              onClick={handleStartAnalysis}
              disabled={isSubmitting}
              sx={{
                px: 6,
                py: 1.2,
                borderRadius: 999,
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-base)',
                boxShadow: 'var(--glass-shadow)',
                transition: 'background-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
                '&:hover:not(:disabled)': {
                  backgroundColor: 'var(--accent-hover)',
                  boxShadow: 'var(--glass-shadow), var(--glass-glow)',
                },
                '&:disabled': {
                  opacity: 0.7,
                  color: 'var(--bg-base)',
                },
              }}
            >
              {isSubmitting ? 'Starting analysis…' : 'Start AI analysis'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

