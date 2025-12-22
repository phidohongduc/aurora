import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  Grid,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  Divider,
} from '@mui/material'
import { Briefcase, MapPin, Users } from 'lucide-react'
import type { LocationType, EmploymentType } from '@/types'
import { createJob } from './APIHandler'

interface FormData {
  title: string
  department: string
  location: LocationType
  employmentType: EmploymentType
  hiringManager: string
  targetYearsMin: string
  targetYearsMax: string
  requiredSkills: string[]
  niceToHaveSkills: string[]
}

const locationOptions: LocationType[] = ['Remote', 'Hybrid', 'Onsite']
const employmentTypeOptions: EmploymentType[] = ['Full-time', 'Part-time', 'Contract']

export default function CreateJobPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    title: '',
    department: '',
    location: 'Remote',
    employmentType: 'Full-time',
    hiringManager: '',
    targetYearsMin: '',
    targetYearsMax: '',
    requiredSkills: [],
    niceToHaveSkills: [],
  })

  const [requiredSkillInput, setRequiredSkillInput] = useState('')
  const [niceToHaveInput, setNiceToHaveInput] = useState('')

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  const handleAddSkill = (type: 'required' | 'niceToHave') => {
    const input = type === 'required' ? requiredSkillInput : niceToHaveInput
    if (!input.trim()) return

    const skillArray = type === 'required' ? 'requiredSkills' : 'niceToHaveSkills'
    setFormData({
      ...formData,
      [skillArray]: [...formData[skillArray], input.trim()],
    })

    if (type === 'required') {
      setRequiredSkillInput('')
    } else {
      setNiceToHaveInput('')
    }
  }

  const handleRemoveSkill = (type: 'required' | 'niceToHave', index: number) => {
    const skillArray = type === 'required' ? 'requiredSkills' : 'niceToHaveSkills'
    setFormData({
      ...formData,
      [skillArray]: formData[skillArray].filter((_, i) => i !== index),
    })
  }

  const handleKeyPress = (type: 'required' | 'niceToHave') => (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill(type)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await createJob({
        title: formData.title,
        department: formData.department,
        location: formData.location,
        employmentType: formData.employmentType,
        hiringManager: formData.hiringManager,
        targetYearsMin: formData.targetYearsMin ? Number(formData.targetYearsMin) : undefined,
        targetYearsMax: formData.targetYearsMax ? Number(formData.targetYearsMax) : undefined,
        requiredSkills: formData.requiredSkills,
        niceToHaveSkills: formData.niceToHaveSkills,
      })

      if (response.success) {
        navigate('/jobs')
      } else {
        setError(response.message || 'Failed to create job')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Create Job Requisition
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Define the role requirements and help AI match the best candidates
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Briefcase size={24} className="text-blue-600" strokeWidth={1.5} />
              <Typography variant="h6" fontWeight="600">
                Basic Information
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  label="Job Title"
                  required
                  fullWidth
                  value={formData.title}
                  onChange={handleChange('title')}
                  placeholder="e.g., Senior Backend Engineer"
                  disabled={loading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Department"
                  required
                  fullWidth
                  value={formData.department}
                  onChange={handleChange('department')}
                  placeholder="e.g., Engineering"
                  disabled={loading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Hiring Manager"
                  required
                  fullWidth
                  value={formData.hiringManager}
                  onChange={handleChange('hiringManager')}
                  placeholder="e.g., Sarah Johnson"
                  disabled={loading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  label="Location"
                  required
                  fullWidth
                  value={formData.location}
                  onChange={handleChange('location')}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MapPin size={18} strokeWidth={1.5} />
                      </InputAdornment>
                    ),
                  }}
                >
                  {locationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  label="Employment Type"
                  required
                  fullWidth
                  value={formData.employmentType}
                  onChange={handleChange('employmentType')}
                  disabled={loading}
                >
                  {employmentTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Experience & Skills Section */}
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Users size={24} className="text-blue-600" strokeWidth={1.5} />
              <Typography variant="h6" fontWeight="600">
                Experience & Skills
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Target Years of Experience (Min)"
                  type="number"
                  fullWidth
                  value={formData.targetYearsMin}
                  onChange={handleChange('targetYearsMin')}
                  placeholder="e.g., 5"
                  disabled={loading}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Target Years of Experience (Max)"
                  type="number"
                  fullWidth
                  value={formData.targetYearsMax}
                  onChange={handleChange('targetYearsMax')}
                  placeholder="e.g., 10"
                  disabled={loading}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              {/* Required Skills */}
              <Grid size={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Required Skills *
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={requiredSkillInput}
                    onChange={(e) => setRequiredSkillInput(e.target.value)}
                    onKeyPress={handleKeyPress('required')}
                    placeholder="Type a skill and press Enter"
                    disabled={loading}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleAddSkill('required')}
                    disabled={loading || !requiredSkillInput.trim()}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.requiredSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleRemoveSkill('required', index)}
                      color="primary"
                      variant="outlined"
                      sx={{
                        bgcolor: 'primary.50',
                        borderColor: 'primary.200',
                        '& .MuiChip-deleteIcon': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Nice-to-have Skills */}
              <Grid size={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Nice-to-have Skills
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={niceToHaveInput}
                    onChange={(e) => setNiceToHaveInput(e.target.value)}
                    onKeyPress={handleKeyPress('niceToHave')}
                    placeholder="Type a skill and press Enter"
                    disabled={loading}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => handleAddSkill('niceToHave')}
                    disabled={loading || !niceToHaveInput.trim()}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.niceToHaveSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleRemoveSkill('niceToHave', index)}
                      variant="outlined"
                      sx={{
                        bgcolor: 'grey.100',
                        borderColor: 'grey.300',
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/jobs')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
              sx={{ px: 4 }}
            >
              {loading ? 'Creating...' : 'Create Job Requisition'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
