import { Link, useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DescriptionIcon from '@mui/icons-material/Description'

export default function UploadCVPage() {
  const { id } = useParams<{ id: string }>()

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
        <Button variant="contained" component="label">
          Browse Files
          <input type="file" hidden multiple accept=".pdf,.doc,.docx" />
        </Button>
        <Typography variant="caption" display="block" sx={{ mt: 2 }} color="text.secondary">
          Supported formats: PDF, DOC, DOCX
        </Typography>
      </Paper>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Uploaded CVs
        </Typography>
        <List>
          <ListItem>
            <DescriptionIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <ListItemText
              primary="No CVs uploaded yet."
              primaryTypographyProps={{ color: 'text.secondary' }}
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  )
}
