import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { FloatingDock, type DockItem } from '@/components/ui'
import HomeIcon from '@mui/icons-material/Home'
import WorkIcon from '@mui/icons-material/Work'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import {
  MainPage,
  JobListPage,
  CreateJobPage,
  JobDetailPage,
  UploadCVPage,
} from '@/pages'

const theme = createTheme({
  palette: {
    mode: 'light',
  },
})

const navigationItems: DockItem[] = [
  {
    title: 'Home',
    icon: <HomeIcon sx={{ width: '100%', height: '100%', color: 'grey.600' }} />,
    href: '/',
  },
  {
    title: 'Job Requisitions',
    icon: <WorkIcon sx={{ width: '100%', height: '100%', color: 'grey.600' }} />,
    href: '/jobs',
  },
  {
    title: 'Create Job',
    icon: <AddCircleIcon sx={{ width: '100%', height: '100%', color: 'grey.600' }} />,
    href: '/jobs/new',
  },
  {
    title: 'Upload CVs',
    icon: <UploadFileIcon sx={{ width: '100%', height: '100%', color: 'grey.600' }} />,
    href: '/jobs/1/upload',
  },
]

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1 pb-24">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/jobs" element={<JobListPage />} />
              <Route path="/jobs/new" element={<CreateJobPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/jobs/:id/upload" element={<UploadCVPage />} />
            </Routes>
          </main>
          <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
            <FloatingDock items={navigationItems} />
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
