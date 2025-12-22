import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material'
import {
  ArrowLeft,
  Upload,
  Pencil,
  Briefcase,
  MapPin,
  Users,
  Clock,
  ChevronRight,
  User,
  Award,
  TrendingUp,
  GraduationCap,
  Building2,
  Cloud,
  Network,
  CheckCircle2,
  XCircle,
  Check,
  MessageSquare,
} from 'lucide-react'
import type { JobRequisition, CV, PipelineStep, InterviewQuestion } from '@/types'
import { getJobDetail, getJobCVs } from './APIHandler'
import { CandidateScreeningView } from './CandidateScreeningView'
import { CandidateInterviewingView } from './CandidateInterviewingView'
import { CandidateOfferView } from './CandidateOfferView'
import { CandidateHiredView } from './CandidateHiredView'

// Pipeline Stepper Component
const steps: { key: PipelineStep; label: string }[] = [
  { key: 'new', label: 'New' },
  { key: 'screening', label: 'Screening' },
  { key: 'interviewing', label: 'Interviewing' },
  { key: 'offer', label: 'Offer' },
  { key: 'hired', label: 'Hired' },
  { key: 'rejected', label: 'Rejected' },
]

interface PipelineStepperProps {
  currentStep: PipelineStep
}

function PipelineStepper({ currentStep }: PipelineStepperProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '800px', mx: 'auto' }}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const isRejected = step.key === 'rejected'
        const isLast = index === steps.length - 1

        return (
          <Box key={step.key} sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              {/* Circle */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid',
                  transition: 'all 0.2s',
                  borderColor: isCompleted
                    ? '#4F46E5'
                    : isCurrent
                    ? '#4F46E5'
                    : isRejected
                    ? '#FCA5A5'
                    : '#CBD5E1',
                  bgcolor: isCompleted
                    ? '#4F46E5'
                    : isCurrent
                    ? '#EEF2FF'
                    : '#FFFFFF',
                }}
              >
                {isCompleted ? (
                  <Check size={20} className="text-white" strokeWidth={2} />
                ) : (
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: isCurrent
                        ? '#4F46E5'
                        : isRejected
                        ? '#DC2626'
                        : '#64748B',
                    }}
                  >
                    {index + 1}
                  </Typography>
                )}
              </Box>

              {/* Label */}
              <Typography
                sx={{
                  mt: 1,
                  fontSize: '0.875rem',
                  color: isCurrent
                    ? '#4F46E5'
                    : isRejected
                    ? '#DC2626'
                    : '#475569',
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                {step.label}
              </Typography>
            </Box>

            {/* Connector Line */}
            {!isLast && (
              <Box
                sx={{
                  height: 2,
                  flex: 1,
                  mt: -3,
                  transition: 'all 0.2s',
                  bgcolor: isCompleted ? '#4F46E5' : '#CBD5E1',
                }}
              />
            )}
          </Box>
        )
      })}
    </Box>
  )
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<JobRequisition | null>(null)
  const [cvs, setCvs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCvId, setSelectedCvId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      try {
        const [jobResponse, cvsResponse] = await Promise.all([
          getJobDetail(id),
          getJobCVs(id),
        ])

        if (jobResponse.success && jobResponse.data) {
          setJob(jobResponse.data)
        } else {
          setError(jobResponse.message || 'Job not found')
        }

        if (cvsResponse.success) {
          setCvs(cvsResponse.data)
          if (cvsResponse.data.length > 0) {
            setSelectedCvId(cvsResponse.data[0].id)
          }
        }
      } catch {
        setError('Failed to load job details')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatExperience = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified'
    if (min && max) return `${min} - ${max} years`
    if (min) return `${min}+ years`
    if (max) return `Up to ${max} years`
    return 'Not specified'
  }

  const getStatusColor = (status: JobRequisition['status']) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'paused':
        return 'warning'
      case 'closed':
        return 'default'
      default:
        return 'default'
    }
  }

  const getCVStatusStyles = (status: CV['status']) => {
    switch (status) {
      case 'shortlisted':
        return { bgcolor: '#DCFCE7', color: '#15803D', borderColor: '#BBF7D0' }
      case 'reviewed':
        return { bgcolor: '#DBEAFE', color: '#1D4ED8', borderColor: '#BFDBFE' }
      case 'pending':
        return { bgcolor: '#FEF9C3', color: '#A16207', borderColor: '#FDE68A' }
      case 'rejected':
        return { bgcolor: '#FEE2E2', color: '#DC2626', borderColor: '#FECACA' }
      default:
        return { bgcolor: '#F1F5F9', color: '#475569', borderColor: '#E2E8F0' }
    }
  }

  const selectedCv = cvs.find((cv) => cv.id === selectedCvId)

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || !job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          component={Link}
          to="/jobs"
          startIcon={<ArrowLeft size={20} strokeWidth={1.5} />}
          sx={{ mb: 3 }}
        >
          Back to Jobs
        </Button>
        <Alert severity="error">{error || 'Job not found'}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button
        component={Link}
        to="/jobs"
        startIcon={<ArrowLeft size={20} strokeWidth={1.5} />}
        sx={{ mb: 3 }}
      >
        Back to Jobs
      </Button>

      {/* Job Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: '#EEF2FF',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Briefcase size={24} className="text-indigo-600" strokeWidth={1.5} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {job.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {job.department}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MapPin size={14} className="text-gray-400" strokeWidth={1.5} />
                  <Typography variant="body2" color="text.secondary">
                    {job.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Clock size={14} className="text-gray-400" strokeWidth={1.5} />
                  <Typography variant="body2" color="text.secondary">
                    {formatExperience(job.targetYearsMin, job.targetYearsMax)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              color={getStatusColor(job.status)}
            />
            <Stack direction="row" spacing={1}>
              <Button
                component={Link}
                to={`/jobs/${id}/upload`}
                variant="contained"
                startIcon={<Upload size={18} strokeWidth={1.5} />}
                sx={{
                  bgcolor: '#4F46E5',
                  '&:hover': { bgcolor: '#4338CA' },
                }}
              >
                Upload CVs
              </Button>
              <Button variant="outlined" startIcon={<Pencil size={18} strokeWidth={1.5} />}>
                Edit
              </Button>
            </Stack>
          </Box>
        </Box>
      </Paper>

      {/* Main Content Grid */}
      <Grid container gap={3}>
        {/* first  Panel - Job Details */}
        <Grid size={{ xs: 12, lg: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Briefcase size={20} className="text-blue-600" strokeWidth={1.5} />
              <Typography variant="h6" fontWeight="600">
                Job Details
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Hiring Manager
                </Typography>
                <Typography variant="body1">{job.hiringManager}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Employment Type
                </Typography>
                <Typography variant="body1">{job.employmentType}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body1">{formatDate(job.createdAt)}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Users size={20} className="text-blue-600" strokeWidth={1.5} />
              <Typography variant="h6" fontWeight="600">
                Requirements
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Required Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {job.requiredSkills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ bgcolor: 'primary.50' }}
                  />
                ))}
              </Box>
            </Box>

            {job.niceToHaveSkills.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Nice-to-have Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {job.niceToHaveSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      variant="outlined"
                      sx={{ bgcolor: 'grey.100' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* second Panel - Candidates */}
        <Grid size={{ xs: 12, lg: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Users size={20} className="text-blue-600" strokeWidth={1.5} />
                <Typography variant="h6" fontWeight="600">
                  Candidates ({cvs.length})
                </Typography>
              </Box>
              <Button
                component={Link}
                to={`/jobs/${id}/upload`}
                variant="text"
                size="small"
                sx={{ color: '#4F46E5' }}
              >
                + Add Candidates
              </Button>
            </Box>

            {cvs.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <User size={48} className="text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  No candidates yet
                </Typography>
                <Button
                  component={Link}
                  to={`/jobs/${id}/upload`}
                  variant="contained"
                  sx={{
                    bgcolor: '#4F46E5',
                    '&:hover': { bgcolor: '#4338CA' },
                  }}
                >
                  Upload CVs
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {/* Candidate List */}
                <Grid size={{ xs: 12, md: 4}}>
                  <Paper sx={{ overflow: 'hidden' }}>
                    {/* Header */}
                    <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="h6" fontWeight="600">
                        Candidates
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {cvs.length} candidates found
                      </Typography>
                    </Box>

                    {/* Candidate List Items */}
                    <Box>
                      {cvs.map((cv) => {
                        const isSelected = cv.id === selectedCvId
                        const aiMatchScore = cv.parsed?.aiMatchScore || 0
                        const yearsExp = cv.parsed?.yearsOfExperience || 0
                        const topSkills = cv.parsed?.topSkills || cv.parsed?.skills.slice(0, 3) || []
                        const fitLevel = cv.parsed?.fitLevel || 'Medium'

                        return (
                          <Box
                            key={cv.id}
                            onClick={() => setSelectedCvId(cv.id)}
                            sx={{
                              p: 3,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              borderLeft: '4px solid',
                              borderLeftColor: isSelected ? '#4F46E5' : 'transparent',
                              bgcolor: isSelected ? '#EEF2FF' : 'background.paper',
                              borderBottom: '1px solid',
                              borderBottomColor: 'divider',
                              '&:hover': {
                                bgcolor: isSelected ? '#EEF2FF' : '#F8FAFC',
                              },
                              '&:last-child': {
                                borderBottom: 'none',
                              },
                            }}
                          >
                            {/* Name and AI Match Score */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" fontWeight="600">
                                  {cv.parsed?.name || cv.fileName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  {yearsExp} years experience
                                </Typography>
                              </Box>

                              {/* AI Match Score */}
                              <Box sx={{ textAlign: 'center', ml: 2 }}>
                                <Typography
                                  sx={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color:
                                      aiMatchScore >= 85
                                        ? '#10b981'
                                        : aiMatchScore >= 70
                                        ? '#3b82f6'
                                        : '#f59e0b',
                                  }}
                                >
                                  {aiMatchScore}%
                                </Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                  Match
                                </Typography>
                              </Box>
                            </Box>

                            {/* Top Skills */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                              {topSkills.map((skill, idx) => (
                                <Chip
                                  key={idx}
                                  label={skill}
                                  size="small"
                                  sx={{
                                    bgcolor: '#F1F5F9',
                                    color: '#475569',
                                    fontSize: '0.75rem',
                                    height: 24,
                                  }}
                                />
                              ))}
                            </Box>

                            {/* Fit Badge */}
                            <Box>
                              <Chip
                                label={`${fitLevel} Fit`}
                                size="small"
                                sx={{
                                  bgcolor:
                                    fitLevel === 'Strong'
                                      ? '#DCFCE7'
                                      : fitLevel === 'Medium'
                                      ? '#DBEAFE'
                                      : '#FEF3C7',
                                  color:
                                    fitLevel === 'Strong'
                                      ? '#15803D'
                                      : fitLevel === 'Medium'
                                      ? '#1E40AF'
                                      : '#A16207',
                                  fontSize: '0.75rem',
                                  height: 24,
                                }}
                              />
                            </Box>
                          </Box>
                        )
                      })}
                    </Box>
                  </Paper>
                </Grid>

                {/* Candidate Details */}
                <Grid size={{ xs: 12, md: 8 }}>
                  {selectedCv && selectedCv.parsed && job && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* Pipeline Stepper */}
                      <Paper sx={{ p: 3 }}>
                        <PipelineStepper currentStep={selectedCv.parsed.pipelineStep || 'screening'} />
                      </Paper>

                      {/* Render different views based on pipeline step */}
                      {selectedCv.parsed.pipelineStep === 'new' && (
                        <CandidateScreeningView cv={selectedCv} job={job} />
                      )}
                      {selectedCv.parsed.pipelineStep === 'screening' && (
                        <CandidateScreeningView cv={selectedCv} job={job} />
                      )}
                      {selectedCv.parsed.pipelineStep === 'interviewing' && (
                        <CandidateInterviewingView cv={selectedCv} job={job} />
                      )}
                      {selectedCv.parsed.pipelineStep === 'offer' && (
                        <CandidateOfferView cv={selectedCv} job={job} />
                      )}
                      {selectedCv.parsed.pipelineStep === 'hired' && (
                        <CandidateHiredView cv={selectedCv} job={job} />
                      )}
                      {selectedCv.parsed.pipelineStep === 'rejected' && (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                          <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                            Candidate Rejected
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            This candidate was not selected for this position.
                          </Typography>
                        </Paper>
                      )}
                      {!selectedCv.parsed.pipelineStep && (
                        <CandidateScreeningView cv={selectedCv} job={job} />
                      )}
                    </Box>
                  )}
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
