import { useState, useCallback, useMemo } from 'react'
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
    LinearProgress,
} from '@mui/material'
import { ArrowLeft, X, User as UserIcon, Code, Database, Cloud, Shield, BarChart } from 'lucide-react'
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
    skills: string[]
    yearsOfExperience: number
}

interface SkillData extends Record<string, unknown> {
    id: string
    name: string
    category: string
    color: string
    employeeCount: number
}

// ============================================================================
// SKILL CATEGORIES
// ============================================================================

const skillCategories = {
    frontend: { name: 'Frontend', color: '#3b82f6', icon: Code },
    backend: { name: 'Backend', color: '#10b981', icon: Database },
    cloud: { name: 'Cloud & DevOps', color: '#f59e0b', icon: Cloud },
    data: { name: 'Data & AI', color: '#8b5cf6', icon: BarChart },
    security: { name: 'Security', color: '#ef4444', icon: Shield },
}

// Map skills to categories
const skillCategoryMap: Record<string, keyof typeof skillCategories> = {
    'React': 'frontend',
    'TypeScript': 'frontend',
    'JavaScript': 'frontend',
    'Vue.js': 'frontend',
    'CSS': 'frontend',
    'HTML': 'frontend',
    'Node.js': 'backend',
    'Python': 'backend',
    'Django': 'backend',
    'Express': 'backend',
    'GraphQL': 'backend',
    'SQL': 'backend',
    'PostgreSQL': 'backend',
    'MongoDB': 'backend',
    'Redis': 'backend',
    'Microservices': 'backend',
    'AWS': 'cloud',
    'Docker': 'cloud',
    'Kubernetes': 'cloud',
    'CI/CD': 'cloud',
    'Terraform': 'cloud',
    'Jenkins': 'cloud',
    'Monitoring': 'cloud',
    'TensorFlow': 'data',
    'PyTorch': 'data',
    'Machine Learning': 'data',
    'NLP': 'data',
    'Computer Vision': 'data',
    'Spark': 'data',
    'Airflow': 'data',
    'BigQuery': 'data',
    'ETL': 'data',
    'Data Modeling': 'data',
    'Redux': 'frontend',
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockEmployees: EmployeeData[] = [
    {
        id: 'emp-1',
        name: 'Sarah Johnson',
        role: 'Senior Frontend Developer',
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'Redux'],
        yearsOfExperience: 8,
    },
    {
        id: 'emp-2',
        name: 'Michael Chen',
        role: 'Backend Engineer',
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS', 'Redis', 'Microservices'],
        yearsOfExperience: 6,
    },
    {
        id: 'emp-3',
        name: 'Emily Rodriguez',
        role: 'Full Stack Developer',
        skills: ['Node.js', 'React', 'MongoDB', 'Express', 'TypeScript', 'GraphQL'],
        yearsOfExperience: 5,
    },
    {
        id: 'emp-4',
        name: 'David Kim',
        role: 'AI Engineer',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'NLP', 'Computer Vision'],
        yearsOfExperience: 7,
    },
    {
        id: 'emp-5',
        name: 'Jessica Brown',
        role: 'DevOps Engineer',
        skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Terraform', 'Jenkins', 'Monitoring'],
        yearsOfExperience: 6,
    },
    {
        id: 'emp-6',
        name: 'James Wilson',
        role: 'Data Engineer',
        skills: ['Python', 'SQL', 'Spark', 'Airflow', 'BigQuery', 'ETL', 'Data Modeling'],
        yearsOfExperience: 5,
    },
]

// ============================================================================
// CUSTOM NODE COMPONENTS
// ============================================================================

function SkillNode({ data }: { data: SkillData }) {
    return (
        <Box
            sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: data.color + '20',
                border: `3px solid ${data.color}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 20px ${data.color}40`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: `0 6px 24px ${data.color}60`,
                },
            }}
        >
            <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
            <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

            <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                    color: data.color,
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    px: 1,
                }}
            >
                {data.name}
            </Typography>
            <Typography
                variant="caption"
                sx={{
                    color: data.color,
                    opacity: 0.8,
                    fontSize: '0.65rem',
                }}
            >
                {data.employeeCount} users
            </Typography>
        </Box>
    )
}

function EmployeeNode({ data }: { data: EmployeeData }) {
    return (
        <Box
            sx={{
                width: 140,
                p: 1.5,
                background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                borderRadius: 3,
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                },
            }}
        >
            <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
            <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

            <Box
                sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1,
                }}
            >
                <UserIcon size={18} color="white" />
            </Box>
            <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.8rem' }} noWrap>
                {data.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85, fontSize: '0.65rem', display: 'block' }} noWrap>
                {data.role}
            </Typography>
        </Box>
    )
}

