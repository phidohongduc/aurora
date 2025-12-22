import { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material'
import WorkIcon from '@mui/icons-material/Work'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import DescriptionIcon from '@mui/icons-material/Description'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
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
    { label: 'Total Jobs', value: stats.totalJobs, icon: WorkIcon, color: '#1976d2' },
    { label: 'Open Positions', value: stats.openJobs, icon: FolderOpenIcon, color: '#2e7d32' },
    { label: 'Total CVs', value: stats.totalCVs, icon: DescriptionIcon, color: '#ed6c02' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: PendingActionsIcon, color: '#9c27b0' },
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
                  <card.icon sx={{ fontSize: 48, color: card.color, mb: 1 }} />
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
