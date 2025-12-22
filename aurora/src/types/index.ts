// Job Requisition Types
export interface JobRequisition {
  id: string
  title: string
  department: string
  description: string
  status: 'open' | 'closed' | 'draft'
  createdAt: string
  updatedAt: string
}

export interface CreateJobRequisitionRequest {
  title: string
  department: string
  description: string
}

export interface CV {
  id: string
  fileName: string
  fileSize: number
  uploadedAt: string
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected'
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
