import { Box, Paper, Typography, Grid, Chip, Stack, Button } from '@mui/material'
import {
  Briefcase,
  MapPin,
  Award,
  TrendingUp,
  GraduationCap,
  Building2,
  Cloud,
  Network,
  Users,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import type { CV, JobRequisition } from '@/types'

interface CandidateScreeningViewProps {
  cv: CV
  job: JobRequisition
}

export function CandidateScreeningView({ cv, job }: CandidateScreeningViewProps) {
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

      {/* AI Candidate Summary */}
      {(cv.parsed.strengths || cv.parsed.weaknesses) && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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
              <TrendingUp size={16} className="text-white" strokeWidth={1.5} />
            </Box>
            <Typography variant="subtitle1" fontWeight="600">
              AI Candidate Summary
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {cv.parsed.strengths && cv.parsed.strengths.length > 0 && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircle2 size={18} className="text-green-600" strokeWidth={1.5} />
                  <Typography variant="body2" fontWeight="600">
                    Strengths
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {cv.parsed.strengths.map((strength, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1 }}>
                      <Typography sx={{ color: '#10b981', fontSize: '0.875rem' }}>•</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {strength}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}

            {cv.parsed.weaknesses && cv.parsed.weaknesses.length > 0 && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <XCircle size={18} className="text-amber-600" strokeWidth={1.5} />
                  <Typography variant="body2" fontWeight="600">
                    Gaps / Areas for Growth
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {cv.parsed.weaknesses.map((weakness, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1 }}>
                      <Typography sx={{ color: '#f59e0b', fontSize: '0.875rem' }}>•</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {weakness}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {/* JD vs CV Alignment */}
      {(cv.parsed.matchedSkills || cv.parsed.missingSkills) && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
            JD vs CV Alignment
          </Typography>

          <Grid container spacing={3}>
            {cv.parsed.matchedSkills && cv.parsed.matchedSkills.length > 0 && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <CheckCircle2 size={18} className="text-green-600" strokeWidth={1.5} />
                  <Typography variant="body2" fontWeight="600">
                    Matched Skills
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {cv.parsed.matchedSkills.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      size="small"
                      sx={{
                        bgcolor: '#DCFCE7',
                        color: '#15803D',
                        border: '1px solid #BBF7D0',
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            )}

            {cv.parsed.missingSkills && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <XCircle size={18} className="text-red-600" strokeWidth={1.5} />
                  <Typography variant="body2" fontWeight="600">
                    Missing Skills
                  </Typography>
                </Box>
                {cv.parsed.missingSkills.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {cv.parsed.missingSkills.map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        size="small"
                        sx={{
                          bgcolor: '#FEE2E2',
                          color: '#DC2626',
                          border: '1px solid #FECACA',
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No missing required skills
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>

          {/* Skill Match Progress Bar */}
          {cv.parsed.matchedSkills && cv.parsed.missingSkills && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Skill Match Rate
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {cv.parsed.matchedSkills.length} /{' '}
                  {cv.parsed.matchedSkills.length + cv.parsed.missingSkills.length} skills
                </Typography>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: 12,
                  bgcolor: '#E2E8F0',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    borderRadius: 2,
                    transition: 'width 0.3s',
                    width: `${
                      (cv.parsed.matchedSkills.length /
                        (cv.parsed.matchedSkills.length + cv.parsed.missingSkills.length)) *
                      100
                    }%`,
                  }}
                />
              </Box>
            </Box>
          )}
        </Paper>
      )}

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
            Move to Interview
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
            Reject Candidate
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
