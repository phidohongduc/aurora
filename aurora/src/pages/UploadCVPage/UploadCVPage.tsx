import { useEffect, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Box,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DescriptionIcon from '@mui/icons-material/Description'
import DeleteIcon from '@mui/icons-material/Delete'
import type { CV } from '@/types'
import { getCVsForJob, uploadMultipleCVs, deleteCV } from './APIHandler'

export default function UploadCVPage() {
  const { id } = useParams<{ id: string }>()
  const [cvs, setCvs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fetchCVs = useCallback(async () => {
    if (!id) return
    try {
      const response = await getCVsForJob(id)
      if (response.success) {
        setCvs(response.data)
      }
    } catch {
      setError('Failed to load CVs')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCVs()
  }, [fetchCVs])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !id) return

    setUploading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await uploadMultipleCVs(id, Array.from(files))
      if (response.success) {
        setCvs(prev => [...prev, ...response.data])
        setSuccessMessage(response.message || 'Files uploaded successfully')
      } else {
        setError(response.message || 'Failed to upload files')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setUploading(false)
      // Reset the input
      e.target.value = ''
    }
  }

  const handleDelete = async (cvId: string) => {
    if (!id) return

    try {
      const response = await deleteCV(id, cvId)
      if (response.success) {
        setCvs(prev => prev.filter(cv => cv.id !== cvId))
        setSuccessMessage('CV deleted successfully')
      }
    } catch {
      setError('Failed to delete CV')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: CV['status']) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'reviewed':
        return 'info'
      case 'shortlisted':
        return 'success'
      case 'rejected':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        component={Link}
        to={`/jobs/${id}`}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Job #{id}
      </Button>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Upload CVs
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      <Paper
        sx={{
          p: 6,
          mt: 3,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: 'divider',
          backgroundColor: 'grey.50',
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drag and drop CV files here
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          or
        </Typography>
        <Button
          variant="contained"
          component="label"
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : undefined}
        >
          {uploading ? 'Uploading...' : 'Browse Files'}
          <input
            type="file"
            hidden
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
          />
        </Button>
        <Typography variant="caption" display="block" sx={{ mt: 2 }} color="text.secondary">
          Supported formats: PDF, DOC, DOCX
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Uploaded CVs ({cvs.length})
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : cvs.length === 0 ? (
          <List>
            <ListItem>
              <DescriptionIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <ListItemText
                primary="No CVs uploaded yet."
                primaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
          </List>
        ) : (
          <List>
            {cvs.map((cv) => (
              <ListItem key={cv.id} divider>
                <DescriptionIcon sx={{ mr: 2, color: 'primary.main' }} />
                <ListItemText
                  primary={cv.fileName}
                  secondary={`${formatFileSize(cv.fileSize)} • ${formatDate(cv.uploadedAt)}`}
                />
                <Chip
                  label={cv.status.charAt(0).toUpperCase() + cv.status.slice(1)}
                  color={getStatusColor(cv.status)}
                  size="small"
                  sx={{ mr: 2 }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(cv.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  )
}
