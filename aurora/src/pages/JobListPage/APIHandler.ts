import type { ApiResponse, JobRequisition } from '@/types'

// Mock data
const mockJobs: JobRequisition[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    description: 'We are looking for a senior software engineer to join our team.',
    status: 'open',
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2025-12-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    description: 'Lead product strategy and roadmap for our core platform.',
    status: 'open',
    createdAt: '2025-12-19T14:30:00Z',
    updatedAt: '2025-12-19T14:30:00Z',
  },
  {
    id: '3',
    title: 'UX Designer',
    department: 'Design',
    description: 'Create beautiful and intuitive user experiences.',
    status: 'open',
    createdAt: '2025-12-18T09:15:00Z',
    updatedAt: '2025-12-18T09:15:00Z',
  },
  {
    id: '4',
    title: 'Data Analyst',
    department: 'Analytics',
    description: 'Analyze data to drive business insights and decisions.',
    status: 'closed',
    createdAt: '2025-12-15T11:00:00Z',
    updatedAt: '2025-12-21T16:00:00Z',
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    department: 'Engineering',
    description: 'Build and maintain our cloud infrastructure.',
    status: 'open',
    createdAt: '2025-12-17T08:45:00Z',
    updatedAt: '2025-12-17T08:45:00Z',
  },
]

// Simulate API delay (1-2 seconds)
const simulateDelay = () => new Promise(resolve =>
  setTimeout(resolve, Math.random() * 1000 + 1000)
)

export async function getJobList(): Promise<ApiResponse<JobRequisition[]>> {
  await simulateDelay()

  return {
    data: mockJobs,
    success: true,
    message: 'Jobs fetched successfully',
  }
}

export async function deleteJob(id: string): Promise<ApiResponse<null>> {
  await simulateDelay()

  // In real app, this would delete from backend
  console.log(`Deleting job ${id}`)

  return {
    data: null,
    success: true,
    message: 'Job deleted successfully',
  }
}
