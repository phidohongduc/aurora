import type { ApiResponse, CV } from '@/types'

// Mock CVs storage per job
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

// Mock ID counter
let nextCVId = 8

// Simulate API delay (1-2 seconds)
const simulateDelay = () => new Promise(resolve =>
  setTimeout(resolve, Math.random() * 1000 + 1000)
)

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
  file: File
): Promise<ApiResponse<CV>> {
  await simulateDelay()

  const newCV: CV = {
    id: `cv${nextCVId++}`,
    fileName: file.name,
    fileSize: file.size,
    uploadedAt: new Date().toISOString(),
    status: 'pending',
  }

  // Add to mock storage
  if (!mockCVsByJob[jobId]) {
    mockCVsByJob[jobId] = []
  }
  mockCVsByJob[jobId].push(newCV)

  return {
    data: newCV,
    success: true,
    message: 'CV uploaded successfully',
  }
}

export async function uploadMultipleCVs(
  jobId: string,
  files: File[]
): Promise<ApiResponse<CV[]>> {
  await simulateDelay()

  const newCVs: CV[] = files.map(file => ({
    id: `cv${nextCVId++}`,
    fileName: file.name,
    fileSize: file.size,
    uploadedAt: new Date().toISOString(),
    status: 'pending' as const,
  }))

  // Add to mock storage
  if (!mockCVsByJob[jobId]) {
    mockCVsByJob[jobId] = []
  }
  mockCVsByJob[jobId].push(...newCVs)

  return {
    data: newCVs,
    success: true,
    message: `${files.length} CV(s) uploaded successfully`,
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
