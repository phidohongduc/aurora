import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Button,
  ButtonGroup,
  LinearProgress,
  Divider,
} from '@mui/material'
import { motion } from 'motion/react'
import {
  Search,
  Briefcase,
  Calendar,
  FileText,
  FolderKanban,
  X,
  ExternalLink,
  User as UserIcon,
  Network,
  GitBranch,
} from 'lucide-react'

interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  location: 'Remote' | 'Hybrid' | 'Onsite'
  skills: string[]
  topSkills: string[]
  yearsOfExperience: number
  relevantYearsOfExperience: number
  education: string
  aiMatchScore: number
  hireDate: string
  manager: string
  contractLink: string
  projects: string[]
}

// Mock employee data
const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP-2025-100',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    position: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'Redux'],
    topSkills: ['React', 'TypeScript', 'JavaScript'],
    yearsOfExperience: 8,
    relevantYearsOfExperience: 6,
    education: 'BS in Computer Science',
    aiMatchScore: 95,
    hireDate: '2025-03-01',
    manager: 'Mike Chen',
    contractLink: '/contracts/emp-2025-100.pdf',
    projects: ['Design System Redesign', 'Component Library', 'Performance Optimization'],
  },
  {
    id: '2',
    employeeId: 'EMP-2025-101',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    phone: '+1 (555) 234-5678',
    position: 'Backend Engineer',
    department: 'Engineering',
    location: 'Hybrid',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS', 'Redis', 'Microservices'],
    topSkills: ['Python', 'Django', 'PostgreSQL'],
    yearsOfExperience: 6,
    relevantYearsOfExperience: 5,
    education: 'MS in Software Engineering',
    aiMatchScore: 92,
    hireDate: '2025-02-15',
    manager: 'Sarah Johnson',
    contractLink: '/contracts/emp-2025-101.pdf',
    projects: ['API Redesign', 'Database Migration', 'Microservices Architecture'],
  },
  {
    id: '3',
    employeeId: 'EMP-2025-102',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    phone: '+1 (555) 345-6789',
    position: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    skills: ['Node.js', 'React', 'MongoDB', 'Express', 'TypeScript', 'GraphQL'],
    topSkills: ['Node.js', 'React', 'MongoDB'],
    yearsOfExperience: 5,
    relevantYearsOfExperience: 4,
    education: 'BS in Computer Science',
    aiMatchScore: 88,
    hireDate: '2025-03-10',
    manager: 'Mike Chen',
    contractLink: '/contracts/emp-2025-102.pdf',
    projects: ['Frontend Refactor', 'REST API Development', 'Mobile App'],
  },
  {
    id: '4',
    employeeId: 'EMP-2025-103',
    name: 'David Kim',
    email: 'david.kim@company.com',
    phone: '+1 (555) 456-7890',
    position: 'AI Engineer',
    department: 'Engineering',
    location: 'Onsite',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'NLP', 'Computer Vision'],
    topSkills: ['Python', 'TensorFlow', 'Machine Learning'],
    yearsOfExperience: 7,
    relevantYearsOfExperience: 5,
    education: 'PhD in Machine Learning',
    aiMatchScore: 96,
    hireDate: '2025-01-20',
    manager: 'Dr. Lisa Wang',
    contractLink: '/contracts/emp-2025-103.pdf',
    projects: ['AI Chatbot Development', 'Model Training Pipeline', 'NLP Research'],
  },
  {
    id: '5',
    employeeId: 'EMP-2025-104',
    name: 'Jessica Brown',
    email: 'jessica.brown@company.com',
    phone: '+1 (555) 567-8901',
    position: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Hybrid',
    skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Terraform', 'Jenkins', 'Monitoring'],
    topSkills: ['Kubernetes', 'Docker', 'AWS'],
    yearsOfExperience: 6,
    relevantYearsOfExperience: 5,
    education: 'BS in Information Systems',
    aiMatchScore: 90,
    hireDate: '2025-02-01',
    manager: 'Tom Anderson',
    contractLink: '/contracts/emp-2025-104.pdf',
    projects: ['Infrastructure Migration', 'CI/CD Pipeline Setup', 'Monitoring System'],
  },
  {
    id: '6',
    employeeId: 'EMP-2025-105',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    phone: '+1 (555) 678-9012',
    position: 'Data Engineer',
    department: 'Data',
    location: 'Remote',
    skills: ['Python', 'SQL', 'Spark', 'Airflow', 'BigQuery', 'ETL', 'Data Modeling'],
    topSkills: ['Python', 'SQL', 'Spark'],
    yearsOfExperience: 5,
    relevantYearsOfExperience: 4,
    education: 'MS in Data Science',
    aiMatchScore: 87,
    hireDate: '2025-03-15',
    manager: 'Dr. Lisa Wang',
    contractLink: '/contracts/emp-2025-105.pdf',
    projects: ['Data Warehouse Design', 'ETL Pipeline Development', 'Analytics Dashboard'],
  },
]

