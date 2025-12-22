import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Grid,
  Chip,
  InputAdornment,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
  LinearProgress,
  Divider,
} from '@mui/material'
import { motion } from 'motion/react'
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Calendar,
  X,
  User as UserIcon,
  Target,
  TrendingUp,
} from 'lucide-react'

interface Candidate {
  id: string
  candidateId: string
  name: string
  email: string
  phone: string
  currentRole: string
  location: 'Remote' | 'Hybrid' | 'Onsite'
  skills: string[]
  topSkills: string[]
  yearsOfExperience: number
  relevantYearsOfExperience: number
  education: string
  appliedDate: string
  status: 'Applied' | 'Screening' | 'Interview' | 'Not Offered'
  // AI Job Matching
  jobMatches?: Array<{
    jobId: string
    jobTitle: string
    matchScore: number
  }>
}

const mockCandidates: Candidate[] = [
  {
    id: '1',
    candidateId: 'CND-2025-001',
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    phone: '+1 (555) 234-5678',
    currentRole: 'Senior Full Stack Developer',
    location: 'Remote',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'GraphQL', 'Docker'],
    topSkills: ['React', 'Node.js', 'TypeScript'],
    yearsOfExperience: 7,
    relevantYearsOfExperience: 6,
    education: 'B.S. Computer Science, MIT',
    appliedDate: '2025-12-15',
    status: 'Not Offered',
    jobMatches: [
      { jobId: 'JR-2025-001', jobTitle: 'Senior Full Stack Engineer', matchScore: 94 },
      { jobId: 'JR-2025-003', jobTitle: 'Lead Frontend Developer', matchScore: 88 },
    ],
  },
  {
    id: '2',
    candidateId: 'CND-2025-002',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1 (555) 345-6789',
    currentRole: 'Backend Engineer',
    location: 'Hybrid',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Kubernetes', 'CI/CD'],
    topSkills: ['Python', 'Django', 'PostgreSQL'],
    yearsOfExperience: 5,
    relevantYearsOfExperience: 5,
    education: 'M.S. Software Engineering, Stanford',
    appliedDate: '2025-12-18',
    status: 'Not Offered',
    jobMatches: [
      { jobId: 'JR-2025-002', jobTitle: 'Backend Engineer', matchScore: 91 },
    ],
  },
  {
    id: '3',
    candidateId: 'CND-2025-003',
    name: 'James Park',
    email: 'james.park@email.com',
    phone: '+1 (555) 456-7890',
    currentRole: 'Cloud Solutions Architect',
    location: 'Onsite',
    skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'Python', 'Cloud Security'],
    topSkills: ['AWS', 'Azure', 'Terraform'],
    yearsOfExperience: 9,
    relevantYearsOfExperience: 8,
    education: 'B.S. Information Systems, UC Berkeley',
    appliedDate: '2025-12-10',
    status: 'Not Offered',
    jobMatches: [],
  },
  {
    id: '4',
    candidateId: 'CND-2025-004',
    name: 'Sophie Chen',
    email: 'sophie.chen@email.com',
    phone: '+1 (555) 567-8901',
    currentRole: 'UI/UX Engineer',
    location: 'Remote',
    skills: ['React', 'Vue.js', 'Figma', 'TypeScript', 'CSS', 'Accessibility'],
    topSkills: ['React', 'Vue.js', 'Figma'],
    yearsOfExperience: 4,
    relevantYearsOfExperience: 4,
    education: 'B.A. Design & Computer Science, RISD',
    appliedDate: '2025-12-20',
    status: 'Interview',
    jobMatches: [
      { jobId: 'JR-2025-003', jobTitle: 'Lead Frontend Developer', matchScore: 85 },
      { jobId: 'JR-2025-005', jobTitle: 'UI Engineer', matchScore: 92 },
    ],
  },
  {
    id: '5',
    candidateId: 'CND-2025-005',
    name: 'Daniel Martinez',
    email: 'daniel.martinez@email.com',
    phone: '+1 (555) 678-9012',
    currentRole: 'DevOps Engineer',
    location: 'Hybrid',
    skills: ['Kubernetes', 'Docker', 'Jenkins', 'Ansible', 'AWS', 'GitLab CI'],
    topSkills: ['Kubernetes', 'Docker', 'Jenkins'],
    yearsOfExperience: 6,
    relevantYearsOfExperience: 5,
    education: 'B.S. Computer Engineering, Georgia Tech',
    appliedDate: '2025-12-12',
    status: 'Not Offered',
    jobMatches: [
      { jobId: 'JR-2025-004', jobTitle: 'DevOps Lead', matchScore: 89 },
    ],
  },
  {
    id: '6',
    candidateId: 'CND-2025-006',
    name: 'Rachel Kim',
    email: 'rachel.kim@email.com',
    phone: '+1 (555) 789-0123',
    currentRole: 'Data Engineer',
    location: 'Remote',
    skills: ['Python', 'Spark', 'Airflow', 'SQL', 'Snowflake', 'ETL'],
    topSkills: ['Python', 'Spark', 'SQL'],
    yearsOfExperience: 5,
    relevantYearsOfExperience: 4,
    education: 'M.S. Data Science, CMU',
    appliedDate: '2025-12-08',
    status: 'Not Offered',
    jobMatches: [],
  },
]

