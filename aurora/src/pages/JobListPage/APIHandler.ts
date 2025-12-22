import type { ApiResponse, JobRequisition } from '@/types'

// Mock data
const mockJobs: JobRequisition[] = [
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
