// Job Requisition Types
export type LocationType = 'Remote' | 'Hybrid' | 'Onsite'
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract'

export interface JobRequisition {
  id: string
  title: string
  department: string
  location: LocationType
  employmentType: EmploymentType
  hiringManager: string
  targetYearsMin?: number
  targetYearsMax?: number
  requiredSkills: string[]
  niceToHaveSkills: string[]
  status: 'active' | 'paused' | 'closed'
  candidateCount?: number
  createdAt: string
  updatedAt: string
}

export interface CreateJobRequisitionRequest {
  title: string
  department: string
  location: LocationType
  employmentType: EmploymentType
  hiringManager: string
  targetYearsMin?: number
  targetYearsMax?: number
  requiredSkills: string[]
  niceToHaveSkills: string[]
}

// Parsed CV data from AI
export interface ParsedCVData {
  name: string
  currentRole: string
  currentCompany: string
  totalExperience: string
  skills: string[]
  education: string
  previousCompanies: string[]
}

export interface CV {
  id: string
  fileName: string
  fileSize: number
  uploadedAt: string
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected'
  parsed?: ParsedCVData
}

export interface DashboardStats {
  totalJobs: number
  openJobs: number
  totalCVs: number
  pendingReviews: number
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}