export default function CandidateDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const filteredCandidates = mockCandidates.filter((candidate) => {
    const query = searchQuery.toLowerCase()
    return (
      candidate.name.toLowerCase().includes(query) ||
      candidate.candidateId.toLowerCase().includes(query) ||
      candidate.currentRole.toLowerCase().includes(query) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(query))
    )
  })

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Candidate Directory
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View all candidates and AI-powered job matching
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              {mockCandidates.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Candidates
            </Typography>
          </Box>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Paper sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by name, candidate ID, role, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        <Grid container spacing={3}>
          {filteredCandidates.map((candidate, index) => (
            <Grid key={candidate.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  onClick={() => setSelectedCandidate(candidate)}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, pb: 2, borderBottom: '1px solid #E2E8F0' }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <UserIcon size={32} color="white" />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" fontWeight={600} noWrap>
                          {candidate.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {candidate.currentRole}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {candidate.candidateId}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Info */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MapPin size={16} color="#94a3b8" />
                        <Typography variant="body2" color="text.secondary">
                          Location:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {candidate.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calendar size={16} color="#94a3b8" />
                        <Typography variant="body2" color="text.secondary">
                          Applied:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {new Date(candidate.appliedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Briefcase size={16} color="#94a3b8" />
                        <Typography variant="body2" color="text.secondary">
                          Status:
                        </Typography>
                        <Chip
                          label={candidate.status}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: candidate.status === 'Not Offered' ? 'grey.200' : 'primary.50',
                            color: candidate.status === 'Not Offered' ? 'grey.700' : 'primary.main',
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Top Skills */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Key Skills
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {candidate.topSkills.map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            size="small"
                            sx={{
                              bgcolor: 'warning.50',
                              color: 'warning.main',
                              fontWeight: 500,
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Experience Bar */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Experience
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {candidate.yearsOfExperience} years
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((candidate.yearsOfExperience / 15) * 100, 100)}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#E2E8F0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: 'warning.main',
                          },
                        }}
                      />
                    </Box>

                    {/* AI Job Matches */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <Target size={14} color="#94a3b8" />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          AI Job Matches
                        </Typography>
                      </Box>
                      {candidate.jobMatches && candidate.jobMatches.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {candidate.jobMatches.map((match) => (
                            <Box
                              key={match.jobId}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 1,
                                bgcolor: 'success.50',
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="caption" fontWeight={500} sx={{ flex: 1 }}>
                                {match.jobTitle}
                              </Typography>
                              <Chip
                                label={`${match.matchScore}%`}
                                size="small"
                                icon={<TrendingUp size={12} />}
                                sx={{
                                  height: 18,
                                  fontSize: '0.65rem',
                                  bgcolor: 'success.main',
                                  color: 'white',
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            p: 1.5,
                            bgcolor: 'grey.100',
                            borderRadius: 1,
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            No JR match
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {filteredCandidates.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <UserIcon size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No candidates found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search query
            </Typography>
          </Paper>
        )}
      </motion.div>

      {/* Candidate Detail Modal */}
      <Dialog
        open={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedCandidate && (
          <DialogContent sx={{ p: 4 }}>
            {/* Modal Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <UserIcon size={40} color="white" />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {selectedCandidate.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {selectedCandidate.currentRole}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedCandidate.candidateId}
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={() => setSelectedCandidate(null)}
                sx={{ 
                  width: 40, 
                  height: 40,
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                <X size={20} />
              </IconButton>
            </Box>

            {/* Details Grid */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={6}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Email:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedCandidate.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Phone:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedCandidate.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Location:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedCandidate.location}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={6}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Profile Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Experience:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedCandidate.yearsOfExperience} years
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Relevant Exp:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedCandidate.relevantYearsOfExperience} years
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Education:
                    </Typography>
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {selectedCandidate.education}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Applied Date:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {new Date(selectedCandidate.appliedDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Skills */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Technical Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedCandidate.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    sx={{
                      bgcolor: 'grey.100',
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* AI Job Matches */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                AI-Powered Job Matches
              </Typography>
              {selectedCandidate.jobMatches && selectedCandidate.jobMatches.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {selectedCandidate.jobMatches.map((match) => (
                    <Paper
                      key={match.jobId}
                      sx={{
                        p: 2,
                        bgcolor: 'success.50',
                        border: '1px solid',
                        borderColor: 'success.200',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight={600} color="success.main">
                          {match.jobTitle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Job ID: {match.jobId}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h5" fontWeight="bold" color="success.main">
                          {match.matchScore}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Match Score
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Paper sx={{ p: 3, bgcolor: 'grey.100', textAlign: 'center' }}>
                  <Target size={32} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    No Job Requisition Match
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    This candidate doesn't match any current job openings
                  </Typography>
                </Paper>
              )}
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Container>
  )
}
