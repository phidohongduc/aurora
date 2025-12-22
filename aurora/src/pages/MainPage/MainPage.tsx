import { useEffect, useState, useCallback } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Button,
} from '@mui/material'
import { Briefcase, FolderOpen, FileText, Clock } from 'lucide-react'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'
import type { DashboardStats } from '@/types'
import { getDashboardStats } from './APIHandler'
import { useNavigate } from 'react-router-dom'

/**
 * MainPage
 * - Hero-driven landing page
 * - Ambient "antigravity" particle background
 * - Clear CTA to create a new job
 * - Metrics displayed as secondary confirmation
 */
export default function MainPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const statCards = stats
    ? [
      { label: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: '#3b82f6' },
      { label: 'Open Positions', value: stats.openJobs, icon: FolderOpen, color: '#22c55e' },
      { label: 'Total CVs', value: stats.totalCVs, icon: FileText, color: '#f97316' },
      { label: 'Pending Reviews', value: stats.pendingReviews, icon: Clock, color: '#a855f7' },
    ]
    : []

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* ================= HERO SECTION ================= */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Antigravity Background */}
        <Particles
          init={particlesInit}
          options={{
            fullScreen: false,
            background: { color: 'transparent' },
            fpsLimit: 60,
            particles: {
              number: {
                value: 500,
                density: { enable: true, area: 800 },
              },
              color: { value: ['#3b82f6', '#6366f1'] },
              opacity: {
                value: 0.25,
                random: true,
              },
              size: {
                value: { min: 1, max: 3 },
              },
              move: {
                enable: true,
                speed: 0.4,
                direction: 'none',
                outModes: { default: 'out' },
              },
            },
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: 'attract',
                },
                resize: true,
              },
              modes: {
                attract: {
                  distance: 120,
                  duration: 0.4,
                },
              },
            },
            detectRetina: true,
          }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        />

        {/* Hero Content */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            px: 2,
            maxWidth: 900,
          }}
        >
          <Typography variant="h2" fontWeight={700} gutterBottom>
            Your AI companion for hiring
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mt: 2, mb: 5 }}
          >
            From job creation to candidate screening and employee capability mapping —
            Aurora brings clarity and continuity to your hiring process.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: 16,
                boxShadow: '0 0 0 rgba(59,130,246,0)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 0 24px rgba(59,130,246,0.4)',
                  transform: 'translateY(-1px)',
                },
              }}
              onClick={() => navigate('/jobs/new')}
            >
              Create New Job
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5 }}
              onClick={() => navigate('/jobs')}
            >
              View Hiring Pipeline
            </Button>
          </Box>
        </Box>
      </Box>

    </Box>
  )
}
