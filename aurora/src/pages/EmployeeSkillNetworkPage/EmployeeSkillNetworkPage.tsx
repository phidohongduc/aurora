import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import { ArrowLeft, X } from 'lucide-react'
import { motion } from 'motion/react'
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  Controls,
  Background,
  BackgroundVariant,
  Position,
  Handle,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface EmployeeData extends Record<string, unknown> {
  id: string
  name: string
  role: string
  skills: Array<{ name: string; level: number }>
}

interface ProjectData extends Record<string, unknown> {
  id: string
  name: string
  lobId: string
}

interface LOBData extends Record<string, unknown> {
  id: string
  name: string
  color: string
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockLOBs: LOBData[] = [
  { id: 'lob-ans', name: 'ANS', color: '#3b82f6' },
  { id: 'lob-it', name: 'IT Group', color: '#f59e0b' },
  { id: 'lob-mss', name: 'MSS', color: '#10b981' },
]

const mockProjects: ProjectData[] = [
  // ANS Projects
  { id: 'proj-sds', name: 'SDS 2.0', lobId: 'lob-ans' },
  { id: 'proj-starview', name: 'Starview', lobId: 'lob-ans' },
  { id: 'proj-phoenix', name: 'Phoenix', lobId: 'lob-ans' },
  // IT Group Projects
  { id: 'proj-portal', name: 'Employee Portal', lobId: 'lob-it' },
  { id: 'proj-analytics', name: 'Analytics Hub', lobId: 'lob-it' },
  { id: 'proj-automation', name: 'Automation Suite', lobId: 'lob-it' },
  // MSS Projects
  { id: 'proj-sentinel', name: 'Sentinel', lobId: 'lob-mss' },
  { id: 'proj-guardian', name: 'Guardian', lobId: 'lob-mss' },
  { id: 'proj-shield', name: 'Shield', lobId: 'lob-mss' },
]

const mockEmployees: EmployeeData[] = [
  { 
    id: 'emp-1', 
    name: 'Sarah Johnson', 
    role: 'Senior Frontend Engineer',
    skills: [
      { name: 'React', level: 5 },
      { name: 'TypeScript', level: 5 },
      { name: 'Node.js', level: 3 },
    ]
  },
  { 
    id: 'emp-2', 
    name: 'Michael Chen', 
    role: 'Backend Engineer',
    skills: [
      { name: 'Python', level: 4 },
      { name: 'SQL', level: 5 },
      { name: 'GraphQL', level: 3 },
    ]
  },
  { 
    id: 'emp-3', 
    name: 'David Kim', 
    role: 'Cloud Architect',
    skills: [
      { name: 'AWS', level: 5 },
      { name: 'Docker', level: 5 },
      { name: 'Kubernetes', level: 4 },
    ]
  },
  { 
    id: 'emp-4', 
    name: 'Emily Rodriguez', 
    role: 'Full Stack Developer',
    skills: [
      { name: 'React', level: 4 },
      { name: 'Node.js', level: 4 },
      { name: 'SQL', level: 3 },
    ]
  },
  { 
    id: 'emp-5', 
    name: 'James Wilson', 
    role: 'DevOps Engineer',
    skills: [
      { name: 'Docker', level: 5 },
      { name: 'Kubernetes', level: 4 },
      { name: 'Python', level: 3 },
    ]
  },
  { 
    id: 'emp-6', 
    name: 'Jessica Brown', 
    role: 'Senior Backend Engineer',
    skills: [
      { name: 'Node.js', level: 5 },
      { name: 'GraphQL', level: 4 },
      { name: 'AWS', level: 3 },
    ]
  },
  { 
    id: 'emp-7', 
    name: 'Robert Taylor', 
    role: 'Frontend Developer',
    skills: [
      { name: 'React', level: 4 },
      { name: 'TypeScript', level: 4 },
      { name: 'Vue.js', level: 3 },
    ]
  },
  { 
    id: 'emp-8', 
    name: 'Linda Martinez', 
    role: 'Data Engineer',
    skills: [
      { name: 'Python', level: 5 },
      { name: 'SQL', level: 5 },
      { name: 'AWS', level: 4 },
    ]
  },
  { 
    id: 'emp-9', 
    name: 'Thomas Anderson', 
    role: 'Platform Engineer',
    skills: [
      { name: 'Kubernetes', level: 5 },
      { name: 'Docker', level: 4 },
      { name: 'Python', level: 4 },
    ]
  },
  { 
    id: 'emp-10', 
    name: 'Alex Thompson', 
    role: 'Security Engineer',
    skills: [
      { name: 'Python', level: 4 },
      { name: 'AWS', level: 4 },
      { name: 'Docker', level: 3 },
    ]
  },
  { 
    id: 'emp-11', 
    name: 'Maria Garcia', 
    role: 'UI/UX Developer',
    skills: [
      { name: 'React', level: 4 },
      { name: 'TypeScript', level: 3 },
      { name: 'Vue.js', level: 4 },
    ]
  },
  { 
    id: 'emp-12', 
    name: 'Kevin Lee', 
    role: 'System Architect',
    skills: [
      { name: 'AWS', level: 5 },
      { name: 'Kubernetes', level: 4 },
      { name: 'Node.js', level: 3 },
    ]
  },
]

// Project → Employee assignments
const projectEmployees = [
  // SDS 2.0
  { projectId: 'proj-sds', employeeId: 'emp-1' },
  { projectId: 'proj-sds', employeeId: 'emp-2' },
  { projectId: 'proj-sds', employeeId: 'emp-3' },
  // Starview
  { projectId: 'proj-starview', employeeId: 'emp-4' },
  { projectId: 'proj-starview', employeeId: 'emp-5' },
  // Phoenix
  { projectId: 'proj-phoenix', employeeId: 'emp-6' },
  { projectId: 'proj-phoenix', employeeId: 'emp-7' },
  // Employee Portal
  { projectId: 'proj-portal', employeeId: 'emp-1' },
  { projectId: 'proj-portal', employeeId: 'emp-8' },
  // Analytics Hub
  { projectId: 'proj-analytics', employeeId: 'emp-2' },
  { projectId: 'proj-analytics', employeeId: 'emp-9' },
  { projectId: 'proj-analytics', employeeId: 'emp-10' },
  // Automation Suite
  { projectId: 'proj-automation', employeeId: 'emp-11' },
  // Sentinel
  { projectId: 'proj-sentinel', employeeId: 'emp-3' },
  { projectId: 'proj-sentinel', employeeId: 'emp-12' },
  // Guardian
  { projectId: 'proj-guardian', employeeId: 'emp-5' },
  { projectId: 'proj-guardian', employeeId: 'emp-10' },
  // Shield
  { projectId: 'proj-shield', employeeId: 'emp-8' },
  { projectId: 'proj-shield', employeeId: 'emp-9' },
]

// ============================================================================
// CUSTOM NODE COMPONENTS
// ============================================================================

function LOBNode({ data }: { data: LOBData }) {
  return (
    <Box
      sx={{
        width: 220,
        p: 3,
        bgcolor: data.color + '15',
        border: `3px solid ${data.color}`,
        borderRadius: 4,
        textAlign: 'center',
      }}
    >
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      
      <Typography 
        variant="h6" 
        fontWeight="bold"
        sx={{ color: data.color }}
      >
        {data.name}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Line of Business
      </Typography>
    </Box>
  )
}

function ProjectNode({ data }: { data: ProjectData }) {
  return (
    <Box
      sx={{
        width: 180,
        p: 2,
        bgcolor: 'white',
        border: '2px solid #cbd5e1',
        borderRadius: 3,
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      
      <Typography variant="body1" fontWeight={600}>
        {data.name}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Project
      </Typography>
    </Box>
  )
}

function EmployeeNode({ data }: { data: EmployeeData }) {
  return (
    <Box
      sx={{
        width: 160,
        p: 2,
        background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        borderRadius: 3,
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      
      <Typography variant="body1" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
        {data.name}
      </Typography>
      <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
        {data.role}
      </Typography>
    </Box>
  )
}

const nodeTypes = {
  lob: LOBNode,
  project: ProjectNode,
  employee: EmployeeNode,
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EmployeeSkillNetworkPage() {
  const navigate = useNavigate()
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null)

  // Generate nodes with explicit positioning for LOB → Project → Employee hierarchy
  const getInitialNodes = (): Node[] => {
    const nodes: Node[] = []

    // 1. LOBs at the top in a row
    const lobY = 50
    const lobSpacing = 400
    mockLOBs.forEach((lob, index) => {
      nodes.push({
        id: lob.id,
        type: 'lob',
        position: { x: 100 + index * lobSpacing, y: lobY },
        data: lob,
      })
    })

    // 2. Projects in the middle, positioned under their LOBs
    const projectY = 220
    const projectSpacing = 130
    
    // ANS Projects
    const ansProjects = mockProjects.filter((p) => p.lobId === 'lob-ans')
    ansProjects.forEach((project, index) => {
      nodes.push({
        id: project.id,
        type: 'project',
        position: { 
          x: 50 + index * projectSpacing, 
          y: projectY 
        },
        data: project,
      })
    })

    // IT Group Projects
    const itProjects = mockProjects.filter((p) => p.lobId === 'lob-it')
    itProjects.forEach((project, index) => {
      nodes.push({
        id: project.id,
        type: 'project',
        position: { 
          x: 480 + index * projectSpacing, 
          y: projectY 
        },
        data: project,
      })
    })

    // MSS Projects
    const mssProjects = mockProjects.filter((p) => p.lobId === 'lob-mss')
    mssProjects.forEach((project, index) => {
      nodes.push({
        id: project.id,
        type: 'project',
        position: { 
          x: 880 + index * projectSpacing, 
          y: projectY 
        },
        data: project,
      })
    })

    // 3. Employees at the bottom, distributed based on project assignments
    const employeeStartY = 430
    const employeeSpacingY = 130
    
    // Position employees under their projects
    const positionedEmployees = new Set<string>()
    let currentX = 50
    
    mockProjects.forEach((project) => {
      const projectEmployeeIds = projectEmployees
        .filter((pe) => pe.projectId === project.id)
        .map((pe) => pe.employeeId)
      
      projectEmployeeIds.forEach((empId, empIndex) => {
        if (!positionedEmployees.has(empId)) {
          const employee = mockEmployees.find((e) => e.id === empId)
          if (employee) {
            nodes.push({
              id: employee.id,
              type: 'employee',
              position: { 
                x: currentX, 
                y: employeeStartY + (empIndex * employeeSpacingY) 
              },
              data: employee,
            })
            positionedEmployees.add(empId)
          }
        }
        currentX += 100
      })
    })

    return nodes
  }

  // Generate edges with curved lines
  const getInitialEdges = (): Edge[] => {
    const edges: Edge[] = []

    // LOB → Project edges (curved)
    mockProjects.forEach((project) => {
      const lob = mockLOBs.find((l) => l.id === project.lobId)
      edges.push({
        id: `${project.lobId}-${project.id}`,
        source: project.lobId,
        target: project.id,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: lob?.color || '#cbd5e1',
          strokeWidth: 2,
        },
      })
    })

    // Project → Employee edges (curved)
    projectEmployees.forEach((pe) => {
      const project = mockProjects.find((p) => p.id === pe.projectId)
      const lob = mockLOBs.find((l) => l.id === project?.lobId)
      
      edges.push({
        id: `${pe.projectId}-${pe.employeeId}`,
        source: pe.projectId,
        target: pe.employeeId,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: lob?.color ? lob.color + '80' : '#94a3b8',
          strokeWidth: 2,
        },
      })
    })

    return edges
  }

  const [nodes, setNodes] = useState<Node[]>(getInitialNodes())
  const [edges, setEdges] = useState<Edge[]>(getInitialEdges())

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === 'employee') {
        const employeeData = node.data as EmployeeData
        setSelectedEmployee(employeeData)
      }
    },
    []
  )

