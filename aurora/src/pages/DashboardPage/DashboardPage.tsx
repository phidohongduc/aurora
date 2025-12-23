import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Avatar,
    LinearProgress,
    Chip,
} from '@mui/material'
import { motion } from 'motion/react'
import {
    Users,
    UserCheck,
    UserPlus,
    UserX,
    Briefcase,
    Clock,
    Calendar,
    Award,
    Target,
    Building2,
    GraduationCap,
    Code,
} from 'lucide-react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area,
} from 'recharts'

// Mock HR Dashboard Data - Technical/Engineering focused
const hrStats = {
    totalEmployees: 142,
    activeEmployees: 138,
    newHires: 14,
    attrition: 3,
    openPositions: 12,
    avgTenure: 3.2,
    trainingCompletion: 91,
    performanceScore: 4.4,
}

// Technical-focused department data
const departmentData = [
    { name: 'Frontend', count: 28, color: '#6366f1' },
    { name: 'Backend', count: 32, color: '#8b5cf6' },
    { name: 'DevOps/SRE', count: 18, color: '#ec4899' },
    { name: 'Data/ML', count: 22, color: '#f59e0b' },
    { name: 'Mobile', count: 16, color: '#22c55e' },
    { name: 'QA/Testing', count: 14, color: '#06b6d4' },
    { name: 'Security', count: 8, color: '#ef4444' },
    { name: 'Product/Design', count: 4, color: '#64748b' },
]

// Hiring trend data for line chart
const hiringTrendData = [
    { month: 'Jul', hires: 4, attrition: 1 },
    { month: 'Aug', hires: 6, attrition: 2 },
    { month: 'Sep', hires: 8, attrition: 1 },
    { month: 'Oct', hires: 5, attrition: 2 },
    { month: 'Nov', hires: 7, attrition: 1 },
    { month: 'Dec', hires: 14, attrition: 3 },
]

// Tech stack distribution for pie chart
const techStackData = [
    { name: 'React/TypeScript', value: 35, color: '#61DAFB' },
    { name: 'Python', value: 28, color: '#3776AB' },
    { name: 'Go', value: 18, color: '#00ADD8' },
    { name: 'Kubernetes', value: 12, color: '#326CE5' },
    { name: 'Rust', value: 7, color: '#DEA584' },
]

// Technical hires
const recentHires = [
    { name: 'Alex Chen', role: 'Senior Backend Engineer', department: 'Backend', date: '2025-12-20', avatar: 'AC', tech: 'Go, PostgreSQL' },
    { name: 'Sarah Kim', role: 'ML Engineer', department: 'Data/ML', date: '2025-12-18', avatar: 'SK', tech: 'Python, PyTorch' },
    { name: 'Jordan Lee', role: 'DevOps Engineer', department: 'DevOps/SRE', date: '2025-12-15', avatar: 'JL', tech: 'Kubernetes, Terraform' },
    { name: 'Maya Patel', role: 'Frontend Developer', department: 'Frontend', date: '2025-12-12', avatar: 'MP', tech: 'React, TypeScript' },
]

const upcomingReviews = [
    { name: 'Liam Zhang', date: '2025-12-28', type: 'Annual', role: 'Staff Engineer' },
    { name: 'Emma Wilson', date: '2025-12-30', type: 'Quarterly', role: 'Tech Lead' },
    { name: 'Noah Garcia', date: '2026-01-02', type: 'Probation', role: 'Junior Developer' },
]

// Technical certifications progress
const trainingProgress = [
    { name: 'AWS Solutions Architect', progress: 92, total: 48, completed: 44 },
    { name: 'Kubernetes (CKA/CKAD)', progress: 78, total: 32, completed: 25 },
    { name: 'Security Compliance', progress: 95, total: 142, completed: 135 },
    { name: 'System Design', progress: 65, total: 86, completed: 56 },
]

// Engineering velocity data
const velocityData = [
    { week: 'W1', velocity: 78, bugs: 12 },
    { week: 'W2', velocity: 82, bugs: 8 },
    { week: 'W3', velocity: 75, bugs: 15 },
    { week: 'W4', velocity: 88, bugs: 6 },
    { week: 'W5', velocity: 92, bugs: 5 },
    { week: 'W6', velocity: 95, bugs: 4 },
]

