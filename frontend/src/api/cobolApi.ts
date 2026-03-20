export interface SessionInfo {
  id: string
  name: string
  status: string
  createdAt: string
  totalFiles: number
}

export interface SessionAnalysisStatus {
  sessionId: string
  status: string
  totalFiles: number
  processedFiles: number
  failedFiles: number
  currentFileId?: string | null
  currentFileName?: string | null
  startedAt?: string | null
  completedAt?: string | null
  error?: string | null
  progressPercentage: number
}

export interface SessionAnalysisFileStatus {
  fileId: string
  fileName: string
  relativePath?: string | null
  status: string
}

export interface SessionProgramItem {
  fileId: string
  fileName: string
  relativePath: string
  loc: number
  status: string
  tags: string[]
}

export interface SessionDocumentItem {
  id: string
  fileId: string
  programCode: string
  name: string
  content: string
  type: string
}

export interface SourceTreeNodeDto {
  id: string
  name: string
  kind: 'folder' | 'file'
  fileId?: string | null
  relativePath?: string | null
  children: SourceTreeNodeDto[]
}

const API_BASE = import.meta.env.VITE_COBOL_API_BASE_URL ?? ''
const COBOL_ROOT = `${API_BASE}/api/cobol`

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${COBOL_ROOT}${path}`, init)
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export async function createSession(name?: string): Promise<SessionInfo> {
  return request<SessionInfo>('/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
}

export async function getSessions(): Promise<SessionInfo[]> {
  return request<SessionInfo[]>('/sessions')
}

export async function getSession(sessionId: string): Promise<SessionInfo> {
  return request<SessionInfo>(`/sessions/${sessionId}`)
}

export async function uploadZipToSession(
  sessionId: string,
  zipFile: File,
): Promise<void> {
  const formData = new FormData()
  formData.append('zipFile', zipFile)
  await request(`/sessions/${sessionId}/upload-zip`, {
    method: 'POST',
    body: formData,
  })
}

export async function uploadFolderFilesToSession(
  sessionId: string,
  files: File[],
): Promise<void> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
    const relativePath =
      (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
      file.name
    formData.append('relativePaths', relativePath)
  })

  await request(`/sessions/${sessionId}/files:bulk`, {
    method: 'POST',
    body: formData,
  })
}

export async function startSessionAnalysis(
  sessionId: string,
): Promise<SessionAnalysisStatus> {
  return request<SessionAnalysisStatus>(`/sessions/${sessionId}/analysis/start`, {
    method: 'POST',
  })
}

export async function getSessionAnalysisStatus(
  sessionId: string,
): Promise<SessionAnalysisStatus> {
  return request<SessionAnalysisStatus>(`/sessions/${sessionId}/analysis/status`)
}

export async function getSessionAnalysisFiles(
  sessionId: string,
): Promise<SessionAnalysisFileStatus[]> {
  return request<SessionAnalysisFileStatus[]>(
    `/sessions/${sessionId}/analysis/files`,
  )
}

export async function getSessionDocuments(
  sessionId: string,
): Promise<SessionDocumentItem[]> {
  return request<SessionDocumentItem[]>(`/sessions/${sessionId}/documents`)
}

export async function getSessionPrograms(
  sessionId: string,
): Promise<SessionProgramItem[]> {
  return request<SessionProgramItem[]>(`/sessions/${sessionId}/programs`)
}

export async function getSessionSourceTree(
  sessionId: string,
): Promise<SourceTreeNodeDto[]> {
  return request<SourceTreeNodeDto[]>(`/sessions/${sessionId}/source-tree`)
}

export async function getFileContent(fileId: string): Promise<string> {
  const result = await request<{ content: string }>(`/files/${fileId}/content`)
  return result.content
}

export interface AnalyzeCobolFileResponse {
  message: string
  outputPath?: string | null
  fileId: string
}

/** Phân tích lại một file COBOL và sinh lại design documents (markdown, json, mermaid, summary). */
export async function analyzeCobolFile(
  fileId: string,
): Promise<AnalyzeCobolFileResponse> {
  return request<AnalyzeCobolFileResponse>(`/analyze/${encodeURIComponent(fileId)}`, {
    method: 'POST',
  })
}
