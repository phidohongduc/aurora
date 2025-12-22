import type { ApiResponse, JobRequisition } from '@/types'

const STORAGE_KEY = 'aurora_job_requisitions'

// Initialize with mock data if localStorage is empty
const initializeMockJobs = (): JobRequisition[] => [
  {
    id: '1',
    title: 'Senior Backend Engineer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'Full-time',
    hiringManager: 'Sarah Johnson',
    targetYearsMin: 5,
    targetYearsMax: 8,
    requiredSkills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
    niceToHaveSkills: ['Kubernetes', 'Redis', 'GraphQL'],
    status: 'active',
    candidateCount: 12,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'Hybrid',
    employmentType: 'Full-time',
    hiringManager: 'Michael Chen',
    targetYearsMin: 4,
    targetYearsMax: 7,
    requiredSkills: ['Product Strategy', 'Agile', 'Analytics', 'User Research'],
    niceToHaveSkills: ['SQL', 'Figma', 'Data Analysis'],
    status: 'active',
    candidateCount: 8,
    createdAt: '2025-01-10T14:30:00Z',
    updatedAt: '2025-01-10T14:30:00Z',
  },
  {
    id: '3',
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Onsite',
    employmentType: 'Full-time',
    hiringManager: 'Emily Davis',
    targetYearsMin: 3,
    targetYearsMax: 6,
    requiredSkills: ['React', 'TypeScript', 'CSS', 'Next.js'],
    niceToHaveSkills: ['GraphQL', 'Testing', 'Accessibility'],
    status: 'active',
    candidateCount: 15,
    createdAt: '2025-01-05T09:15:00Z',
    updatedAt: '2025-01-05T09:15:00Z',
  },
  {
    id: '4',
    title: 'Data Scientist',
    department: 'Data',
    location: 'Remote',
    employmentType: 'Full-time',
    hiringManager: 'David Kim',
    targetYearsMin: 4,
    targetYearsMax: 8,
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    niceToHaveSkills: ['PyTorch', 'Spark', 'Deep Learning'],
    status: 'paused',
    candidateCount: 6,
    createdAt: '2024-12-20T11:00:00Z',
    updatedAt: '2024-12-20T11:00:00Z',
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'Full-time',
    hiringManager: 'Sarah Johnson',
    targetYearsMin: 4,
    targetYearsMax: 8,
    requiredSkills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
    niceToHaveSkills: ['GCP', 'Ansible', 'Prometheus'],
    status: 'active',
    candidateCount: 9,
    createdAt: '2024-12-18T08:45:00Z',
    updatedAt: '2024-12-18T08:45:00Z',
  },
]

// Get jobs from localStorage or initialize with mock data
const getStoredJobs = (): JobRequisition[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    const mockJobs = initializeMockJobs()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockJobs))
    return mockJobs
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return initializeMockJobs()
  }
}

// Save jobs to localStorage
const saveJobs = (jobs: JobRequisition[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Simulate API delay (1-2 seconds)
const simulateDelay = () => new Promise(resolve =>
  setTimeout(resolve, Math.random() * 1000 + 1000)
)

export async function getJobList(): Promise<ApiResponse<JobRequisition[]>> {
  await simulateDelay()

  const jobs = getStoredJobs()

  return {
    data: jobs,
    success: true,
    message: 'Jobs fetched successfully',
  }
}

export async function deleteJob(id: string): Promise<ApiResponse<null>> {
  await simulateDelay()

  const jobs = getStoredJobs()
  const filteredJobs = jobs.filter(job => job.id !== id)
  saveJobs(filteredJobs)

  return {
    data: null,
    success: true,
    message: 'Job deleted successfully',
  }
}
