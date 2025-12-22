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
import { ArrowLeft, Upload, Pencil, Briefcase, MapPin, Users, DollarSign } from 'lucide-react'
import type { JobRequisition, CV } from '@/types'
import { getJobDetail, getJobCVs } from './APIHandler'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<JobRequisition | null>(null)
  const [cvs, setCvs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified'
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `From $${min.toLocaleString()}`
    if (max) return `Up to $${max.toLocaleString()}`
    return 'Not specified'
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        component={Link}
        to="/jobs"
        startIcon={<ArrowLeft size={20} strokeWidth={1.5} />}
        sx={{ mb: 3 }}
      >
        Back to Jobs
      </Button>

      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {job.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {job.department} • {job.location} • {job.employmentType}
            </Typography>
          </Box>
          <Chip
            label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            color={getStatusColor(job.status)}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Basic Information */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Briefcase size={24} className="text-blue-600" strokeWidth={1.5} />
            <Typography variant="h6" fontWeight="600">
              Basic Information
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Department
              </Typography>
              <Typography variant="body1">{job.department}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Hiring Manager
              </Typography>
              <Typography variant="body1">{job.hiringManager}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <MapPin size={16} strokeWidth={1.5} /> Location
              </Typography>
              <Typography variant="body1">{job.location}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Employment Type
              </Typography>
              <Typography variant="body1">{job.employmentType}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body1">{formatDate(job.createdAt)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                CVs Received
              </Typography>
              <Typography variant="body1">{cvs.length} candidates</Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Experience & Skills */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Users size={24} className="text-blue-600" strokeWidth={1.5} />
            <Typography variant="h6" fontWeight="600">
              Experience & Skills
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="body2" color="text.secondary">
                Target Experience
              </Typography>
              <Typography variant="body1">
                {formatExperience(job.targetYearsMin, job.targetYearsMax)}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Required Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {job.requiredSkills.length > 0 ? (
                  job.requiredSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ bgcolor: 'primary.50' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No required skills specified
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid size={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Nice-to-have Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {job.niceToHaveSkills.length > 0 ? (
                  job.niceToHaveSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      variant="outlined"
                      sx={{ bgcolor: 'grey.100' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No nice-to-have skills specified
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Compensation */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <DollarSign size={24} className="text-blue-600" strokeWidth={1.5} />
            <Typography variant="h6" fontWeight="600">
              Compensation
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Salary Range
          </Typography>
          <Typography variant="body1">
            {formatSalary(job.salaryMin, job.salaryMax)}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Actions */}
        <Stack direction="row" spacing={2}>
          <Button
            component={Link}
            to={`/jobs/${id}/upload`}
            variant="contained"
            startIcon={<Upload size={20} strokeWidth={1.5} />}
          >
            Upload CVs
          </Button>
          <Button variant="outlined" startIcon={<Pencil size={20} strokeWidth={1.5} />}>
            Edit
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}
