import { Navigate, Route, Routes } from 'react-router-dom'
import { Box } from '@mui/material'
import { WorkbenchPage } from './features/workbench/WorkbenchPage'
import { NewSessionPage } from './features/sessions/NewSessionPage'
import { SessionsPage } from './features/sessions/SessionsPage'

function App() {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'transparent',
      }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/sessions" replace />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/dashboard/:sessionId" element={<WorkbenchPage />} />
        <Route path="/sessions/new" element={<NewSessionPage />} />
        <Route path="*" element={<Box p={3}>Not found</Box>} />
      </Routes>
    </Box>
  )
}

export default App
