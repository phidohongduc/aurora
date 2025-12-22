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
    description: request.description,
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

export async function getDepartments(): Promise<ApiResponse<string[]>> {
  await simulateDelay()

  return {
    data: mockDepartments,
    success: true,
    message: 'Departments fetched successfully',
  }
}
