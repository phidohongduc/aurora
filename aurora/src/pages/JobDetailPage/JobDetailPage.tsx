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
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import EditIcon from '@mui/icons-material/Edit'
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

  const getStatusColor = (status: JobRequisition['status']) => {
    switch (status) {
      case 'open':
        return 'success'
      case 'closed':
        return 'error'
      case 'draft':
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
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Back to Jobs
        </Button>
        <Alert severity="error">{error || 'Job not found'}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={Link}
        to="/jobs"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Jobs
      </Button>
      <Paper sx={{ p: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            {job.title}
          </Typography>
          <Chip
            label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            color={getStatusColor(job.status)}
          />
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Department
            </Typography>
            <Typography variant="body1">{job.department}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body1">{formatDate(job.createdAt)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              CVs Received
            </Typography>
            <Typography variant="body1">{cvs.length} candidates</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1">{job.description}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            component={Link}
            to={`/jobs/${id}/upload`}
            variant="contained"
            startIcon={<UploadFileIcon />}
          >
            Upload CVs
          </Button>
          <Button variant="outlined" startIcon={<EditIcon />}>
            Edit
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}
