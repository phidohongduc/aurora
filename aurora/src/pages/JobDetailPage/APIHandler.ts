import type { ApiResponse, JobRequisition, CV } from '@/types'

// Mock data
const mockJobs: Record<string, JobRequisition> = {
  '1': {
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
  '2': {
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
  '3': {
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
  '4': {
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
  '5': {
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
}

const mockCVsByJob: Record<string, CV[]> = {
  '1': [
    { id: 'cv1', fileName: 'john_doe_resume.pdf', fileSize: 245000, uploadedAt: '2025-12-21T10:30:00Z', status: 'reviewed' },
    { id: 'cv2', fileName: 'jane_smith_cv.pdf', fileSize: 189000, uploadedAt: '2025-12-21T11:45:00Z', status: 'shortlisted' },
    { id: 'cv3', fileName: 'bob_wilson_resume.docx', fileSize: 156000, uploadedAt: '2025-12-22T09:00:00Z', status: 'pending' },
  ],
  '2': [
    { id: 'cv4', fileName: 'alice_johnson_pm.pdf', fileSize: 278000, uploadedAt: '2025-12-20T14:00:00Z', status: 'pending' },
  ],
  '3': [],
  '4': [
    { id: 'cv5', fileName: 'data_analyst_resume.pdf', fileSize: 198000, uploadedAt: '2025-12-16T10:00:00Z', status: 'rejected' },
  ],
  '5': [
    { id: 'cv6', fileName: 'devops_engineer.pdf', fileSize: 220000, uploadedAt: '2025-12-18T15:30:00Z', status: 'reviewed' },
    { id: 'cv7', fileName: 'cloud_specialist.pdf', fileSize: 245000, uploadedAt: '2025-12-19T09:15:00Z', status: 'pending' },
  ],
}

// Simulate API delay (1-2 seconds)
const simulateDelay = () => new Promise(resolve =>
  setTimeout(resolve, Math.random() * 1000 + 1000)
)

export async function getJobDetail(id: string): Promise<ApiResponse<JobRequisition | null>> {
  await simulateDelay()

  const job = mockJobs[id]

  if (!job) {
    return {
      data: null,
      success: false,
      message: 'Job not found',
    }
  }

  return {
    data: job,
    success: true,
    message: 'Job fetched successfully',
  }
}

export async function getJobCVs(jobId: string): Promise<ApiResponse<CV[]>> {
  await simulateDelay()

  const cvs = mockCVsByJob[jobId] || []

  return {
    data: cvs,
    success: true,
    message: 'CVs fetched successfully',
  }
}

export async function updateJobStatus(
  id: string,
  status: JobRequisition['status']
): Promise<ApiResponse<JobRequisition | null>> {
  await simulateDelay()

  const job = mockJobs[id]

  if (!job) {
    return {
      data: null,
      success: false,
      message: 'Job not found',
    }
  }

  const updatedJob = { ...job, status, updatedAt: new Date().toISOString() }
  mockJobs[id] = updatedJob

  return {
    data: updatedJob,
    success: true,
    message: 'Job status updated successfully',
  }
}
