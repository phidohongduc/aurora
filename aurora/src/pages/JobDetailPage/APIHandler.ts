import type { ApiResponse, JobRequisition, CV } from '@/types'

// Mock data
const mockJobs: Record<string, JobRequisition> = {
  '1': {
    id: '1',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    description: 'We are looking for a senior software engineer to join our team. The ideal candidate will have 5+ years of experience with modern web technologies including React, TypeScript, and Node.js. You will be responsible for designing and implementing scalable solutions.',
    status: 'open',
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2025-12-20T10:00:00Z',
  },
  '2': {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    description: 'Lead product strategy and roadmap for our core platform. Work closely with engineering, design, and stakeholders to deliver impactful features.',
    status: 'open',
    createdAt: '2025-12-19T14:30:00Z',
    updatedAt: '2025-12-19T14:30:00Z',
  },
  '3': {
    id: '3',
    title: 'UX Designer',
    department: 'Design',
    description: 'Create beautiful and intuitive user experiences. Conduct user research, create wireframes and prototypes, and collaborate with developers.',
    status: 'open',
    createdAt: '2025-12-18T09:15:00Z',
    updatedAt: '2025-12-18T09:15:00Z',
  },
  '4': {
    id: '4',
    title: 'Data Analyst',
    department: 'Analytics',
    description: 'Analyze data to drive business insights and decisions. Build dashboards and reports using modern BI tools.',
    status: 'closed',
    createdAt: '2025-12-15T11:00:00Z',
    updatedAt: '2025-12-21T16:00:00Z',
  },
  '5': {
    id: '5',
    title: 'DevOps Engineer',
    department: 'Engineering',
    description: 'Build and maintain our cloud infrastructure. Implement CI/CD pipelines, monitoring, and security best practices.',
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
