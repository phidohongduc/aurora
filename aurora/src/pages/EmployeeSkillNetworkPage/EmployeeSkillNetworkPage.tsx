import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import { ArrowLeft } from 'lucide-react'
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
}

interface SkillData extends Record<string, unknown> {
  name: string
  isHighlighted?: boolean
  deepestExpert?: string
}

interface SkillCluster extends Record<string, unknown> {
  id: string
  name: string
  color: string
}

interface EmployeeSkillEdgeData extends Record<string, unknown> {
  expertiseLevel: number
  confidenceScore: number
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockEmployees: EmployeeData[] = [
  { id: 'emp-1', name: 'Sarah Johnson', role: 'Senior Frontend Engineer' },
  { id: 'emp-2', name: 'Michael Chen', role: 'Backend Engineer' },
  { id: 'emp-3', name: 'David Kim', role: 'Cloud Architect' },
  { id: 'emp-4', name: 'Emily Rodriguez', role: 'Full Stack Developer' },
  { id: 'emp-5', name: 'James Wilson', role: 'DevOps Engineer' },
  { id: 'emp-6', name: 'Jessica Brown', role: 'Senior Backend Engineer' },
  { id: 'emp-7', name: 'Robert Taylor', role: 'Frontend Developer' },
  { id: 'emp-8', name: 'Linda Martinez', role: 'Data Engineer' },
  { id: 'emp-9', name: 'Thomas Anderson', role: 'Platform Engineer' },
]

const mockSkillClusters: SkillCluster[] = [
  { id: 'cluster-backend', name: 'Backend', color: '#3b82f6' },
  { id: 'cluster-frontend', name: 'Frontend', color: '#f59e0b' },
  { id: 'cluster-cloud', name: 'Cloud & Infrastructure', color: '#10b981' },
]

// Skills with their cluster assignment
const mockSkills = [
  // Backend
  { id: 'skill-python', name: 'Python', clusterId: 'cluster-backend' },
  { id: 'skill-nodejs', name: 'Node.js', clusterId: 'cluster-backend' },
  { id: 'skill-sql', name: 'SQL', clusterId: 'cluster-backend' },
  { id: 'skill-graphql', name: 'GraphQL', clusterId: 'cluster-backend' },
  // Frontend
  { id: 'skill-react', name: 'React', clusterId: 'cluster-frontend' },
  { id: 'skill-typescript', name: 'TypeScript', clusterId: 'cluster-frontend' },
  { id: 'skill-vue', name: 'Vue.js', clusterId: 'cluster-frontend' },
  // Cloud
  { id: 'skill-aws', name: 'AWS', clusterId: 'cluster-cloud' },
  { id: 'skill-docker', name: 'Docker', clusterId: 'cluster-cloud' },
  { id: 'skill-kubernetes', name: 'Kubernetes', clusterId: 'cluster-cloud' },
]

// Employee → Skill relationships with expertise levels
const employeeSkills = [
  // Sarah Johnson - Senior Frontend Engineer
  { employeeId: 'emp-1', skillId: 'skill-react', expertiseLevel: 5, confidenceScore: 0.98 },
  { employeeId: 'emp-1', skillId: 'skill-typescript', expertiseLevel: 5, confidenceScore: 0.96 },
  { employeeId: 'emp-1', skillId: 'skill-aws', expertiseLevel: 3, confidenceScore: 0.85 },
  
  // Michael Chen - Backend Engineer
  { employeeId: 'emp-2', skillId: 'skill-nodejs', expertiseLevel: 5, confidenceScore: 0.95 },
  { employeeId: 'emp-2', skillId: 'skill-sql', expertiseLevel: 4, confidenceScore: 0.92 },
  { employeeId: 'emp-2', skillId: 'skill-graphql', expertiseLevel: 4, confidenceScore: 0.90 },
  { employeeId: 'emp-2', skillId: 'skill-aws', expertiseLevel: 4, confidenceScore: 0.88 },
  
  // David Kim - Cloud Architect (AWS deep expert)
  { employeeId: 'emp-3', skillId: 'skill-aws', expertiseLevel: 5, confidenceScore: 0.99 },
  { employeeId: 'emp-3', skillId: 'skill-docker', expertiseLevel: 5, confidenceScore: 0.97 },
  { employeeId: 'emp-3', skillId: 'skill-kubernetes', expertiseLevel: 5, confidenceScore: 0.96 },
  { employeeId: 'emp-3', skillId: 'skill-python', expertiseLevel: 4, confidenceScore: 0.91 },
  
  // Emily Rodriguez - Full Stack Developer
  { employeeId: 'emp-4', skillId: 'skill-react', expertiseLevel: 4, confidenceScore: 0.93 },
  { employeeId: 'emp-4', skillId: 'skill-nodejs', expertiseLevel: 4, confidenceScore: 0.91 },
  { employeeId: 'emp-4', skillId: 'skill-typescript', expertiseLevel: 4, confidenceScore: 0.94 },
  { employeeId: 'emp-4', skillId: 'skill-sql', expertiseLevel: 3, confidenceScore: 0.87 },
  
  // James Wilson - DevOps Engineer
  { employeeId: 'emp-5', skillId: 'skill-docker', expertiseLevel: 5, confidenceScore: 0.95 },
  { employeeId: 'emp-5', skillId: 'skill-kubernetes', expertiseLevel: 4, confidenceScore: 0.93 },
  { employeeId: 'emp-5', skillId: 'skill-aws', expertiseLevel: 4, confidenceScore: 0.90 },
  { employeeId: 'emp-5', skillId: 'skill-python', expertiseLevel: 3, confidenceScore: 0.86 },
  
  // Jessica Brown - Senior Backend Engineer
  { employeeId: 'emp-6', skillId: 'skill-python', expertiseLevel: 5, confidenceScore: 0.97 },
  { employeeId: 'emp-6', skillId: 'skill-sql', expertiseLevel: 5, confidenceScore: 0.95 },
  { employeeId: 'emp-6', skillId: 'skill-nodejs', expertiseLevel: 3, confidenceScore: 0.84 },
  
  // Robert Taylor - Frontend Developer
  { employeeId: 'emp-7', skillId: 'skill-react', expertiseLevel: 4, confidenceScore: 0.90 },
  { employeeId: 'emp-7', skillId: 'skill-vue', expertiseLevel: 5, confidenceScore: 0.94 },
  { employeeId: 'emp-7', skillId: 'skill-typescript', expertiseLevel: 3, confidenceScore: 0.88 },
  
  // Linda Martinez - Data Engineer (only GraphQL expert - RISK)
  { employeeId: 'emp-8', skillId: 'skill-python', expertiseLevel: 5, confidenceScore: 0.96 },
  { employeeId: 'emp-8', skillId: 'skill-sql', expertiseLevel: 5, confidenceScore: 0.98 },
  { employeeId: 'emp-8', skillId: 'skill-graphql', expertiseLevel: 5, confidenceScore: 0.97 },
  
  // Thomas Anderson - Platform Engineer
  { employeeId: 'emp-9', skillId: 'skill-kubernetes', expertiseLevel: 4, confidenceScore: 0.91 },
  { employeeId: 'emp-9', skillId: 'skill-docker', expertiseLevel: 4, confidenceScore: 0.89 },
  { employeeId: 'emp-9', skillId: 'skill-nodejs', expertiseLevel: 3, confidenceScore: 0.85 },
]

// Calculate deepest expert per skill
const getDeepestExpert = (skillId: string) => {
  const experts = employeeSkills
    .filter((es) => es.skillId === skillId)
    .sort((a, b) => b.expertiseLevel - a.expertiseLevel || b.confidenceScore - a.confidenceScore)
  
  if (experts.length === 0) return undefined
  
  const topExpert = experts[0]
  const employee = mockEmployees.find((e) => e.id === topExpert.employeeId)
  return employee?.name
}

// ============================================================================
// CUSTOM NODE COMPONENTS
// ============================================================================

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

function SkillNode({ data }: { data: SkillData }) {
  const employeeCount = employeeSkills.filter((es) => es.skillId === `skill-${data.name.toLowerCase().replace(/\./g, '')}`).length
  const isRisk = employeeCount === 1
  
  return (
    <Tooltip
      title={
        <Box sx={{ p: 1 }}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            {data.name}
          </Typography>
          <Typography variant="caption" display="block">
            Employees with this skill: {employeeCount}
          </Typography>
          {data.deepestExpert && (
            <Typography variant="caption" display="block" sx={{ mt: 1, color: '#fbbf24' }}>
              💡 Suggested mentor: {data.deepestExpert}
            </Typography>
          )}
          {isRisk && (
            <Typography variant="caption" display="block" sx={{ mt: 1, color: '#ef4444' }}>
              ⚠️ Single point of failure risk
            </Typography>
          )}
        </Box>
      }
      arrow
      placement="top"
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          bgcolor: data.isHighlighted ? '#fef3c7' : isRisk ? '#fee2e2' : 'white',
          border: `2px solid ${data.isHighlighted ? '#f59e0b' : isRisk ? '#ef4444' : '#e2e8f0'}`,
          borderRadius: 3,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
        
        <Typography 
          variant="body2" 
          fontWeight={600}
          sx={{ color: data.isHighlighted ? '#d97706' : isRisk ? '#dc2626' : '#1e293b' }}
        >
          {data.name}
        </Typography>
      </Box>
    </Tooltip>
  )
}

function SkillClusterNode({ data }: { data: SkillCluster }) {
  return (
    <Box
      sx={{
        width: 200,
        p: 2,
        bgcolor: data.color + '15',
        border: `2px solid ${data.color}`,
        borderRadius: 3,
        textAlign: 'center',
      }}
    >
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      
      <Typography 
        variant="body1" 
        fontWeight="bold"
        sx={{ color: data.color }}
      >
        {data.name}
      </Typography>
    </Box>
  )
}

const nodeTypes = {
  employee: EmployeeNode,
  skill: SkillNode,
  cluster: SkillClusterNode,
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EmployeeSkillNetworkPage() {
  const navigate = useNavigate()
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

  // Generate nodes with explicit positioning
  const getInitialNodes = (): Node[] => {
    const nodes: Node[] = []

    // 1. Skill Clusters at the top in a row
    const clusterY = 50
    const clusterSpacing = 350
    mockSkillClusters.forEach((cluster, index) => {
      nodes.push({
        id: cluster.id,
        type: 'cluster',
        position: { x: 100 + index * clusterSpacing, y: clusterY },
        data: cluster,
      })
    })

    // 2. Skills positioned under their clusters
    const skillY = 180
    const skillSpacing = 120
    
    // Backend skills
    const backendSkills = mockSkills.filter((s) => s.clusterId === 'cluster-backend')
    backendSkills.forEach((skill, index) => {
      nodes.push({
        id: skill.id,
        type: 'skill',
        position: { 
          x: 50 + index * skillSpacing, 
          y: skillY 
        },
        data: {
          name: skill.name,
          isHighlighted: selectedSkill === skill.name,
          deepestExpert: getDeepestExpert(skill.id),
        },
      })
    })

    // Frontend skills
    const frontendSkills = mockSkills.filter((s) => s.clusterId === 'cluster-frontend')
    frontendSkills.forEach((skill, index) => {
      nodes.push({
        id: skill.id,
        type: 'skill',
        position: { 
          x: 450 + index * skillSpacing, 
          y: skillY 
        },
        data: {
          name: skill.name,
          isHighlighted: selectedSkill === skill.name,
          deepestExpert: getDeepestExpert(skill.id),
        },
      })
    })

    // Cloud skills
    const cloudSkills = mockSkills.filter((s) => s.clusterId === 'cluster-cloud')
    cloudSkills.forEach((skill, index) => {
      nodes.push({
        id: skill.id,
        type: 'skill',
        position: { 
          x: 800 + index * skillSpacing, 
          y: skillY 
        },
        data: {
          name: skill.name,
          isHighlighted: selectedSkill === skill.name,
          deepestExpert: getDeepestExpert(skill.id),
        },
      })
    })

    // 3. Employees at the bottom in a grid (3 rows x 3 cols)
    const employeeStartY = 400
    const employeeSpacingX = 200
    const employeeSpacingY = 120
    mockEmployees.forEach((employee, index) => {
      const row = Math.floor(index / 3)
      const col = index % 3
      nodes.push({
        id: employee.id,
        type: 'employee',
        position: { 
          x: 100 + col * employeeSpacingX * 2, 
          y: employeeStartY + row * employeeSpacingY 
        },
        data: employee,
      })
    })

    return nodes
  }

  // Generate edges
  const getInitialEdges = (): Edge[] => {
    const edges: Edge[] = []

    // Skill → Cluster edges (light, neutral)
    mockSkills.forEach((skill) => {
      edges.push({
        id: `${skill.id}-${skill.clusterId}`,
        source: skill.clusterId,
        target: skill.id,
        type: 'straight',
        style: {
          stroke: '#cbd5e1',
          strokeWidth: 1,
        },
      })
    })

    // Employee → Skill edges (colored by expertise)
    employeeSkills.forEach((es) => {
      const getEdgeColor = (level: number) => {
        if (level >= 5) return '#22c55e' // Expert - Green
        if (level >= 4) return '#84cc16' // Advanced - Light green
        if (level >= 3) return '#f59e0b' // Intermediate - Orange
        return '#94a3b8' // Junior - Gray
      }

      const isHighlighted = selectedSkill === mockSkills.find((s) => s.id === es.skillId)?.name

      edges.push({
        id: `${es.employeeId}-${es.skillId}`,
        source: es.skillId,
        target: es.employeeId,
        type: 'straight',
        animated: isHighlighted,
        style: {
          stroke: getEdgeColor(es.expertiseLevel),
          strokeWidth: isHighlighted ? 3 : Math.max(1, es.expertiseLevel / 2),
        },
        label: isHighlighted ? `Level ${es.expertiseLevel}` : undefined,
        labelStyle: { fill: '#1e293b', fontWeight: 600, fontSize: 11 },
        data: {
          expertiseLevel: es.expertiseLevel,
          confidenceScore: es.confidenceScore,
        } as EmployeeSkillEdgeData,
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
      if (node.type === 'skill') {
        const skillData = node.data as SkillData
        const newSelectedSkill = selectedSkill === skillData.name ? null : skillData.name
        setSelectedSkill(newSelectedSkill)
        
        // Update nodes and edges
        setNodes(getInitialNodes())
        setEdges(getInitialEdges())
      }
    },
    [selectedSkill]
  )

  // Get employees connected to selected skill
  const connectedEmployees = selectedSkill
    ? employeeSkills
        .filter((es) => mockSkills.find((s) => s.id === es.skillId)?.name === selectedSkill)
        .map((es) => {
          const emp = mockEmployees.find((e) => e.id === es.employeeId)
          return { ...emp!, expertiseLevel: es.expertiseLevel }
        })
        .sort((a, b) => b.expertiseLevel - a.expertiseLevel)
    : []

  // Calculate statistics
  const awsExperts = employeeSkills.filter((es) => es.skillId === 'skill-aws')
  const deepAWSExpert = awsExperts.sort((a, b) => b.expertiseLevel - a.expertiseLevel)[0]
  const riskSkills = mockSkills.filter((skill) => 
    employeeSkills.filter((es) => es.skillId === skill.id).length === 1
  )

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
              Team Skill Network
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Capability distribution and skill relationships across {mockEmployees.length} employees
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
                  Total Employees
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {mockEmployees.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total Skills
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {mockSkills.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  AWS Experts
                </Typography>
                <Typography variant="body1" fontWeight={600} color="success.main">
                  {awsExperts.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Risk Skills
                </Typography>
                <Typography variant="body1" fontWeight={600} color="error.main">
                  {riskSkills.length}
                </Typography>
              </Box>
            </Box>
            {deepAWSExpert && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Deep AWS Expert
                </Typography>
                <Chip 
                  label={mockEmployees.find((e) => e.id === deepAWSExpert.employeeId)?.name}
                  size="small"
                  sx={{ bgcolor: 'success.50', color: 'success.main', fontWeight: 600 }}
                />
              </Box>
            )}
          </Box>
          {selectedSkill && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e2e8f0' }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Selected: <strong>{selectedSkill}</strong>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {connectedEmployees.map((emp) => (
                  <Chip
                    key={emp.id}
                    label={`${emp.name} (L${emp.expertiseLevel})`}
                    size="small"
                    sx={{ 
                      bgcolor: emp.expertiseLevel >= 5 ? 'success.50' : 'primary.50',
                      color: emp.expertiseLevel >= 5 ? 'success.main' : 'primary.main',
                      fontWeight: 500
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: '#22c55e', borderRadius: '50%' }} />
              <Typography variant="caption">Expert (Level 5)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: '#84cc16', borderRadius: '50%' }} />
              <Typography variant="caption">Advanced (Level 4)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: '#f59e0b', borderRadius: '50%' }} />
              <Typography variant="caption">Intermediate (Level 3)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: '#94a3b8', borderRadius: '50%' }} />
              <Typography variant="caption">Junior (Level 1-2)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 16, height: 16, bgcolor: '#fee2e2', border: '2px solid #ef4444', borderRadius: 1 }} />
              <Typography variant="caption" color="error.main">⚠️ Risk: Single Owner</Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #e2e8f0' }}>
            <Typography variant="caption" color="text.secondary">
              💡 Click on a skill to highlight all employees with that skill • Hover over skills for AI insights
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  )
}
