import { useEffect, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Chip,
} from '@mui/material'
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react'
import type { CV, JobRequisition } from '@/types'
import { getCVsForJob, uploadCV, uploadMultipleCVs, deleteCV, getJobDetail } from './APIHandler'

export default function UploadCVPage() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<JobRequisition | null>(null)
  const [cvs, setCvs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [expandedCVs, setExpandedCVs] = useState<Set<string>>(new Set())

  const fetchData = useCallback(async () => {
    if (!id) return
    try {
      const [jobResponse, cvsResponse] = await Promise.all([
        getJobDetail(id),
        getCVsForJob(id),
      ])

      if (jobResponse.success && jobResponse.data) {
        setJob(jobResponse.data)
      }

      if (cvsResponse.success) {
        setCvs(cvsResponse.data)
      }
    } catch {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSingleUpload = async () => {
    if (!id) return

    setUploading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Create a mock file for simulation
      const mockFile = new File([''], 'resume.pdf', { type: 'application/pdf' })
      const response = await uploadCV(id, mockFile)

      if (response.success) {
        setCvs(prev => [...prev, response.data])
        setSuccessMessage('CV uploaded and parsed successfully')
      } else {
        setError(response.message || 'Failed to upload CV')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setUploading(false)
    }
  }

  const handleBatchUpload = async () => {
    if (!id) return

    setUploading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Create mock files for simulation (3 files)
      const mockFiles = [
        new File([''], 'resume1.pdf', { type: 'application/pdf' }),
        new File([''], 'resume2.pdf', { type: 'application/pdf' }),
        new File([''], 'resume3.pdf', { type: 'application/pdf' }),
      ]
      const response = await uploadMultipleCVs(id, mockFiles)

      if (response.success) {
        setCvs(prev => [...prev, ...response.data])
        setSuccessMessage(response.message || 'CVs uploaded successfully')
      } else {
        setError(response.message || 'Failed to upload CVs')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (cvId: string) => {
    if (!id) return

    try {
      const response = await deleteCV(id, cvId)
      if (response.success) {
        setCvs(prev => prev.filter(cv => cv.id !== cvId))
        setExpandedCVs(prev => {
          const newSet = new Set(prev)
          newSet.delete(cvId)
          return newSet
        })
        setSuccessMessage('CV deleted successfully')
      }
    } catch {
      setError('Failed to delete CV')
    }
  }

  const toggleCVPreview = (cvId: string) => {
    setExpandedCVs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cvId)) {
        newSet.delete(cvId)
      } else {
        newSet.add(cvId)
      }
      return newSet
    })
  }

  const formatExperience = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified'
    if (min && max) return `${min}-${max} years`
    if (min) return `${min}+ years`
    if (max) return `Up to ${max} years`
    return 'Not specified'
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

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: 4 }}>
      <Button
        component={Link}
        to={`/jobs/${id}`}
        startIcon={<ArrowLeft size={20} strokeWidth={1.5} />}
        sx={{ mb: 3 }}
      >
        Back to Job
      </Button>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Upload Candidate CVs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload one or multiple candidate resumes for:{' '}
          <Typography component="span" fontWeight="500" color="text.primary">
            {job?.title || 'Job Position'}
          </Typography>
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {/* Job Requisition Summary */}
      {job && (
        <Paper
          sx={{
            p: 3,
            mb: 4,
            bgcolor: '#EEF2FF',
            borderColor: '#C7D2FE',
          }}
        >
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Job Requisition Summary
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary" component="span">
                Position:
              </Typography>
              <Typography variant="body2" fontWeight="500" component="span" sx={{ ml: 1 }}>
                {job.title}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" component="span">
                Department:
              </Typography>
              <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                {job.department}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" component="span">
                Location:
              </Typography>
              <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                {job.location}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" component="span">
                Experience:
              </Typography>
              <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                {formatExperience(job.targetYearsMin, job.targetYearsMax)}
              </Typography>
            </Box>
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Required Skills:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {job.requiredSkills.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      size="small"
                      sx={{
                        bgcolor: '#C7D2FE',
                        color: '#4338CA',
                        fontSize: '0.75rem',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      {/* CV Upload Area */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#DBEAFE',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileText size={20} className="text-blue-600" strokeWidth={1.5} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="600">
              Candidate Resumes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload CVs for AI parsing and screening
            </Typography>
          </Box>
        </Box>

        {cvs.length === 0 ? (
          <Box>
            {/* Drop Zone */}
            <Box
              onClick={handleSingleUpload}
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                p: 6,
                textAlign: 'center',
                cursor: uploading ? 'wait' : 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(59, 130, 246, 0.05)',
                },
              }}
            >
              {uploading ? (
                <CircularProgress size={48} sx={{ mb: 2 }} />
              ) : (
                <Upload size={48} className="text-gray-400 mx-auto mb-4" strokeWidth={1.5} />
              )}
              <Typography variant="body1" gutterBottom>
                {uploading ? 'Uploading and parsing...' : 'Drop your CV here or click to browse'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supports PDF, DOCX up to 10MB
              </Typography>
            </Box>

            {/* Divider */}
            <Box sx={{ position: 'relative', my: 3 }}>
              <Box sx={{ borderTop: 1, borderColor: 'divider' }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.paper',
                  px: 2,
                }}
              >
                or
              </Typography>
            </Box>

            {/* Batch Upload Button */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleBatchUpload}
              disabled={uploading}
              sx={{
                py: 1.5,
                bgcolor: '#F1F5F9',
                borderColor: '#F1F5F9',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: '#E2E8F0',
                  borderColor: '#E2E8F0',
                },
              }}
            >
              Upload Multiple CVs (Batch)
            </Button>
          </Box>
        ) : (
          <Box>
            {/* Uploaded CVs List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {cvs.map((cv) => (
                <Paper
                  key={cv.id}
                  sx={{
                    p: 2,
                    bgcolor: '#F0FDF4',
                    borderColor: '#BBF7D0',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <CheckCircle2
                      size={20}
                      className="text-green-600 mt-0.5 flex-shrink-0"
                      strokeWidth={1.5}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body1"
                            fontWeight="500"
                            sx={{ color: '#166534' }}
                          >
                            {cv.parsed?.name || 'Unknown'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#15803D' }}>
                            {cv.fileName}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          onClick={() => handleDelete(cv.id)}
                          sx={{
                            minWidth: 'auto',
                            p: 0.5,
                            color: '#16A34A',
                            '&:hover': { color: '#166534' },
                          }}
                        >
                          <X size={16} strokeWidth={1.5} />
                        </Button>
                      </Box>

                      {/* Toggle Preview Button */}
                      <Button
                        fullWidth
                        size="small"
                        onClick={() => toggleCVPreview(cv.id)}
                        sx={{
                          justifyContent: 'space-between',
                          px: 2,
                          py: 1,
                          bgcolor: 'white',
                          color: 'text.primary',
                          '&:hover': { bgcolor: '#DCFCE7' },
                        }}
                        endIcon={
                          expandedCVs.has(cv.id) ? (
                            <ChevronUp size={16} strokeWidth={1.5} />
                          ) : (
                            <ChevronDown size={16} strokeWidth={1.5} />
                          )
                        }
                      >
                        View Parsed Data
                      </Button>

                      {/* Expanded Preview */}
                      {expandedCVs.has(cv.id) && cv.parsed && (
                        <Box
                          component="pre"
                          sx={{
                            mt: 2,
                            p: 2,
                            bgcolor: '#1E293B',
                            color: '#4ADE80',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            overflow: 'auto',
                            maxHeight: 200,
                            fontFamily: 'monospace',
                          }}
                        >
                          {JSON.stringify(cv.parsed, null, 2)}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>

            {/* Add More Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleSingleUpload}
                disabled={uploading}
                sx={{
                  py: 1,
                  bgcolor: '#EFF6FF',
                  borderColor: '#EFF6FF',
                  color: '#1D4ED8',
                  '&:hover': {
                    bgcolor: '#DBEAFE',
                    borderColor: '#DBEAFE',
                  },
                }}
              >
                {uploading ? <CircularProgress size={20} /> : '+ Add Another CV'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleBatchUpload}
                disabled={uploading}
                sx={{
                  py: 1,
                  bgcolor: '#EFF6FF',
                  borderColor: '#EFF6FF',
                  color: '#1D4ED8',
                  '&:hover': {
                    bgcolor: '#DBEAFE',
                    borderColor: '#DBEAFE',
                  },
                }}
              >
                + Add Multiple CVs
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Action Button */}
      {cvs.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {cvs.length} CV{cvs.length !== 1 ? 's' : ''} ready for screening
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              bgcolor: '#4F46E5',
              '&:hover': { bgcolor: '#4338CA' },
            }}
          >
            Proceed to Screening ({cvs.length} Candidate{cvs.length !== 1 ? 's' : ''})
          </Button>
        </Box>
      )}
    </Container>
  )
}
