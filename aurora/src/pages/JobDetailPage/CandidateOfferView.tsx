import { Box, Paper, Typography, Grid, Chip, Stack, Button, Divider } from '@mui/material'
import {
  DollarSign,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  Briefcase,
  MapPin,
  Award,
} from 'lucide-react'
import type { CV, JobRequisition } from '@/types'

interface CandidateOfferViewProps {
  cv: CV
  job: JobRequisition
}

export function CandidateOfferView({ cv, job }: CandidateOfferViewProps) {
  if (!cv.parsed) return null

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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

      {/* Offer Details */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileText size={16} className="text-white" strokeWidth={1.5} />
          </Box>
          <Typography variant="subtitle1" fontWeight="600">
            Offer Details
          </Typography>
          <Chip
            label="Pending"
            size="small"
            sx={{ ml: 'auto', bgcolor: '#FEF3C7', color: '#A16207', border: '1px solid #FDE68A' }}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: '#DCFCE7',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <DollarSign size={20} className="text-green-600" strokeWidth={1.5} />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
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
                  To be decided
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Flexible based on candidate availability
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, bgcolor: '#EEF2FF', borderRadius: 2, border: '1px solid #C7D2FE' }}>
              <Typography variant="body2" sx={{ color: '#4338CA', mb: 1, fontWeight: 600 }}>
                Package Includes
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5, color: '#3730A3', fontSize: '0.875rem' }}>
                <li>Health, Dental & Vision Insurance</li>
                <li>Remote work flexibility</li>
                <li>Learning & Development budget</li>
                <li>Home office stipend</li>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="body2" fontWeight="600" sx={{ mb: 2 }}>
            Next Steps
          </Typography>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={14} className="text-white" strokeWidth={2} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Prepare offer letter and documents
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: '#F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Clock size={14} className="text-white" strokeWidth={2} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Send offer to candidate
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: '2px solid #CBD5E1',
                  bgcolor: '#FFF',
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Wait for candidate response (typically 3-5 days)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: '2px solid #CBD5E1',
                  bgcolor: '#FFF',
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Negotiate if needed
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {/* Action Buttons for Offer Stage */}
      <Paper sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#10b981',
              '&:hover': { bgcolor: '#059669' },
            }}
          >
            Mark as Hired
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderColor: '#4F46E5',
              color: '#4F46E5',
              '&:hover': {
                borderColor: '#4338CA',
                bgcolor: '#EEF2FF',
              },
            }}
          >
            Resend Offer
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
