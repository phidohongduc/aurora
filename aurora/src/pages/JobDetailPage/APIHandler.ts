import type { ApiResponse, JobRequisition, CV, ParsedCVData } from '@/types'

// Mock parsed CV data
const mockParsedCVs: Record<string, ParsedCVData> = {
  'cv1': {
    name: 'John Doe',
    currentRole: 'Backend Developer',
    currentCompany: 'TechCorp',
    totalExperience: '6 years',
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
    education: 'B.S. Computer Science - MIT',
    previousCompanies: ['TechCorp', 'StartupXYZ'],
  },
  'cv2': {
    name: 'Jane Smith',
    currentRole: 'Senior Software Engineer',
    currentCompany: 'CloudScale',
    totalExperience: '8 years',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'AWS', 'Kubernetes'],
    education: 'M.S. Computer Science - Stanford',
    previousCompanies: ['CloudScale', 'BigTech Inc'],
  },
  'cv3': {
    name: 'Bob Wilson',
    currentRole: 'Full Stack Developer',
    currentCompany: 'WebDev Co',
    totalExperience: '5 years',
    skills: ['Python', 'Django', 'React', 'PostgreSQL'],
    education: 'B.S. Software Engineering - UCLA',
    previousCompanies: ['WebDev Co'],
  },
  'cv4': {
    name: 'Alice Johnson',
    currentRole: 'Product Manager',
    currentCompany: 'ProductFirst',
    totalExperience: '5 years',
    skills: ['Product Strategy', 'Agile', 'User Research', 'Analytics'],
    education: 'MBA - Harvard Business School',
    previousCompanies: ['ProductFirst', 'StartupHub'],
  },
  'cv5': {
    name: 'Charlie Brown',
    currentRole: 'Data Analyst',
    currentCompany: 'DataCorp',
    totalExperience: '3 years',
    skills: ['Python', 'SQL', 'Tableau', 'Excel'],
    education: 'B.S. Statistics - UC Berkeley',
    previousCompanies: ['DataCorp'],
  },
  'cv6': {
    name: 'Diana Lee',
    currentRole: 'DevOps Engineer',
    currentCompany: 'CloudOps',
    totalExperience: '6 years',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD'],
    education: 'B.S. Computer Engineering - Georgia Tech',
    previousCompanies: ['CloudOps', 'InfraTech'],
  },
  'cv7': {
    name: 'Edward Kim',
    currentRole: 'Cloud Specialist',
    currentCompany: 'CloudNative',
    totalExperience: '4 years',
    skills: ['AWS', 'GCP', 'Kubernetes', 'Terraform'],
    education: 'B.S. Information Technology - University of Washington',
    previousCompanies: ['CloudNative'],
  },
}

// Mock data
const mockJobs: Record<string, JobRequisition> = {
  '1': {
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
    candidateCount: 3,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  '2': {
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
    candidateCount: 1,
    createdAt: '2025-01-10T14:30:00Z',
    updatedAt: '2025-01-10T14:30:00Z',
  },
  '3': {
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
    candidateCount: 0,
    createdAt: '2025-01-05T09:15:00Z',
    updatedAt: '2025-01-05T09:15:00Z',
  },
  '4': {
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
    candidateCount: 1,
    createdAt: '2024-12-20T11:00:00Z',
    updatedAt: '2024-12-20T11:00:00Z',
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
    status: 'active',
    candidateCount: 2,
    createdAt: '2024-12-18T08:45:00Z',
    updatedAt: '2024-12-18T08:45:00Z',
  },
}

const mockCVsByJob: Record<string, CV[]> = {
  '1': [
    { id: 'cv1', fileName: 'john_doe_resume.pdf', fileSize: 245000, uploadedAt: '2025-01-18T10:30:00Z', status: 'reviewed', parsed: mockParsedCVs['cv1'] },
    { id: 'cv2', fileName: 'jane_smith_cv.pdf', fileSize: 189000, uploadedAt: '2025-01-18T11:45:00Z', status: 'shortlisted', parsed: mockParsedCVs['cv2'] },
    { id: 'cv3', fileName: 'bob_wilson_resume.docx', fileSize: 156000, uploadedAt: '2025-01-19T09:00:00Z', status: 'pending', parsed: mockParsedCVs['cv3'] },
  ],
  '2': [
    { id: 'cv4', fileName: 'alice_johnson_pm.pdf', fileSize: 278000, uploadedAt: '2025-01-17T14:00:00Z', status: 'pending', parsed: mockParsedCVs['cv4'] },
  ],
  '3': [],
  '4': [
    { id: 'cv5', fileName: 'charlie_brown_resume.pdf', fileSize: 198000, uploadedAt: '2025-01-10T10:00:00Z', status: 'rejected', parsed: mockParsedCVs['cv5'] },
  ],
  '5': [
    { id: 'cv6', fileName: 'diana_lee_devops.pdf', fileSize: 220000, uploadedAt: '2025-01-16T15:30:00Z', status: 'reviewed', parsed: mockParsedCVs['cv6'] },
    { id: 'cv7', fileName: 'edward_kim_cloud.pdf', fileSize: 245000, uploadedAt: '2025-01-17T09:15:00Z', status: 'pending', parsed: mockParsedCVs['cv7'] },
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
