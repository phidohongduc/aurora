import { useEffect, useState, useCallback } from 'react'
import {
  Typography,
  Box,
  Button,
} from '@mui/material'
import { Briefcase, FolderOpen, FileText, Clock } from 'lucide-react'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'
import type { DashboardStats } from '@/types'
import { getDashboardStats } from './APIHandler'
import { useNavigate } from 'react-router-dom'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

/**
 * MainPage
 * - Hero-driven landing page
 * - Ambient "antigravity" particle background
 * - Clear CTA to create a new job
 * - Metrics displayed as secondary confirmation
 */
export default function MainPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats()
        if (response.success) {
          setStats(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    // Listen for event from AI Companion to trigger tour
    const handleShowCreateJobTour = () => {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: '.create-job-hero-btn',
            popover: {
              title: 'Create Your Job Here',
              description: 'Click this button to start creating a new job requisition with AI assistance',
              side: 'bottom',
              align: 'center',
            },
          },
        ],
        onDestroyStarted: () => {
          driverObj.destroy()
        },
      })

      driverObj.drive()
    }

    window.addEventListener('showCreateJobTour', handleShowCreateJobTour)
    
    return () => {
      window.removeEventListener('showCreateJobTour', handleShowCreateJobTour)
    }
  }, [])

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

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
                value: { min: 1, max: 7 },
              },
              move: {
                enable: true,
                speed: 0.8,
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
              className="create-job-hero-btn"
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
