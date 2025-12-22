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
} from 'lucide-react'
import type { JobRequisition, CV } from '@/types'
import { getJobDetail, getJobCVs } from './APIHandler'

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
      <Grid container spacing={3}>
        {/* Left Panel - Job Details */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
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

        {/* Right Panel - Candidates */}
        <Grid size={{ xs: 12, lg: 8 }}>
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
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {cvs.map((cv) => (
                      <Paper
                        key={cv.id}
                        onClick={() => setSelectedCvId(cv.id)}
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          borderColor: selectedCvId === cv.id ? '#4F46E5' : 'divider',
                          borderWidth: selectedCvId === cv.id ? 2 : 1,
                          bgcolor: selectedCvId === cv.id ? '#EEF2FF' : 'background.paper',
                          '&:hover': {
                            borderColor: '#C7D2FE',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="body1" fontWeight="600">
                              {cv.parsed?.name || cv.fileName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {cv.parsed?.currentRole || 'Role not specified'}
                            </Typography>
                            {cv.parsed && (
                              <Typography variant="caption" color="text.secondary">
                                {cv.parsed.totalExperience} • {cv.parsed.currentCompany}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={cv.status.charAt(0).toUpperCase() + cv.status.slice(1)}
                              size="small"
                              sx={{
                                ...getCVStatusStyles(cv.status),
                                border: '1px solid',
                                fontSize: '0.7rem',
                              }}
                            />
                            <ChevronRight size={16} className="text-gray-400" strokeWidth={1.5} />
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Grid>

                {/* Candidate Details */}
                <Grid size={{ xs: 12, md: 7 }}>
                  {selectedCv && selectedCv.parsed && (
                    <Paper sx={{ p: 3, bgcolor: '#FAFAFA' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {selectedCv.parsed.name}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {selectedCv.parsed.currentRole} at {selectedCv.parsed.currentCompany}
                          </Typography>
                        </Box>
                        <Chip
                          label={selectedCv.status.charAt(0).toUpperCase() + selectedCv.status.slice(1)}
                          sx={{
                            ...getCVStatusStyles(selectedCv.status),
                            border: '1px solid',
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Experience
                          </Typography>
                          <Typography variant="body1">
                            {selectedCv.parsed.totalExperience}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Education
                          </Typography>
                          <Typography variant="body1">
                            {selectedCv.parsed.education}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Skills
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectedCv.parsed.skills.map((skill, idx) => (
                              <Chip
                                key={idx}
                                label={skill}
                                size="small"
                                sx={{ bgcolor: '#F1F5F9', color: '#475569' }}
                              />
                            ))}
                          </Box>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Previous Companies
                          </Typography>
                          <Typography variant="body1">
                            {selectedCv.parsed.previousCompanies.join(', ')}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: '#4F46E5',
                            '&:hover': { bgcolor: '#4338CA' },
                          }}
                        >
                          Schedule Interview
                        </Button>
                        <Button variant="outlined">
                          View Full CV
                        </Button>
                      </Stack>
                    </Paper>
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
