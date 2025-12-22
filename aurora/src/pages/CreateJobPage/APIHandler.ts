import type { ApiResponse, JobRequisition, CreateJobRequisitionRequest } from '@/types'

// Simulate API delay (1-2 seconds)
const simulateDelay = () => new Promise(resolve =>
  setTimeout(resolve, Math.random() * 1000 + 1000)
)

// Mock ID generator
let nextId = 6

export async function createJob(
  request: CreateJobRequisitionRequest
): Promise<ApiResponse<JobRequisition>> {
  await simulateDelay()

  const newJob: JobRequisition = {
    id: String(nextId++),
    title: request.title,
    department: request.department,
    location: request.location,
    employmentType: request.employmentType,
    hiringManager: request.hiringManager,
    targetYearsMin: request.targetYearsMin,
    targetYearsMax: request.targetYearsMax,
    requiredSkills: request.requiredSkills,
    niceToHaveSkills: request.niceToHaveSkills,
    salaryMin: request.salaryMin,
    salaryMax: request.salaryMax,
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

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
