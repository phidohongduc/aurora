import { useState } from 'react';
import { MessageSquare, CheckCircle, XCircle, Clock, User, ArrowLeft } from 'lucide-react';
import type { CV, JobRequisition } from '@/types';

interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'culture' | 'experience';
  expectedAnswer: string;
  keyPoints: string[];
  status?: 'pending' | 'answered' | 'skipped';
  candidateAnswer?: string;
  rating?: number;
}

interface CandidateInterviewingViewProps {
  cv: CV;
  job: JobRequisition;
}

export function CandidateInterviewingView({ cv, job }: CandidateInterviewingViewProps) {
  if (!cv.parsed) return null;

  const candidate = cv.parsed;
  
  // Use interview questions from parsed CV if available, otherwise use default questions
  const defaultQuestions: InterviewQuestion[] = [
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
      question: 'How do you stay updated with new technologies and best practices in backend engineering? Can you share something new you\'ve learned recently?',
      category: 'culture',
      expectedAnswer: 'Candidates should show continuous learning habits through various channels (blogs, conferences, open source, side projects). They should mention specific recent learnings and how they\'ve applied them or plan to apply them in their work.',
      keyPoints: [
        'Regular learning habits and resources',
        'Practical application of new knowledge',
        'Community involvement',
        'Balance between learning new tech and deepening expertise',
        'Ability to evaluate technology trends critically',
      ],
      status: 'pending',
    },
    {
      id: 'q5',
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
    {
      id: 'q6',
      question: 'How do you ensure code quality and maintainability in a fast-paced environment? What practices or tools do you advocate for?',
      category: 'technical',
      expectedAnswer: 'Strong answers include: code reviews, automated testing (unit, integration, e2e), CI/CD pipelines, linting and formatting, documentation, design patterns, and monitoring. They should discuss balancing velocity with quality and how they\'ve implemented these practices in their teams.',
      keyPoints: [
        'Comprehensive testing strategy',
        'Code review culture',
        'Automated quality checks',
        'Documentation practices',
        'Team collaboration on standards',
      ],
      status: 'pending',
    },
  ];

  const [questions] = useState<InterviewQuestion[]>(
    candidate.interviewQuestions || defaultQuestions
  );

  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-100 text-blue-700';
      case 'behavioral':
        return 'bg-purple-100 text-purple-700';
      case 'culture':
        return 'bg-green-100 text-green-700';
      case 'experience':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const selectedQuestionData = questions.find(q => q.id === selectedQuestion);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-slate-900">Interview: {candidate.name}</h2>
                <p className="text-sm text-slate-600">
                  {candidate.currentRole}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Match Score</p>
                <p className="text-xl text-indigo-600">{candidate.aiMatchScore}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Questions List */}
          <div className="col-span-5">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-slate-900">Interview Questions</h3>
                <span className="text-sm text-slate-600">{questions.length} questions</span>
              </div>

              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuestion(q.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedQuestion === q.id
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-sm font-medium text-slate-900">Question {idx + 1}</span>
                      <span className={`px-2 py-0.5 rounded text-xs capitalize ${getCategoryColor(q.category)}`}>
                        {q.category}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{q.question}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Interview Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
              <h4 className="text-blue-900 mb-3">Interview Tips</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Use the expected answers as a guide, not a script</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Look for key points in candidate responses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Follow up with deeper questions on relevant topics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Allow candidates to ask their own questions</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Question Detail */}
          <div className="col-span-7">
            {selectedQuestionData ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-6 h-6 text-indigo-600" />
                    <span className={`px-3 py-1 rounded-full text-sm capitalize ${getCategoryColor(selectedQuestionData.category)}`}>
                      {selectedQuestionData.category}
                    </span>
                  </div>
                  <h3 className="text-slate-900 mb-2">Question</h3>
                  <p className="text-slate-700">{selectedQuestionData.question}</p>
                </div>

                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Expected Answer
                  </h4>
                  <p className="text-green-800 text-sm leading-relaxed">
                    {selectedQuestionData.expectedAnswer}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-slate-900 mb-3">Key Points to Listen For</h4>
                  <ul className="space-y-2">
                    {selectedQuestionData.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                        <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-indigo-600">{idx + 1}</span>
                        </div>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h4 className="text-slate-900 mb-3">Candidate Notes</h4>
                  <textarea
                    placeholder="Take notes during the candidate's response..."
                    className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Rate this response:</span>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          className="w-8 h-8 rounded-full border border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 text-sm text-slate-600 hover:text-indigo-600"
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Select a question to view details and expected answers</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
