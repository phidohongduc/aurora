import type { ApiResponse, CV, JobRequisition, ParsedCVData } from '@/types'

// Mock parsed CV data for simulation
const mockParsedCVs: ParsedCVData[] = [
  {
    name: 'Alex Chen',
    currentRole: 'Senior Backend Engineer',
    currentCompany: 'TechCorp',
    totalExperience: '8 years',
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Redis'],
    education: 'M.S. Computer Science - Stanford University',
    previousCompanies: ['TechCorp', 'StartupXYZ'],
  },
  {
    name: 'Sarah Martinez',
    currentRole: 'Backend Developer',
    currentCompany: 'CloudScale Inc',
    totalExperience: '6 years',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'MongoDB'],
    education: 'B.S. Software Engineering - UT Austin',
    previousCompanies: ['CloudScale Inc', 'TechStart'],
  },
  {
    name: 'Michael Park',
    currentRole: 'Full Stack Engineer',
    currentCompany: 'StartupXYZ',
    totalExperience: '5 years',
    skills: ['Python', 'Django', 'JavaScript', 'React', 'PostgreSQL', 'Docker'],
    education: 'B.S. Computer Science - University of Washington',
    previousCompanies: ['StartupXYZ', 'WebCorp'],
  },
  {
    name: 'Emily Rodriguez',
    currentRole: 'Software Engineer',
    currentCompany: 'DataFlow',
    totalExperience: '4 years',
    skills: ['Java', 'Spring Boot', 'MySQL', 'AWS', 'Microservices'],
    education: 'B.S. Computer Science - UCLA',
    previousCompanies: ['DataFlow', 'CodeBase Inc'],
  },
  {
    name: 'James Wilson',
    currentRole: 'DevOps Engineer',
    currentCompany: 'CloudNative',
    totalExperience: '7 years',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD', 'Python'],
    education: 'B.S. Information Technology - MIT',
    previousCompanies: ['CloudNative', 'InfraTech'],
  },
]

// Mock job requisitions (shared with JobDetailPage)
const mockJobs: Record<string, JobRequisition> = {
  '1': {
    id: '1',
    title: 'Senior Backend Engineer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'Full-time',
    hiringManager: 'John Smith',
    targetYearsMin: 5,
    targetYearsMax: 8,
    requiredSkills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
    niceToHaveSkills: ['Docker', 'Kubernetes', 'Redis'],
    status: 'active',
    candidateCount: 12,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  '2': {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'Hybrid',
    employmentType: 'Full-time',
    hiringManager: 'Sarah Johnson',
    targetYearsMin: 3,
    targetYearsMax: 6,
    requiredSkills: ['Product Strategy', 'Agile', 'User Research'],
    niceToHaveSkills: ['SQL', 'Data Analysis'],
    status: 'active',
    candidateCount: 8,
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-10T09:00:00Z',
  },
  '3': {
    id: '3',
    title: 'UX Designer',
    department: 'Design',
    location: 'Onsite',
    employmentType: 'Full-time',
    hiringManager: 'Mike Chen',
    targetYearsMin: 2,
    targetYearsMax: 5,
    requiredSkills: ['Figma', 'User Research', 'Prototyping'],
    niceToHaveSkills: ['HTML/CSS', 'Design Systems'],
    status: 'active',
    candidateCount: 15,
    createdAt: '2025-01-05T09:15:00Z',
    updatedAt: '2025-01-05T09:15:00Z',
  },
}

// Mock CVs storage per job
const mockCVsByJob: Record<string, CV[]> = {
  '1': [],
  '2': [],
  '3': [],
}

// Mock ID counter
let nextCVId = 1
let parsedCVIndex = 0

// Simulate API delay (1-2 seconds)
const simulateDelay = () => new Promise(resolve =>
  setTimeout(resolve, Math.random() * 1000 + 1000)
)

export async function getJobDetail(jobId: string): Promise<ApiResponse<JobRequisition | null>> {
  await simulateDelay()

  const job = mockJobs[jobId]

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

export async function getCVsForJob(jobId: string): Promise<ApiResponse<CV[]>> {
  await simulateDelay()

  const cvs = mockCVsByJob[jobId] || []

  return {
    data: cvs,
    success: true,
    message: 'CVs fetched successfully',
  }
}

export async function uploadCV(
  jobId: string,
  _file: File
): Promise<ApiResponse<CV>> {
  await simulateDelay()

  // Get next mock parsed CV data
  const parsedData = mockParsedCVs[parsedCVIndex % mockParsedCVs.length]
  parsedCVIndex++

  const newCV: CV = {
    id: `cv${nextCVId++}`,
    fileName: `${parsedData.name.toLowerCase().replace(' ', '_')}_resume.pdf`,
    fileSize: Math.floor(Math.random() * 200000) + 100000,
    uploadedAt: new Date().toISOString(),
    status: 'pending',
    parsed: parsedData,
  }

  // Add to mock storage
  if (!mockCVsByJob[jobId]) {
    mockCVsByJob[jobId] = []
  }
  mockCVsByJob[jobId].push(newCV)

  return {
    data: newCV,
    success: true,
    message: 'CV uploaded and parsed successfully',
  }
}

export async function uploadMultipleCVs(
  jobId: string,
  files: File[]
): Promise<ApiResponse<CV[]>> {
  await simulateDelay()

  const newCVs: CV[] = files.map(() => {
    const parsedData = mockParsedCVs[parsedCVIndex % mockParsedCVs.length]
    parsedCVIndex++

    return {
      id: `cv${nextCVId++}`,
      fileName: `${parsedData.name.toLowerCase().replace(' ', '_')}_resume.pdf`,
      fileSize: Math.floor(Math.random() * 200000) + 100000,
      uploadedAt: new Date().toISOString(),
      status: 'pending' as const,
      parsed: parsedData,
    }
  })

  // Add to mock storage
  if (!mockCVsByJob[jobId]) {
    mockCVsByJob[jobId] = []
  }
  mockCVsByJob[jobId].push(...newCVs)

  return {
    data: newCVs,
    success: true,
    message: `${files.length} CV(s) uploaded and parsed successfully`,
  }
}

export async function deleteCV(
  jobId: string,
  cvId: string
): Promise<ApiResponse<null>> {
  await simulateDelay()

  if (mockCVsByJob[jobId]) {
    mockCVsByJob[jobId] = mockCVsByJob[jobId].filter(cv => cv.id !== cvId)
  }

  return {
    data: null,
    success: true,
    message: 'CV deleted successfully',
  }
}

export async function updateCVStatus(
  jobId: string,
  cvId: string,
  status: CV['status']
): Promise<ApiResponse<CV | null>> {
  await simulateDelay()

  const cvs = mockCVsByJob[jobId]
  if (!cvs) {
    return {
      data: null,
      success: false,
      message: 'Job not found',
    }
  }

  const cvIndex = cvs.findIndex(cv => cv.id === cvId)
  if (cvIndex === -1) {
    return {
      data: null,
      success: false,
      message: 'CV not found',
    }
  }

  cvs[cvIndex] = { ...cvs[cvIndex], status }

  return {
    data: cvs[cvIndex],
    success: true,
    message: 'CV status updated successfully',
  }
}
