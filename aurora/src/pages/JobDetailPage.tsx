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
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import EditIcon from '@mui/icons-material/Edit'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()

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
            Job Requisition #{id}
          </Typography>
          <Chip label="Open" color="success" />
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Department
            </Typography>
            <Typography variant="body1">Engineering</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body1">December 22, 2025</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1">
              This is a sample job description. Edit this job to add more details.
            </Typography>
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
