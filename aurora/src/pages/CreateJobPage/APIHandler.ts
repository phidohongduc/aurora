import type { ApiResponse, JobRequisition, CreateJobRequisitionRequest } from '@/types'

const STORAGE_KEY = 'aurora_job_requisitions'

// Get jobs from localStorage
const getStoredJobs = (): JobRequisition[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return []
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

export async function createJob(
  request: CreateJobRequisitionRequest
): Promise<ApiResponse<JobRequisition>> {
  await simulateDelay()

  const jobs = getStoredJobs()
  
  // Generate new ID based on existing jobs
  const maxId = jobs.length > 0 
    ? Math.max(...jobs.map(j => parseInt(j.id) || 0))
    : 0
  const newId = String(maxId + 1)

  const newJob: JobRequisition = {
    id: newId,
    title: request.title,
    department: request.department,
    location: request.location,
    employmentType: request.employmentType,
    hiringManager: request.hiringManager,
    targetYearsMin: request.targetYearsMin,
    targetYearsMax: request.targetYearsMax,
    requiredSkills: request.requiredSkills,
    niceToHaveSkills: request.niceToHaveSkills,
    status: 'active',
    candidateCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  jobs.push(newJob)
  saveJobs(jobs)

  return {
    data: newJob,
    success: true,
    message: 'Job created successfully',
  }
}

// Mock departments for dropdown
export const mockDepartments = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Analytics',
  'Customer Success',
]

// Mock hiring managers
export const mockHiringManagers = [
  'Sarah Johnson',
  'Michael Chen',
  'Emily Davis',
  'David Kim',
  'Jessica Williams',
  'Robert Brown',
  'Amanda Martinez',
  'James Wilson',
]

export async function getDepartments(): Promise<ApiResponse<string[]>> {
  await simulateDelay()

  return {
    data: mockDepartments,
    success: true,
    message: 'Departments fetched successfully',
  }
}

export async function getHiringManagers(): Promise<ApiResponse<string[]>> {
  await simulateDelay()

  return {
    data: mockHiringManagers,
    success: true,
    message: 'Hiring managers fetched successfully',
  }
}
