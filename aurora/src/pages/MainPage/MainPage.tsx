import { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material'
import { Briefcase, FolderOpen, FileText, Clock } from 'lucide-react'
import type { DashboardStats } from '@/types'
import { getDashboardStats } from './APIHandler'

export default function MainPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats()
        if (response.success) {
          setStats(response.data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = stats ? [
    { label: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: '#3b82f6' },
    { label: 'Open Positions', value: stats.openJobs, icon: FolderOpen, color: '#22c55e' },
    { label: 'Total CVs', value: stats.totalCVs, icon: FileText, color: '#f97316' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: Clock, color: '#a855f7' },
  ] : []

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 8,
          pb: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Welcome to Aurora
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
          Your intelligent job requisition management system
        </Typography>

        {loading ? (
          <CircularProgress sx={{ mt: 4 }} />
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {statCards.map((card) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 1,
                    }}
                  >
                    <card.icon size={48} color={card.color} strokeWidth={1.5} />
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  )
}