const nodeTypes = {
    skill: SkillNode,
    employee: EmployeeNode,
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EmployeeNetworkPage() {
    const navigate = useNavigate()
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null)
    const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null)

    // Calculate all unique skills with their categories and employee counts
    const { skills, skillEmployeeMap } = useMemo(() => {
        const skillMap = new Map<string, { skill: SkillData; employees: EmployeeData[] }>()

        mockEmployees.forEach(emp => {
            emp.skills.forEach(skillName => {
                const category = skillCategoryMap[skillName] || 'backend'
                const categoryInfo = skillCategories[category]

                if (!skillMap.has(skillName)) {
                    skillMap.set(skillName, {
                        skill: {
                            id: `skill-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                            name: skillName,
                            category: categoryInfo.name,
                            color: categoryInfo.color,
                            employeeCount: 0,
                        },
                        employees: [],
                    })
                }

                const entry = skillMap.get(skillName)!
                entry.employees.push(emp)
                entry.skill.employeeCount = entry.employees.length
            })
        })

        return {
            skills: Array.from(skillMap.values()).map(v => v.skill),
            skillEmployeeMap: skillMap,
        }
    }, [])

    // Generate nodes with circular layout for skills
    const getInitialNodes = useCallback((): Node[] => {
        const nodes: Node[] = []
        const centerX = 600
        const centerY = 400
        const skillRadius = 300
        const employeeRadius = 180

        // Position skills in a circle
        skills.forEach((skill, index) => {
            const angle = (index / skills.length) * 2 * Math.PI - Math.PI / 2
            const x = centerX + skillRadius * Math.cos(angle)
            const y = centerY + skillRadius * Math.sin(angle)

            nodes.push({
                id: skill.id,
                type: 'skill',
                position: { x, y },
                data: skill,
            })
        })

        // Position employees in the center area
        mockEmployees.forEach((emp, index) => {
            const angle = (index / mockEmployees.length) * 2 * Math.PI - Math.PI / 2
            const x = centerX + employeeRadius * Math.cos(angle) - 70
            const y = centerY + employeeRadius * Math.sin(angle) - 40

            nodes.push({
                id: emp.id,
                type: 'employee',
                position: { x, y },
                data: emp,
            })
        })

        return nodes
    }, [skills])

    // Generate edges connecting employees to their skills
    const getInitialEdges = useCallback((): Edge[] => {
        const edges: Edge[] = []

        mockEmployees.forEach(emp => {
            emp.skills.forEach(skillName => {
                const skillId = `skill-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
                const category = skillCategoryMap[skillName] || 'backend'
                const color = skillCategories[category].color

                edges.push({
                    id: `${emp.id}-${skillId}`,
                    source: emp.id,
                    target: skillId,
                    type: 'smoothstep',
                    animated: true,
                    style: {
                        stroke: color + '60',
                        strokeWidth: 2,
                    },
                })
            })
        })

        return edges
    }, [])

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
                setSelectedEmployee(node.data as EmployeeData)
                setSelectedSkill(null)
            } else if (node.type === 'skill') {
                setSelectedSkill(node.data as SkillData)
                setSelectedEmployee(null)
            }
        },
        []
    )

    // Get employees for a skill
    const getEmployeesForSkill = (skillName: string) => {
        return skillEmployeeMap.get(skillName)?.employees || []
    }

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
                            Employee-Skill Network
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Interactive graph showing connections between employees and their technical skills
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
                                    Unique Skills
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {skills.length}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Connections
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {edges.length}
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                💡 Click on nodes to view details
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {Object.entries(skillCategories).map(([key, { name, color }]) => (
                                    <Chip
                                        key={key}
                                        label={name}
                                        size="small"
                                        sx={{
                                            bgcolor: color + '20',
                                            color: color,
                                            fontWeight: 600,
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
                        fitViewOptions={{ padding: 0.3 }}
                        minZoom={0.3}
                        maxZoom={2}
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
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                                    borderRadius: '6px',
                                }}
                            />
                            <Typography variant="caption">Employee</Typography>
                        </Box>
                        {Object.entries(skillCategories).map(([key, { name, color }]) => (
                            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        bgcolor: color + '20',
                                        border: `2px solid ${color}`,
                                        borderRadius: '50%',
                                    }}
                                />
                                <Typography variant="caption">{name}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" color="text.secondary">
                            💡 Drag nodes to rearrange • Scroll to zoom • Click nodes to view details
                        </Typography>
                    </Box>
                </Paper>
            </motion.div>

            {/* Employee Detail Modal */}
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
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Experience
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {selectedEmployee.yearsOfExperience} years
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min((selectedEmployee.yearsOfExperience / 10) * 100, 100)}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: '#E2E8F0',
                                        '& .MuiLinearProgress-bar': {
                                            background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                                        },
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Technical Skills
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                    {selectedEmployee.skills.map((skill) => {
                                        const category = skillCategoryMap[skill] || 'backend'
                                        const color = skillCategories[category].color
                                        return (
                                            <Chip
                                                key={skill}
                                                label={skill}
                                                size="small"
                                                sx={{
                                                    bgcolor: color + '20',
                                                    color: color,
                                                    fontWeight: 500,
                                                }}
                                            />
                                        )
                                    })}
                                </Box>
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>

            {/* Skill Detail Modal */}
            <Dialog
                open={!!selectedSkill}
                onClose={() => setSelectedSkill(null)}
                maxWidth="sm"
                fullWidth
            >
                {selectedSkill && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        bgcolor: selectedSkill.color + '20',
                                        border: `2px solid ${selectedSkill.color}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Code size={20} color={selectedSkill.color} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold" sx={{ color: selectedSkill.color }}>
                                        {selectedSkill.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedSkill.category}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton onClick={() => setSelectedSkill(null)} size="small">
                                <X size={20} />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Box>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Employees with this skill ({selectedSkill.employeeCount})
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                                    {getEmployeesForSkill(selectedSkill.name).map((emp) => (
                                        <Paper
                                            key={emp.id}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                bgcolor: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <UserIcon size={18} color="white" />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {emp.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {emp.role} • {emp.yearsOfExperience} years exp
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    ))}
                                </Box>
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Container>
    )
}