export default function EmployeesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Filter employees by name, position, department, or skills
  const filteredEmployees = mockEmployees.filter((employee) => {
    const query = searchQuery.toLowerCase()
    return (
      employee.name.toLowerCase().includes(query) ||
      employee.position.toLowerCase().includes(query) ||
      employee.department.toLowerCase().includes(query) ||
      employee.employeeId.toLowerCase().includes(query) ||
      employee.skills.some((skill) => skill.toLowerCase().includes(query))
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
              Employee Directory
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View all hired employees and their information
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ButtonGroup
              variant="contained"
              sx={{
                boxShadow: '0 4px 14px rgba(102, 126, 234, 0.3)',
                '& .MuiButton-root': {
                  borderRadius: '12px !important',
                  px: 2.5,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                },
                '& .MuiButtonGroup-grouped:not(:last-of-type)': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              <Button
                startIcon={<Network size={18} />}
                onClick={() => navigate('/employees/skill-network')}
                sx={{
                  background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4290 100%)',
                  },
                }}
              >
                Skill Network
              </Button>
              <Button
                startIcon={<GitBranch size={18} />}
                onClick={() => navigate('/employees/network')}
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0ea572 0%, #048a5c 100%)',
                  },
                }}
              >
                Graph Network
              </Button>
            </ButtonGroup>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h3" color="primary.main" fontWeight="bold">
                {mockEmployees.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Employees
              </Typography>
            </Box>
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
            placeholder="Search by name, department, position, or skills..."
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
          {filteredEmployees.map((employee, index) => (
            <Grid key={employee.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  onClick={() => setSelectedEmployee(employee)}
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
                          background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
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
                          {employee.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {employee.position}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee.employeeId}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Info */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Briefcase size={16} color="#94a3b8" />
                        <Typography variant="body2" color="text.secondary">
                          Department:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {employee.department}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calendar size={16} color="#94a3b8" />
                        <Typography variant="body2" color="text.secondary">
                          Hired:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {new Date(employee.hireDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UserIcon size={16} color="#94a3b8" />
                        <Typography variant="body2" color="text.secondary">
                          Manager:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {employee.manager}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Top Skills */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Key Skills
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {employee.topSkills.map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            size="small"
                            sx={{
                              bgcolor: 'primary.50',
                              color: 'primary.main',
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
                          {employee.yearsOfExperience} years
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((employee.yearsOfExperience / 15) * 100, 100)}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#E2E8F0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: 'primary.main',
                          },
                        }}
                      />
                    </Box>

                    {/* Quick Actions */}
                    <Grid container spacing={1}>
                      <Grid size={6}>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          startIcon={<FileText size={14} />}
                          onClick={(e) => {
                            e.stopPropagation()
                            alert(`Opening contract for ${employee.name}`)
                          }}
                          sx={{ fontSize: '0.75rem', py: 0.75 }}
                        >
                          Contract
                        </Button>
                      </Grid>
                      <Grid size={6}>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          startIcon={<FolderKanban size={14} />}
                          onClick={(e) => {
                            e.stopPropagation()
                            alert(`Opening projects for ${employee.name}`)
                          }}
                          sx={{ fontSize: '0.75rem', py: 0.75 }}
                        >
                          Projects
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {filteredEmployees.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <UserIcon size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No employees found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search query
            </Typography>
          </Paper>
        )}
      </motion.div>

      {/* Employee Detail Modal */}
      <Dialog
        open={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedEmployee && (
          <DialogContent sx={{ p: 4 }}>
            {/* Modal Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
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
                    {selectedEmployee.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {selectedEmployee.position}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEmployee.employeeId}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => setSelectedEmployee(null)}
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
                  Employment Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Department:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedEmployee.department}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Manager:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedEmployee.manager}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Hire Date:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {new Date(selectedEmployee.hireDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Location:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedEmployee.location}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={6}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  CV Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Experience:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedEmployee.yearsOfExperience} years
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Relevant Exp:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedEmployee.relevantYearsOfExperience} years
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Education:
                    </Typography>
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {selectedEmployee.education}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      AI Match Score:
                    </Typography>
                    <Typography variant="body2" fontWeight={500} color="primary.main">
                      {selectedEmployee.aiMatchScore}%
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
                {selectedEmployee.skills.map((skill) => (
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

            {/* Projects */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Assigned Projects
              </Typography>
              <Grid container spacing={2}>
                {selectedEmployee.projects.map((project) => (
                  <Grid key={project} size={4}>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: 'primary.50',
                        border: '1px solid',
                        borderColor: 'primary.200',
                      }}
                    >
                      <Typography variant="body2" color="primary.main" fontWeight={500}>
                        {project}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Actions */}
            <Grid container spacing={2}>
              <Grid size={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<FileText size={18} />}
                  endIcon={<ExternalLink size={14} />}
                  onClick={() => alert(`Opening contract: ${selectedEmployee.contractLink}`)}
                >
                  View Contract
                </Button>
              </Grid>
              <Grid size={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<FolderKanban size={18} />}
                  endIcon={<ExternalLink size={14} />}
                  onClick={() => alert(`Opening projects for ${selectedEmployee.name}`)}
                >
                  View All Projects
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        )}
      </Dialog>
    </Container>
  )
}
