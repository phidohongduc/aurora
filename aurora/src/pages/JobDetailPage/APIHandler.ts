import type { ApiResponse, JobRequisition, CV, ParsedCVData } from '@/types'

// Mock parsed CV data
const mockParsedCVs: Record<string, ParsedCVData> = {
  'cv1': {
    name: 'John Doe',
    currentRole: 'Senior Backend Engineer',
    currentCompany: 'TechCorp',
    location: 'San Francisco, CA',
    totalExperience: '6 years',
    yearsOfExperience: 6,
    relevantYearsOfExperience: 5,
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker', 'Redis'],
    education: 'B.S. Computer Science - MIT',
    previousCompanies: ['TechCorp', 'StartupXYZ', 'Innovation Labs'],
    aiMatchScore: 92,
    strengths: [
      'Strong expertise in Python and Django with 5+ years of production experience',
      'Extensive AWS cloud architecture experience including Lambda, ECS, and RDS',
      'Led team of 4 engineers in building scalable microservices',
      'Active contributor to open-source Django projects'
    ],
    weaknesses: [
      'Limited Kubernetes experience (mentioned briefly but not extensively)',
      'GraphQL experience not mentioned in CV',
      'No mention of Redis caching implementation'
    ],
    cloudExperience: ['AWS', 'Azure'],
    systemDesignExperience: 'Designed and implemented microservices architecture for 10M+ users',
    leadershipExperience: 'Led team of 4 engineers, mentored 2 junior developers',
    industryBackground: ['FinTech', 'SaaS', 'E-commerce'],
    employmentStability: 'Strong - Average tenure of 3 years per company',
    matchedSkills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
    missingSkills: ['Kubernetes', 'GraphQL'],
    topSkills: ['Python', 'Django', 'AWS'],
    fitLevel: 'Strong',
    pipelineStep: 'interviewing',
    interviewQuestions: [
      {
        id: 'q1',
        question: 'Can you describe your experience with building scalable microservices architectures using Python and Django?',
        category: 'technical',
        expectedAnswer: 'A strong candidate should discuss their experience with service decomposition, API design, message queues, and how they\'ve handled challenges like data consistency, service discovery, and deployment strategies. They should mention specific technologies like Docker, Kubernetes, and potentially service mesh solutions.',
        keyPoints: [
          'Experience with service decomposition and bounded contexts',
          'Understanding of distributed systems challenges',
          'Knowledge of containerization and orchestration',
          'API design patterns (REST, GraphQL, gRPC)',
          'Handling inter-service communication',
        ],
        status: 'pending',
      },
      {
        id: 'q2',
        question: 'How do you approach database optimization for high-traffic applications? Can you share a specific example where you improved query performance?',
        category: 'technical',
        expectedAnswer: 'Look for answers covering indexing strategies, query optimization, connection pooling, read replicas, caching layers (Redis/Memcached), and database sharding. They should provide a concrete example with before/after metrics showing performance improvements.',
        keyPoints: [
          'Understanding of indexing and query optimization',
          'Experience with caching strategies',
          'Knowledge of connection pooling',
          'Monitoring and profiling database performance',
          'Ability to explain trade-offs',
        ],
        status: 'pending',
      },
      {
        id: 'q3',
        question: 'Tell me about a time when you had to make a difficult technical decision that had significant impact on the project. What was your decision-making process?',
        category: 'behavioral',
        expectedAnswer: 'Strong candidates will demonstrate structured decision-making: gathering requirements, evaluating alternatives, considering trade-offs, consulting stakeholders, documenting decisions, and reflecting on outcomes. They should show ownership and learning from the experience.',
        keyPoints: [
          'Clear problem definition',
          'Systematic evaluation of alternatives',
          'Stakeholder communication',
          'Consideration of long-term impact',
          'Willingness to learn from outcomes',
        ],
        status: 'pending',
      },
      {
        id: 'q4',
        question: 'Describe your experience working with AWS services. Which services have you worked with most extensively and why?',
        category: 'experience',
        expectedAnswer: 'Candidates should detail their hands-on experience with specific AWS services relevant to backend engineering (EC2, ECS/EKS, RDS, Lambda, S3, CloudWatch, etc.). They should explain use cases, architecture decisions, and lessons learned from production deployments.',
        keyPoints: [
          'Hands-on experience with core AWS services',
          'Understanding of AWS best practices',
          'Cost optimization awareness',
          'Security and compliance considerations',
          'Infrastructure as Code experience (CloudFormation/Terraform)',
        ],
        status: 'pending',
      },
    ]
  },
  'cv2': {
    name: 'Jane Smith',
    currentRole: 'Senior Software Engineer',
    currentCompany: 'CloudScale',
    location: 'Seattle, WA',
    totalExperience: '8 years',
    yearsOfExperience: 8,
    relevantYearsOfExperience: 7,
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'AWS', 'Kubernetes', 'Redis'],
    education: 'M.S. Computer Science - Stanford',
    previousCompanies: ['CloudScale', 'BigTech Inc', 'DevOps Solutions'],
    aiMatchScore: 88,
    strengths: [
      'Extensive experience with modern Python frameworks including FastAPI',
      'Deep Kubernetes knowledge with production deployments',
      'Strong database optimization skills',
      'Experience with high-traffic systems (50M+ requests/day)'
    ],
    weaknesses: [
      'Django experience is limited compared to FastAPI',
      'GraphQL mentioned but no production experience listed'
    ],
    cloudExperience: ['AWS', 'GCP'],
    systemDesignExperience: 'Architected distributed systems handling 50M+ daily requests',
    leadershipExperience: 'Tech lead for 6-person team, established engineering best practices',
    industryBackground: ['Cloud Services', 'E-commerce', 'Media Streaming'],
    employmentStability: 'Excellent - 4+ years average tenure, steady career progression',
    matchedSkills: ['Python', 'PostgreSQL', 'AWS', 'Kubernetes', 'Redis'],
    missingSkills: ['Django'],
    topSkills: ['Python', 'Kubernetes', 'AWS'],
    fitLevel: 'Strong',
    pipelineStep: 'offer'
  },
  'cv3': {
    name: 'Bob Wilson',
    currentRole: 'Full Stack Developer',
    currentCompany: 'WebDev Co',
    location: 'Austin, TX',
    totalExperience: '5 years',
    yearsOfExperience: 5,
    relevantYearsOfExperience: 4,
    skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker'],
    education: 'B.S. Software Engineering - UCLA',
    previousCompanies: ['WebDev Co', 'Digital Agency'],
    aiMatchScore: 75,
    strengths: [
      'Solid Django and Python foundation',
      'Full-stack capabilities with React frontend experience',
      'Good understanding of containerization with Docker'
    ],
    weaknesses: [
      'Limited AWS cloud experience (basic EC2 and S3 only)',
      'No Kubernetes experience',
      'Missing several nice-to-have skills (Redis, GraphQL)',
      'Limited experience with large-scale systems'
    ],
    cloudExperience: ['AWS (Basic)'],
    systemDesignExperience: 'Built RESTful APIs for medium-scale applications',
    leadershipExperience: 'Mentored 1 junior developer',
    industryBackground: ['Web Development', 'Digital Marketing'],
    employmentStability: 'Good - 2+ years per company',
    matchedSkills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    missingSkills: ['AWS (Advanced)', 'Kubernetes', 'Redis', 'GraphQL'],
    topSkills: ['Python', 'Django', 'React'],
    fitLevel: 'Medium',
    pipelineStep: 'screening'
  },
  'cv4': {
    name: 'Alice Johnson',
    currentRole: 'Product Manager',
    currentCompany: 'ProductFirst',
    location: 'New York, NY',
    totalExperience: '5 years',
    yearsOfExperience: 5,
    relevantYearsOfExperience: 5,
    skills: ['Product Strategy', 'Agile', 'User Research', 'Analytics', 'SQL'],
    education: 'MBA - Harvard Business School',
    previousCompanies: ['ProductFirst', 'StartupHub'],
    aiMatchScore: 85,
    strengths: [
      'Strong product strategy and roadmap planning skills',
      'Excellent stakeholder management experience',
      'Data-driven decision making with SQL proficiency',
      'Successfully launched 5 major product features'
    ],
    weaknesses: [
      'Figma experience not mentioned',
      'Limited technical background'
    ],
    systemDesignExperience: 'N/A - Product Management role',
    leadershipExperience: 'Led cross-functional teams of 8-10 people',
    industryBackground: ['SaaS', 'B2B', 'Enterprise Software'],
    employmentStability: 'Good - 2-3 years per company',
    matchedSkills: ['Product Strategy', 'Agile', 'Analytics', 'User Research', 'SQL'],
    missingSkills: ['Figma', 'Data Analysis (Advanced)'],
    topSkills: ['Product Strategy', 'Agile', 'Analytics'],
    fitLevel: 'Strong',
    pipelineStep: 'interviewing',
    interviewQuestions: [
      {
        id: 'q1',
        question: 'How do you prioritize features when you have competing stakeholder demands and limited engineering resources?',
        category: 'behavioral',
        expectedAnswer: 'Strong candidates should discuss frameworks like RICE, value vs. effort matrices, or weighted scoring. They should mention gathering data, involving stakeholders in the decision-making process, communicating trade-offs clearly, and being transparent about the prioritization criteria.',
        keyPoints: [
          'Use of prioritization frameworks',
          'Data-driven decision making',
          'Stakeholder communication and alignment',
          'Clear criteria and transparency',
          'Balancing short-term and long-term goals',
        ],
        status: 'pending',
      },
      {
        id: 'q2',
        question: 'Tell me about a product you launched. What was your process from ideation to launch, and what were the results?',
        category: 'experience',
        expectedAnswer: 'Look for a structured approach: problem identification, user research, defining success metrics, working with design and engineering, iterating based on feedback, launch strategy, and post-launch analysis. They should share specific metrics and learnings.',
        keyPoints: [
          'Clear problem definition and user research',
          'Cross-functional collaboration',
          'Definition of success metrics',
          'Iterative development process',
          'Post-launch analysis and learning',
        ],
        status: 'pending',
      },
      {
        id: 'q3',
        question: 'How do you work with engineering teams to balance technical debt with new feature development?',
        category: 'technical',
        expectedAnswer: 'Candidates should show understanding of technical debt, the importance of engineering health, and how to have productive conversations about trade-offs. They should mention allocating time for refactoring, understanding the impact of tech debt on velocity, and building trust with engineering.',
        keyPoints: [
          'Understanding of technical debt and its impact',
          'Partnership approach with engineering',
          'Quantifying technical debt impact',
          'Allocating time for technical improvements',
          'Long-term thinking about product sustainability',
        ],
        status: 'pending',
      },
      {
        id: 'q4',
        question: 'How do you use data and analytics in your product decision-making process?',
        category: 'culture',
        expectedAnswer: 'Strong answers include specific tools and metrics used, how they set up instrumentation, analyze user behavior, run A/B tests, and balance quantitative data with qualitative insights. They should show comfort with SQL and analytics tools.',
        keyPoints: [
          'Proficiency with analytics tools and SQL',
          'Setting up proper instrumentation',
          'Running and interpreting A/B tests',
          'Balancing quantitative and qualitative data',
          'Making data-informed (not data-driven) decisions',
        ],
        status: 'pending',
      },
    ]
  },
  'cv5': {
    name: 'Charlie Brown',
    currentRole: 'Data Analyst',
    currentCompany: 'DataCorp',
    location: 'Boston, MA',
    totalExperience: '3 years',
    yearsOfExperience: 3,
    relevantYearsOfExperience: 2,
    skills: ['Python', 'SQL', 'Tableau', 'Excel'],
    education: 'B.S. Statistics - UC Berkeley',
    previousCompanies: ['DataCorp'],
    aiMatchScore: 45,
    strengths: [
      'Strong analytical and statistical background',
      'Python proficiency for data analysis'
    ],
    weaknesses: [
      'Limited backend development experience',
      'No Django framework experience',
      'Missing most required technical skills',
      'Role focused on analysis rather than engineering'
    ],
    cloudExperience: [],
    systemDesignExperience: 'N/A - Analytics focus',
    leadershipExperience: 'No team leadership experience',
    industryBackground: ['Data Analytics', 'Business Intelligence'],
    employmentStability: 'Limited - Only one company so far',
    matchedSkills: ['Python'],
    missingSkills: ['Django', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Redis', 'GraphQL'],
    topSkills: ['Python', 'SQL', 'Tableau'],
    fitLevel: 'Weak',
    pipelineStep: 'rejected'
  },
  'cv6': {
    name: 'Diana Lee',
    currentRole: 'DevOps Engineer',
    currentCompany: 'CloudOps',
    location: 'Portland, OR',
    totalExperience: '6 years',
    yearsOfExperience: 6,
    relevantYearsOfExperience: 5,
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD', 'Python'],
    education: 'B.S. Computer Engineering - Georgia Tech',
    previousCompanies: ['CloudOps', 'InfraTech', 'DevSecOps Inc'],
    aiMatchScore: 78,
    strengths: [
      'Expert-level AWS and Kubernetes knowledge',
      'Strong infrastructure-as-code experience with Terraform',
      'Excellent CI/CD pipeline implementation skills',
      'Python scripting for automation'
    ],
    weaknesses: [
      'Limited application development experience with Django',
      'PostgreSQL experience mainly from DevOps perspective',
      'GraphQL and Redis not in skill set'
    ],
    cloudExperience: ['AWS', 'Azure', 'GCP'],
    systemDesignExperience: 'Designed cloud infrastructure for scalable applications',
    leadershipExperience: 'Led DevOps transformation for 20+ person engineering team',
    industryBackground: ['Cloud Infrastructure', 'DevOps', 'Platform Engineering'],
    employmentStability: 'Good - 2-3 years per company',
    matchedSkills: ['AWS', 'Kubernetes', 'Docker', 'Python'],
    missingSkills: ['Django', 'PostgreSQL (Application level)', 'Redis', 'GraphQL'],
    topSkills: ['AWS', 'Kubernetes', 'Docker'],
    fitLevel: 'Medium',
    pipelineStep: 'screening'
  },
  'cv7': {
    name: 'Edward Kim',
    currentRole: 'Cloud Specialist',
    currentCompany: 'CloudNative',
    location: 'Denver, CO',
    totalExperience: '4 years',
    yearsOfExperience: 4,
    relevantYearsOfExperience: 3,
    skills: ['AWS', 'GCP', 'Kubernetes', 'Terraform', 'Docker'],
    education: 'B.S. Information Technology - University of Washington',
    previousCompanies: ['CloudNative', 'Infrastructure Solutions'],
    aiMatchScore: 65,
    strengths: [
      'Multi-cloud expertise with AWS and GCP',
      'Strong Kubernetes containerization skills',
      'Infrastructure automation with Terraform'
    ],
    weaknesses: [
      'No backend development experience with Python or Django',
      'Missing database skills',
      'Limited application-level programming experience',
      'Role focused on infrastructure rather than backend engineering'
    ],
    cloudExperience: ['AWS', 'GCP', 'Azure'],
    systemDesignExperience: 'Designed cloud infrastructure architectures',
    leadershipExperience: 'No direct reports',
    industryBackground: ['Cloud Services', 'Infrastructure'],
    employmentStability: 'Good - 2 years per company',
    matchedSkills: ['AWS', 'Kubernetes', 'Docker'],
    missingSkills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'GraphQL'],
    topSkills: ['AWS', 'Kubernetes', 'Terraform'],
    fitLevel: 'Weak',
    pipelineStep: 'new'
  },
}

