import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FloatingDock, type DockItem } from '@/components/ui'
import {
  HomeIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  DocumentArrowUpIcon,
} from '@/components/icons'
import {
  MainPage,
  JobListPage,
  CreateJobPage,
  JobDetailPage,
  UploadCVPage,
} from '@/pages'

const navigationItems: DockItem[] = [
  {
    title: 'Home',
    icon: <HomeIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    href: '/',
  },
  {
    title: 'Job Requisitions',
    icon: <BriefcaseIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    href: '/jobs',
  },
  {
    title: 'Create Job',
    icon: <PlusCircleIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    href: '/jobs/new',
  },
  {
    title: 'Upload CVs',
    icon: <DocumentArrowUpIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    href: '/jobs/1/upload',
  },
]

function App() {
  return (
    <BrowserRouter>
      <div className="relative flex min-h-screen flex-col">
        <main className="flex-1">
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
  )
}

export default App
