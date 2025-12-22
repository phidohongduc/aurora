import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material'
import { motion } from 'motion/react'
import { Briefcase, MapPin, Clock, Search, Plus, ChevronRight, X } from 'lucide-react'
import type { JobRequisition } from '@/types'
import { getJobList, deleteJob } from './APIHandler'

type FilterStatus = 'all' | 'active' | 'paused' | 'closed'

export default function JobListPage() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<JobRequisition[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobList()
        if (response.success) {
          setJobs(response.data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const handleDeleteJob = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation() // Prevent navigation to job detail
    
    if (!confirm('Are you sure you want to delete this job requisition?')) {
      return
    }

    setDeletingId(jobId)
    try {
      const response = await deleteJob(jobId)
      if (response.success) {
        setJobs(jobs.filter(job => job.id !== jobId))
        setSnackbar({
          open: true,
          message: 'Job requisition deleted successfully',
          severity: 'success',
        })
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to delete job requisition',
          severity: 'error',
        })
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting job requisition',
        severity: 'error',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusStyles = (status: JobRequisition['status']) => {
    switch (status) {
      case 'active':
        return {
          bgcolor: '#DCFCE7',
          color: '#15803D',
          borderColor: '#BBF7D0',
        }
      case 'paused':
        return {
          bgcolor: '#FEF9C3',
          color: '#A16207',
          borderColor: '#FDE68A',
        }
      case 'closed':
        return {
          bgcolor: '#F1F5F9',
          color: '#475569',
          borderColor: '#E2E8F0',
        }
      default:
        return {
          bgcolor: '#F1F5F9',
          color: '#475569',
          borderColor: '#E2E8F0',
        }
    }
  }

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Job Requisitions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track open positions
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/jobs/new"
          variant="contained"
          startIcon={<Plus size={20} strokeWidth={2} />}
          sx={{
            px: 3,
            py: 1.5,
            bgcolor: '#4F46E5',
            '&:hover': { bgcolor: '#4338CA' },
          }}
        >
          Create New Requisition
        </Button>
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by title or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} className="text-gray-400" strokeWidth={1.5} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['all', 'active', 'paused', 'closed'] as const).map((status) => (
              <Button
                key={status}
                variant="text"
                onClick={() => setFilterStatus(status)}
                sx={{
                  px: 2,
                  py: 1,
                  textTransform: 'capitalize',
                  bgcolor: filterStatus === status ? '#EEF2FF' : '#F1F5F9',
                  color: filterStatus === status ? '#4338CA' : '#475569',
                  '&:hover': {
                    bgcolor: filterStatus === status ? '#E0E7FF' : '#E2E8F0',
                  },
                }}
              >
                {status}
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredJobs.length === 0 ? (
        /* Empty State */
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Briefcase size={48} className="text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            No job requisitions found
          </Typography>
          <Button
            component={Link}
            to="/jobs/new"
            variant="contained"
            sx={{
              bgcolor: '#4F46E5',
              '&:hover': { bgcolor: '#4338CA' },
            }}
          >
            Create Your First Requisition
          </Button>
        </Paper>
      ) : (
        /* Job Requisitions Grid */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Paper
                onClick={() => handleJobClick(job.id)}
              sx={{
                p: 3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#C7D2FE',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
                '&:hover .job-title': {
                  color: '#4F46E5',
                },
                '&:hover .chevron-icon': {
                  color: '#4F46E5',
                },
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Icon */}
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

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* Title Row */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        className="job-title"
                        sx={{ transition: 'color 0.2s' }}
                      >
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.department}
                      </Typography>
                    </Box>
                    <Chip
                      label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      size="small"
                      sx={{
                        ...getStatusStyles(job.status),
                        border: '1px solid',
                        fontWeight: 500,
                      }}
                    />
                  </Box>

                  {/* Info Row */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      mb: 2,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MapPin size={16} className="text-gray-400" strokeWidth={1.5} />
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Clock size={16} className="text-gray-400" strokeWidth={1.5} />
                      <Typography variant="body2" color="text.secondary">
                        {job.targetYearsMin}-{job.targetYearsMax} years exp.
                      </Typography>
                    </Box>
                  </Box>

                  {/* Skills Row */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {job.requiredSkills.slice(0, 5).map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        size="small"
                        sx={{
                          bgcolor: '#F1F5F9',
                          color: '#475569',
                          fontSize: '0.75rem',
                        }}
                      />
                    ))}
                    {job.requiredSkills.length > 5 && (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 0.5 }}>
                        +{job.requiredSkills.length - 5} more
                      </Typography>
                    )}
                  </Box>

                  {/* Footer Row */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Created {formatDate(job.createdAt)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {job.candidateCount || 0} candidate{job.candidateCount !== 1 ? 's' : ''}
                      </Typography>
                      <ChevronRight
                        size={20}
                        className="chevron-icon text-gray-400"
                        strokeWidth={1.5}
                        style={{ transition: 'color 0.2s' }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
            </motion.div>
          ))}
        </Box>
      )}
    </Container>
  )
}
