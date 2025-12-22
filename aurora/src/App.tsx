import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { FloatingDock, type DockItem } from '@/components/ui'
import { AICompanion } from '@/components/AICompanion'
import { Home, Briefcase, PlusCircle, Users, UserCircle } from 'lucide-react'
import {
  MainPage,
  JobListPage,
  CreateJobPage,
  JobDetailPage,
  UploadCVPage,
  EmployeesPage,
  EmployeeSkillNetworkPage,
  CandidateDirectoryPage,
} from '@/pages'

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
})

const navigationItems: DockItem[] = [
  {
    title: 'Home',
    icon: <Home className="w-full h-full text-gray-600" strokeWidth={1.5} />,
    href: '/',
  },
  {
    title: 'Job Requisitions',
    icon: <Briefcase className="w-full h-full text-gray-600" strokeWidth={1.5} />,
    href: '/jobs',
  },
  {
    title: 'Create Job',
    icon: <PlusCircle className="w-full h-full text-gray-600" strokeWidth={1.5} />,
    href: '/jobs/new',
  },
  {
    title: 'Employees',
    icon: <Users className="w-full h-full text-gray-600" strokeWidth={1.5} />,
    href: '/employees',
  },
  {
    title: 'Candidates',
    icon: <UserCircle className="w-full h-full text-gray-600" strokeWidth={1.5} />,
    href: '/candidates',
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
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/skill-network" element={<EmployeeSkillNetworkPage />} />
              <Route path="/candidates" element={<CandidateDirectoryPage />} />
            </Routes>
          </main>
          <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
            <FloatingDock items={navigationItems} />
          </div>
          <AICompanion />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
