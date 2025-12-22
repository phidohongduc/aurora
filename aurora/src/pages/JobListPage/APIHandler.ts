import type { ApiResponse, JobRequisition } from '@/types'

// Mock data
const mockJobs: JobRequisition[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'Full-time',
    hiringManager: 'Sarah Johnson',
    targetYearsMin: 5,
    targetYearsMax: 10,
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    niceToHaveSkills: ['AWS', 'Docker', 'GraphQL'],
    salaryMin: 150000,
    salaryMax: 200000,
    status: 'open',
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2025-12-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'Hybrid',
    employmentType: 'Full-time',
    hiringManager: 'Michael Chen',
    targetYearsMin: 3,
    targetYearsMax: 7,
    requiredSkills: ['Product Strategy', 'Agile', 'User Research'],
    niceToHaveSkills: ['SQL', 'Figma', 'Data Analysis'],
    salaryMin: 130000,
    salaryMax: 170000,
    status: 'open',
    createdAt: '2025-12-19T14:30:00Z',
    updatedAt: '2025-12-19T14:30:00Z',
  },
  {
    id: '3',
    title: 'UX Designer',
    department: 'Design',
    location: 'Remote',
    employmentType: 'Full-time',
    hiringManager: 'Emily Davis',
    targetYearsMin: 2,
    targetYearsMax: 5,
    requiredSkills: ['Figma', 'User Research', 'Prototyping'],
    niceToHaveSkills: ['HTML/CSS', 'Motion Design', 'Design Systems'],
    salaryMin: 100000,
    salaryMax: 140000,
    status: 'open',
    createdAt: '2025-12-18T09:15:00Z',
    updatedAt: '2025-12-18T09:15:00Z',
  },
  {
    id: '4',
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Onsite',
    employmentType: 'Full-time',
    hiringManager: 'David Kim',
    targetYearsMin: 2,
    targetYearsMax: 4,
    requiredSkills: ['SQL', 'Python', 'Tableau'],
    niceToHaveSkills: ['Machine Learning', 'R', 'Looker'],
    salaryMin: 90000,
    salaryMax: 120000,
    status: 'closed',
    createdAt: '2025-12-15T11:00:00Z',
    updatedAt: '2025-12-21T16:00:00Z',
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
    salaryMin: 140000,
    salaryMax: 180000,
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
