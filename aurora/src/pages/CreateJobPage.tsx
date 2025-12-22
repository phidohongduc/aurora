import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  Stack,
} from '@mui/material'

export default function CreateJobPage() {
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement job creation logic
    navigate('/jobs')
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Create New Job Requisition
      </Typography>
      <Paper sx={{ p: 4, mt: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Job Title"
              placeholder="e.g., Senior Software Engineer"
              fullWidth
              required
            />
            <TextField
              label="Department"
              placeholder="e.g., Engineering"
              fullWidth
              required
            />
            <TextField
              label="Job Description"
              placeholder="Describe the role and responsibilities..."
              multiline
              rows={6}
              fullWidth
              required
            />
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" size="large">
                Create Job
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/jobs')}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}