const StatCard = ({
    icon: Icon,
    label,
    value,
    change,
    color,
}: {
    icon: React.ComponentType<{ size?: number; color?: string }>
    label: string
    value: string | number
    change?: string
    color: string
}) => (
    <Paper variant="outlined" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Icon size={24} color={color} />
            </Box>
            {change && (
                <Chip
                    label={change}
                    size="small"
                    sx={{
                        bgcolor: change.startsWith('+') ? '#dcfce7' : '#fee2e2',
                        color: change.startsWith('+') ? '#16a34a' : '#dc2626',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                    }}
                />
            )}
        </Box>
        <Typography variant="h4" fontWeight={700} sx={{ mt: 2, mb: 0.5 }}>
            {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {label}
        </Typography>
    </Paper>
)

export default function DashboardPage() {
    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                        Engineering HR Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Real-time overview of technical workforce metrics and insights
                    </Typography>
                </Box>
            </motion.div>

            {/* Bento Layout using Grid */}
            <Grid container spacing={3}>
                {/* Row 1: Main Stats - 4 columns */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        style={{ height: '100%' }}
                    >
                        <StatCard
                            icon={Code}
                            label="Total Engineers"
                            value={hrStats.totalEmployees}
                            change="+12%"
                            color="#6366f1"
                        />
                    </motion.div>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                        style={{ height: '100%' }}
                    >
                        <StatCard
                            icon={UserPlus}
                            label="New Hires (This Month)"
                            value={hrStats.newHires}
                            change="+6"
                            color="#22c55e"
                        />
                    </motion.div>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        style={{ height: '100%' }}
                    >
                        <StatCard
                            icon={Briefcase}
                            label="Open Positions"
                            value={hrStats.openPositions}
                            color="#f59e0b"
                        />
                    </motion.div>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.25 }}
                        style={{ height: '100%' }}
                    >
                        <StatCard
                            icon={UserX}
                            label="Attrition Rate"
                            value={`${((hrStats.attrition / hrStats.totalEmployees) * 100).toFixed(1)}%`}
                            change="-0.8%"
                            color="#ef4444"
                        />
                    </motion.div>
                </Grid>

                {/* Row 2: Hiring Trend Chart + Tech Stack Pie Chart */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        style={{ height: '100%' }}
                    >
                        <Paper variant="outlined" sx={{ p: 3, height: '100%', minHeight: 350 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <Users size={20} color="#6366f1" />
                                <Typography variant="h6" fontWeight={600}>
                                    Hiring Trend (Last 6 Months)
                                </Typography>
                            </Box>
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={hiringTrendData}>
                                    <defs>
                                        <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAttrition" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                                    <YAxis stroke="#94a3b8" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 8
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="hires"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorHires)"
                                        name="New Hires"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="attrition"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorAttrition)"
                                        name="Attrition"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </motion.div>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.35 }}
                        style={{ height: '100%' }}
                    >
                        <Paper variant="outlined" sx={{ p: 3, height: '100%', minHeight: 350 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <Code size={20} color="#8b5cf6" />
                                <Typography variant="h6" fontWeight={600}>
                                    Tech Stack Distribution
                                </Typography>
                            </Box>
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={techStackData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {techStackData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => [`${value}%`, 'Usage']}
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 8
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        formatter={(value) => <span style={{ color: '#64748b', fontSize: 12 }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Row 3: Team Distribution + Engineering Velocity */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        style={{ height: '100%' }}
                    >
                        <Paper variant="outlined" sx={{ p: 3, height: '100%', minHeight: 320 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <Building2 size={20} color="#6366f1" />
                                <Typography variant="h6" fontWeight={600}>
                                    Team Distribution
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                {departmentData.map((dept) => (
                                    <Grid key={dept.name} size={{ xs: 6 }}>
                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {dept.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {dept.count}
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(dept.count / hrStats.totalEmployees) * 100}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: '#e2e8f0',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: dept.color,
                                                        borderRadius: 4,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </motion.div>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.45 }}
                        style={{ height: '100%' }}
                    >
                        <Paper variant="outlined" sx={{ p: 3, height: '100%', minHeight: 320 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <Target size={20} color="#22c55e" />
                                <Typography variant="h6" fontWeight={600}>
                                    Engineering Velocity
                                </Typography>
                            </Box>
                            <ResponsiveContainer width="100%" height={240}>
                                <LineChart data={velocityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
                                    <YAxis stroke="#94a3b8" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 8
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="velocity"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                                        name="Velocity Score"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="bugs"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                                        name="Bug Count"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Row 4: Recent Hires + Certifications */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        style={{ height: '100%' }}
                    >
                        <Paper variant="outlined" sx={{ p: 3, height: '100%', minHeight: 320 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <UserCheck size={20} color="#22c55e" />
                                <Typography variant="h6" fontWeight={600}>
                                    Recent Technical Hires
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {recentHires.map((hire, index) => (
                                    <Box
                                        key={hire.name}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: '#f8fafc',
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: '#f1f5f9' },
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                bgcolor: ['#6366f1', '#8b5cf6', '#ec4899', '#22c55e'][index % 4],
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {hire.avatar}
                                        </Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="body1" fontWeight={600} noWrap>
                                                {hire.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {hire.role}
                                            </Typography>
                                            <Typography variant="caption" color="primary.main">
                                                {hire.tech}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={new Date(hire.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                            size="small"
                                            sx={{ bgcolor: '#e0f2fe', color: '#0369a1' }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.55 }}
                        style={{ height: '100%' }}
                    >
                        <Paper variant="outlined" sx={{ p: 3, height: '100%', minHeight: 320 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <GraduationCap size={20} color="#8b5cf6" />
                                <Typography variant="h6" fontWeight={600}>
                                    Technical Certifications
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {trainingProgress.map((training) => (
                                    <Box key={training.name}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" fontWeight={500}>
                                                {training.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {training.completed}/{training.total} ({training.progress}%)
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={training.progress}
                                            sx={{
                                                height: 10,
                                                borderRadius: 5,
                                                bgcolor: '#e2e8f0',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: training.progress > 80 ? '#22c55e' : training.progress > 60 ? '#f59e0b' : '#ef4444',
                                                    borderRadius: 5,
                                                },
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Row 5: Upcoming Reviews + Performance Score + Average Tenure */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                        style={{ height: '100%' }}
                    >
                        <Paper variant="outlined" sx={{ p: 3, height: '100%', minHeight: 280 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <Calendar size={20} color="#f59e0b" />
                                <Typography variant="h6" fontWeight={600}>
                                    Upcoming Reviews
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {upcomingReviews.map((review) => (
                                    <Box
                                        key={review.name}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: '#fffbeb',
                                            border: '1px solid #fef3c7',
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {review.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {review.role} • {new Date(review.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={review.type}
                                            size="small"
                                            sx={{
                                                bgcolor: '#fef3c7',
                                                color: '#b45309',
                                                fontWeight: 500,
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.65 }}
                        style={{ height: '100%' }}
                    >
                        <Paper variant="outlined" sx={{ p: 3, height: '100%', minHeight: 280 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <Award size={20} color="#6366f1" />
                                <Typography variant="h6" fontWeight={600}>
                                    Performance Score
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Box
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            bgcolor: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography variant="h3" fontWeight={700} color="primary.main">
                                            {hrStats.performanceScore}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Average Rating (out of 5)
                                </Typography>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 }}
                        style={{ height: '100%' }}
                    >
                        <Paper variant="outlined" sx={{ p: 3, height: '100%', minHeight: 280 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <Clock size={20} color="#22c55e" />
                                <Typography variant="h6" fontWeight={600}>
                                    Average Tenure
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="h2" fontWeight={700} color="primary.main">
                                    {hrStats.avgTenure}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                    Years
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" fontWeight={600}>
                                        38%
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        1+ Years
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" fontWeight={600}>
                                        32%
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        3+ Years
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" fontWeight={600}>
                                        18%
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        5+ Years
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </Container>
    )
}
