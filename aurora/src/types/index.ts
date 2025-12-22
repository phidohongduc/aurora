// Job Requisition Types
export type LocationType = 'Remote' | 'Hybrid' | 'Onsite'
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract'
export type PipelineStep = 'new' | 'screening' | 'interviewing' | 'offer' | 'hired' | 'rejected'

export interface InterviewQuestion {
  id: string
  question: string
  category: 'technical' | 'behavioral' | 'culture' | 'experience'
  expectedAnswer: string
  keyPoints: string[]
  status?: 'pending' | 'answered' | 'skipped'
  candidateAnswer?: string
  rating?: number
}

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
  location?: string
  yearsOfExperience?: number
  relevantYearsOfExperience?: number
  aiMatchScore?: number
  strengths?: string[]
  weaknesses?: string[]
  cloudExperience?: string[]
  systemDesignExperience?: string
  leadershipExperience?: string
  industryBackground?: string[]
  employmentStability?: string
  matchedSkills?: string[]
  missingSkills?: string[]
  topSkills?: string[]
  pipelineStep?: PipelineStep
  fitLevel?: 'Strong' | 'Medium' | 'Weak'
  interviewQuestions?: InterviewQuestion[]
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
