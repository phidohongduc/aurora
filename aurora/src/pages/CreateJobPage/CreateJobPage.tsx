import { useState, useEffect } from 'react'
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
import { motion, AnimatePresence } from 'motion/react'
import { Briefcase, MapPin, Users, FileText, Download } from 'lucide-react'
import type { LocationType, EmploymentType } from '@/types'
import { createJob } from './APIHandler'
import jsPDF from 'jspdf'
import { RichTextEditor } from '@/components/RichTextEditor'

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
  jobDescription: string
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
    jobDescription: '',
  })

  const [requiredSkillInput, setRequiredSkillInput] = useState('')
  const [niceToHaveInput, setNiceToHaveInput] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  // Listen for fillJobForm event from AI Companion
  useEffect(() => {
    const handleFillJobForm = async (event: Event) => {
      const customEvent = event as CustomEvent
      const data = customEvent.detail

      setIsAnimating(true)

      // Animate filling each field with a delay
      const animateField = (field: keyof FormData, value: any, delay: number) => {
        setTimeout(() => {
          setFormData(prev => ({ ...prev, [field]: value }))
        }, delay)
      }

      // Fill fields with staggered animation
      animateField('title', data.title || '', 100)
      animateField('department', data.department || '', 200)
      animateField('location', data.location || 'Remote', 300)
      animateField('employmentType', data.employmentType || 'Full-time', 400)
      animateField('hiringManager', data.hiringManager || '', 500)
      animateField('targetYearsMin', data.targetYearsMin?.toString() || '', 600)
      animateField('targetYearsMax', data.targetYearsMax?.toString() || '', 700)
      animateField('jobDescription', data.description || data.jobDescription || '', 800)
      
      // Animate skills with delay
      setTimeout(() => {
        setFormData(prev => ({ 
          ...prev, 
          requiredSkills: data.requiredSkills || [] 
        }))
      }, 900)
      
      setTimeout(() => {
        setFormData(prev => ({ 
          ...prev, 
          niceToHaveSkills: data.niceToHaveSkills || [] 
        }))
        setIsAnimating(false)
      }, 1000)
    }

    window.addEventListener('fillJobForm', handleFillJobForm)
    return () => {
      window.removeEventListener('fillJobForm', handleFillJobForm)
    }
  }, [])

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  const handleDescriptionChange = (html: string) => {
    setFormData({ ...formData, jobDescription: html })
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

  const handleExportPDF = () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Job Description', 20, 20)
    
    // Job Title
    doc.setFontSize(16)
    doc.text(formData.title || 'Untitled Position', 20, 35)
    
    // Basic Info
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    let yPosition = 45
    
    if (formData.department) {
      doc.text(`Department: ${formData.department}`, 20, yPosition)
      yPosition += 7
    }
    
    if (formData.location) {
      doc.text(`Location: ${formData.location}`, 20, yPosition)
      yPosition += 7
    }
    
    if (formData.employmentType) {
      doc.text(`Employment Type: ${formData.employmentType}`, 20, yPosition)
      yPosition += 7
    }
    
    if (formData.hiringManager) {
      doc.text(`Hiring Manager: ${formData.hiringManager}`, 20, yPosition)
      yPosition += 7
    }
    
    if (formData.targetYearsMin || formData.targetYearsMax) {
      const yearsText = `Experience: ${formData.targetYearsMin || '0'} - ${formData.targetYearsMax || '∞'} years`
      doc.text(yearsText, 20, yPosition)
      yPosition += 10
    }
    
    // Job Description
    if (formData.jobDescription) {
      doc.setFont('helvetica', 'bold')
      doc.text('Description:', 20, yPosition)
      yPosition += 7
      doc.setFont('helvetica', 'normal')
      
      // Strip HTML tags and convert to plain text for PDF
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = formData.jobDescription
      const plainText = tempDiv.textContent || tempDiv.innerText || ''
      
      // Split description into lines that fit the page width
      const descriptionLines = doc.splitTextToSize(plainText, 170)
      descriptionLines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, 20, yPosition)
        yPosition += 5
      })
      yPosition += 5
    }
    
    // Required Skills
    if (formData.requiredSkills.length > 0) {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }
      doc.setFont('helvetica', 'bold')
      doc.text('Required Skills:', 20, yPosition)
      yPosition += 7
      doc.setFont('helvetica', 'normal')
      formData.requiredSkills.forEach(skill => {
        doc.text(`• ${skill}`, 25, yPosition)
        yPosition += 6
      })
      yPosition += 5
    }
    
    // Nice-to-have Skills
    if (formData.niceToHaveSkills.length > 0) {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }
      doc.setFont('helvetica', 'bold')
      doc.text('Nice-to-have Skills:', 20, yPosition)
      yPosition += 7
      doc.setFont('helvetica', 'normal')
      formData.niceToHaveSkills.forEach(skill => {
        doc.text(`• ${skill}`, 25, yPosition)
        yPosition += 6
      })
    }
    
    // Save the PDF
    const fileName = formData.title ? `JD_${formData.title.replace(/\\s+/g, '_')}.pdf` : 'Job_Description.pdf'
    doc.save(fileName)
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Create Job Requisition
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Define the role requirements and help AI match the best candidates
          </Typography>
        </Box>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {isAnimating && (
        <Alert severity="info" sx={{ mb: 3 }}>
          ✨ AI is filling in the form for you...
        </Alert>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
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
                  <AnimatePresence>
                    {formData.requiredSkills.map((skill, index) => (
                      <motion.div
                        key={`${skill}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Chip
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
                      </motion.div>
                    ))}
                  </AnimatePresence>
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
                  <AnimatePresence>
                    {formData.niceToHaveSkills.map((skill, index) => (
                      <motion.div
                        key={`${skill}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Chip
                          label={skill}
                          onDelete={() => handleRemoveSkill('niceToHave', index)}
                          variant="outlined"
                          sx={{
                            bgcolor: 'grey.100',
                            borderColor: 'grey.300',
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Job Description Section */}
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileText size={24} className="text-blue-600" strokeWidth={1.5} />
                <Typography variant="h6" fontWeight="600">
                  Job Description
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Download size={18} />}
                onClick={handleExportPDF}
                disabled={!formData.title}
                sx={{ textTransform: 'none' }}
              >
                Export as PDF
              </Button>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Job Description *
              </Typography>
              <RichTextEditor
                content={formData.jobDescription}
                onChange={handleDescriptionChange}
                disabled={loading}
              />
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              💡 Tip: Use <strong>Ctrl+B</strong> for bold, <strong>Ctrl+I</strong> for italic, and the toolbar buttons for formatting. Export to PDF when done!
            </Typography>
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
      </motion.div>
    </Container>
  )
}
