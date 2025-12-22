import { Box, Paper, Typography, Grid, Chip, Stack, Button } from '@mui/material'
import {
  CheckCircle2,
  Calendar,
  User,
  Briefcase,
  Trophy,
  MapPin,
  Award,
} from 'lucide-react'
import type { CV, JobRequisition } from '@/types'

interface CandidateHiredViewProps {
  cv: CV
  job: JobRequisition
}

export function CandidateHiredView({ cv, job }: CandidateHiredViewProps) {
  if (!cv.parsed) return null

  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 14) // 2 weeks from now

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Success Banner */}
      <Paper sx={{ p: 3, bgcolor: '#DCFCE7', border: '2px solid #BBF7D0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Trophy size={24} className="text-white" strokeWidth={1.5} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: '#15803D', fontWeight: 'bold' }}>
              Offer Accepted!
            </Typography>
            <Typography variant="body2" sx={{ color: '#166534' }}>
              {cv.parsed.name} has accepted the offer and will join the team
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Header Card with AI Match Score */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              {cv.parsed.name}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Briefcase size={16} className="text-gray-500" strokeWidth={1.5} />
                <Typography variant="body2" color="text.secondary">
                  {cv.parsed.currentRole} at {cv.parsed.currentCompany}
                </Typography>
              </Box>
              {cv.parsed.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MapPin size={16} className="text-gray-500" strokeWidth={1.5} />
                  <Typography variant="body2" color="text.secondary">
                    {cv.parsed.location}
                  </Typography>
                </Box>
              )}
              {cv.parsed.yearsOfExperience && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Award size={16} className="text-gray-500" strokeWidth={1.5} />
                  <Typography variant="body2" color="text.secondary">
                    {cv.parsed.yearsOfExperience} years experience
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* AI Match Score */}
          {cv.parsed.aiMatchScore !== undefined && (
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', width: 80, height: 80 }}>
                <svg style={{ width: 80, height: 80, transform: 'rotate(-90deg)' }}>
                  <circle cx="40" cy="40" r="32" stroke="#e2e8f0" strokeWidth="6" fill="none" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke={
                      cv.parsed.aiMatchScore >= 85
                        ? '#10b981'
                        : cv.parsed.aiMatchScore >= 70
                        ? '#3b82f6'
                        : '#f59e0b'
                    }
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(cv.parsed.aiMatchScore / 100) * 201} 201`}
                    strokeLinecap="round"
                  />
                </svg>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color:
                        cv.parsed.aiMatchScore >= 85
                          ? '#10b981'
                          : cv.parsed.aiMatchScore >= 70
                          ? '#3b82f6'
                          : '#f59e0b',
                    }}
                  >
                    {cv.parsed.aiMatchScore}%
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                    AI Match
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Onboarding Checklist */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={16} className="text-white" strokeWidth={1.5} />
          </Box>
          <Typography variant="subtitle1" fontWeight="600">
            Onboarding Checklist
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: '#DBEAFE',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Calendar size={20} className="text-blue-600" strokeWidth={1.5} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {startDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: '#EEF2FF',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Briefcase size={20} className="text-indigo-600" strokeWidth={1.5} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Position
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {job.title}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" fontWeight="600" sx={{ mb: 2 }}>
            Pre-Onboarding Tasks
          </Typography>
          <Stack spacing={1.5}>
            {[
              { label: 'Send welcome email', completed: true },
              { label: 'Set up email account', completed: true },
              { label: 'Order laptop and equipment', completed: true },
              { label: 'Prepare workspace', completed: false },
              { label: 'Schedule orientation meeting', completed: false },
              { label: 'Assign onboarding buddy', completed: false },
              { label: 'Prepare first week schedule', completed: false },
            ].map((task, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '4px',
                    bgcolor: task.completed ? '#10b981' : '#FFF',
                    border: task.completed ? 'none' : '2px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {task.completed && <CheckCircle2 size={14} className="text-white" strokeWidth={2} />}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: task.completed ? 'text.secondary' : 'text.primary',
                    textDecoration: task.completed ? 'line-through' : 'none',
                  }}
                >
                  {task.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Paper>

      {/* Contact Information */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
          Contact Information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body2">
              {cv.parsed.name.toLowerCase().replace(' ', '.')}@company.com
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Phone
            </Typography>
            <Typography variant="body2">To be added</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Paper sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#4F46E5',
              '&:hover': { bgcolor: '#4338CA' },
            }}
          >
            View Onboarding Portal
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderColor: '#E2E8F0',
              color: '#475569',
              '&:hover': {
                borderColor: '#CBD5E1',
                bgcolor: '#F8FAFC',
              },
            }}
          >
            Send Welcome Email
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