  // Calculate statistics
  const totalProjects = mockProjects.length
  const totalEmployees = mockEmployees.length

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/employees')} size="small">
            <ArrowLeft size={20} />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Project Organization Hierarchy
            </Typography>
            <Typography variant="body1" color="text.secondary">
              LOB → Projects → Employees across {totalProjects} active projects
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* Info Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#f8fafc' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Lines of Business
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {mockLOBs.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Active Projects
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {totalProjects}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Team Members
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {totalEmployees}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                💡 Click on an employee to view their skills
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {mockLOBs.map((lob) => (
                  <Chip
                    key={lob.id}
                    label={lob.name}
                    size="small"
                    sx={{ 
                      bgcolor: lob.color + '20',
                      color: lob.color,
                      fontWeight: 600
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
      </motion.div>

      {/* React Flow Graph */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper sx={{ height: 700, overflow: 'hidden' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.4}
            maxZoom={1.5}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
            <Controls />
          </ReactFlow>
        </Paper>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Legend
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            {mockLOBs.map((lob) => (
              <Box key={lob.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: lob.color, borderRadius: '4px' }} />
                <Typography variant="caption">{lob.name}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #e2e8f0' }}>
            <Typography variant="caption" color="text.secondary">
              💡 Click on an employee to view their skills and expertise
            </Typography>
          </Box>
        </Paper>
      </motion.div>

      {/* Employee Skills Modal */}
      <Dialog
        open={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedEmployee && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {selectedEmployee.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedEmployee.role}
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedEmployee(null)} size="small">
                <X size={20} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Skills & Expertise
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  {selectedEmployee.skills.map((skill, idx) => {
                    const getSkillColor = (level: number) => {
                      if (level >= 5) return { bg: '#dcfce7', color: '#16a34a', label: 'Expert' }
                      if (level >= 4) return { bg: '#dbeafe', color: '#2563eb', label: 'Advanced' }
                      if (level >= 3) return { bg: '#fef3c7', color: '#d97706', label: 'Intermediate' }
                      return { bg: '#f1f5f9', color: '#64748b', label: 'Junior' }
                    }
                    const skillStyle = getSkillColor(skill.level)
                    
                    return (
                      <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={500}>
                          {skill.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={`Level ${skill.level}`}
                            size="small"
                            sx={{
                              bgcolor: skillStyle.bg,
                              color: skillStyle.color,
                              fontWeight: 600,
                              fontSize: '0.75rem',
                            }}
                          />
                          <Chip
                            label={skillStyle.label}
                            size="small"
                            sx={{
                              bgcolor: skillStyle.bg,
                              color: skillStyle.color,
                              fontWeight: 500,
                              fontSize: '0.7rem',
                            }}
                          />
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  )
}