// Mock data
const mockJobs: Record<string, JobRequisition> = {
  '1': {
    id: '1',
    title: 'Senior Backend Engineer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'Full-time',
    hiringManager: 'Sarah Johnson',
    targetYearsMin: 5,
    targetYearsMax: 8,
    requiredSkills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
    niceToHaveSkills: ['Kubernetes', 'Redis', 'GraphQL'],
    status: 'active',
    candidateCount: 3,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  '2': {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'Hybrid',
    employmentType: 'Full-time',
    hiringManager: 'Michael Chen',
    targetYearsMin: 4,
    targetYearsMax: 7,
    requiredSkills: ['Product Strategy', 'Agile', 'Analytics', 'User Research'],
    niceToHaveSkills: ['SQL', 'Figma', 'Data Analysis'],
    status: 'active',
    candidateCount: 1,
    createdAt: '2025-01-10T14:30:00Z',
    updatedAt: '2025-01-10T14:30:00Z',
  },
  '3': {
    id: '3',
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Onsite',
    employmentType: 'Full-time',
    hiringManager: 'Emily Davis',
    targetYearsMin: 3,
    targetYearsMax: 6,
    requiredSkills: ['React', 'TypeScript', 'CSS', 'Next.js'],
    niceToHaveSkills: ['GraphQL', 'Testing', 'Accessibility'],
    status: 'active',
    candidateCount: 0,
    createdAt: '2025-01-05T09:15:00Z',
    updatedAt: '2025-01-05T09:15:00Z',
  },
  '4': {
    id: '4',
    title: 'Data Scientist',
    department: 'Data',
    location: 'Remote',
    employmentType: 'Full-time',
    hiringManager: 'David Kim',
    targetYearsMin: 4,
    targetYearsMax: 8,
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    niceToHaveSkills: ['PyTorch', 'Spark', 'Deep Learning'],
    status: 'paused',
    candidateCount: 1,
    createdAt: '2024-12-20T11:00:00Z',
    updatedAt: '2024-12-20T11:00:00Z',
  },
  '5': {
    id: '5',
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'Full-time',
    hiringManager: 'Sarah Johnson',
    targetYearsMin: 4,
    targetYearsMax: 8,
    requiredSkills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
    niceToHaveSkills: ['GCP', 'Ansible', 'Prometheus'],
    status: 'active',
    candidateCount: 2,
    createdAt: '2024-12-18T08:45:00Z',
    updatedAt: '2024-12-18T08:45:00Z',
  },
}

const mockCVsByJob: Record<string, CV[]> = {
  '1': [
    { id: 'cv1', fileName: 'john_doe_resume.pdf', fileSize: 245000, uploadedAt: '2025-01-18T10:30:00Z', status: 'reviewed', parsed: mockParsedCVs['cv1'] },
    { id: 'cv2', fileName: 'jane_smith_cv.pdf', fileSize: 189000, uploadedAt: '2025-01-18T11:45:00Z', status: 'shortlisted', parsed: mockParsedCVs['cv2'] },
    { id: 'cv3', fileName: 'bob_wilson_resume.docx', fileSize: 156000, uploadedAt: '2025-01-19T09:00:00Z', status: 'pending', parsed: mockParsedCVs['cv3'] },
  ],
  '2': [
    { id: 'cv4', fileName: 'alice_johnson_pm.pdf', fileSize: 278000, uploadedAt: '2025-01-17T14:00:00Z', status: 'pending', parsed: mockParsedCVs['cv4'] },
  ],
  '3': [],
  '4': [
    { id: 'cv5', fileName: 'charlie_brown_resume.pdf', fileSize: 198000, uploadedAt: '2025-01-10T10:00:00Z', status: 'rejected', parsed: mockParsedCVs['cv5'] },
  ],
  '5': [
    { id: 'cv6', fileName: 'diana_lee_devops.pdf', fileSize: 220000, uploadedAt: '2025-01-16T15:30:00Z', status: 'reviewed', parsed: mockParsedCVs['cv6'] },
    { id: 'cv7', fileName: 'edward_kim_cloud.pdf', fileSize: 245000, uploadedAt: '2025-01-17T09:15:00Z', status: 'pending', parsed: mockParsedCVs['cv7'] },
  ],
}

// Simulate API delay (1-2 seconds)
const simulateDelay = () => new Promise(resolve =>
  setTimeout(resolve, Math.random() * 1000 + 1000)
)

export async function getJobDetail(id: string): Promise<ApiResponse<JobRequisition | null>> {
  await simulateDelay()

  const job = mockJobs[id]

  if (!job) {
    return {
      data: null,
      success: false,
      message: 'Job not found',
    }
  }

  return {
    data: job,
    success: true,
    message: 'Job fetched successfully',
  }
}

export async function getJobCVs(jobId: string): Promise<ApiResponse<CV[]>> {
  await simulateDelay()

  const cvs = mockCVsByJob[jobId] || []

  return {
    data: cvs,
    success: true,
    message: 'CVs fetched successfully',
  }
}

export async function updateJobStatus(
  id: string,
  status: JobRequisition['status']
): Promise<ApiResponse<JobRequisition | null>> {
  await simulateDelay()

  const job = mockJobs[id]

  if (!job) {
    return {
      data: null,
      success: false,
      message: 'Job not found',
    }
  }

  const updatedJob = { ...job, status, updatedAt: new Date().toISOString() }
  mockJobs[id] = updatedJob

  return {
    data: updatedJob,
    success: true,
    message: 'Job status updated successfully',
  }
}
