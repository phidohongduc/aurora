import type { ApiResponse, DashboardStats } from '@/types'

// Mock data
const mockDashboardStats: DashboardStats = {
  totalJobs: 12,
  openJobs: 8,
  totalCVs: 156,
  pendingReviews: 34,
}

// Simulate API delay (1-2 seconds)
const simulateDelay = () => new Promise(resolve =>
  setTimeout(resolve, Math.random() * 1000 + 1000)
)

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  await simulateDelay()

  return {
    data: mockDashboardStats,
    success: true,
    message: 'Dashboard stats fetched successfully',
  }
}
