import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Paper, Typography, IconButton, TextField, Chip } from '@mui/material'
import { motion, AnimatePresence } from 'motion/react'
import { Sparkles, X, Send, Lightbulb } from 'lucide-react'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface Suggestion {
    id: string
    text: string
    action?: () => void
}

export function AICompanion() {
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(true)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])

    // Update suggestions based on current page
    useEffect(() => {
        const path = location.pathname

        if (path === '/jobs/new') {
            setSuggestions([
                { id: 's1', text: 'Fill form for Data Engineer position' },
                { id: 's2', text: 'Generate Senior Frontend Developer job' },
                { id: 's3', text: 'Create Backend Engineer requisition' },
            ])
            setMessages([
                {
                    id: 'm1',
                    role: 'assistant',
                    content: "Hi! 👋 I'm your AI hiring assistant. I can help you create a compelling job requisition. Try asking me:\n\n'Fill in the form for Senior Data Engineer, 5-7 years experience, must know Python and SQL'\n\nor click one of the suggestions above!",
                    timestamp: new Date(),
                },
            ])
        } else if (path.startsWith('/jobs/') && path.includes('/upload')) {
            setSuggestions([
                { id: 's1', text: 'Best practices for CV screening' },
                { id: 's2', text: 'What to look for in candidates' },
            ])
            setMessages([
                {
                    id: 'm1',
                    role: 'assistant',
                    content: "I can help you screen and evaluate candidates. Upload CVs and I'll analyze them against your job requirements.",
                    timestamp: new Date(),
                },
            ])
        } else if (path.startsWith('/jobs/') && path !== '/jobs' && path !== '/jobs/new') {
            setSuggestions([
                { id: 's1', text: 'Generate interview questions' },
                { id: 's2', text: 'Analyze candidate fit' },
                { id: 's3', text: 'Compare candidates' },
            ])
            setMessages([
                {
                    id: 'm1',
                    role: 'assistant',
                    content: "I can help you evaluate candidates, generate interview questions, and make informed hiring decisions.",
                    timestamp: new Date(),
                },
            ])
        } else if (path === '/jobs') {
            setSuggestions([
                { id: 's1', text: 'Show hiring analytics' },
                { id: 's2', text: 'Suggest job improvements' },
            ])
            setMessages([
                {
                    id: 'm1',
                    role: 'assistant',
                    content: "I can help you manage your job requisitions and provide insights on your hiring pipeline.",
                    timestamp: new Date(),
                },
            ])
        } else {
            setSuggestions([
                { id: 's1', text: 'How can I create a job?' },
                { id: 's2', text: 'Show me hiring metrics' },
            ])
            setMessages([
                {
                    id: 'm1',
                    role: 'assistant',
                    content: "Welcome to Aurora! I'm your AI hiring assistant. I can help you with creating jobs, screening candidates, and making better hiring decisions.",
                    timestamp: new Date(),
                },
            ])
        }
    }, [location.pathname])

    const handleSendMessage = async () => {
        if (!input.trim()) return

        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: new Date(),
        }

        setMessages([...messages, userMessage])
        const userInput = input
        setInput('')

        // Check if we're on the create job page and user is asking to fill the form
        if (location.pathname === '/jobs/new' &&
            (userInput.toLowerCase().includes('fill') ||
                userInput.toLowerCase().includes('create') ||
                userInput.toLowerCase().includes('generate'))) {

            // Show loading message
            const loadingMessage: Message = {
                id: `msg-${Date.now()}-loading`,
                role: 'assistant',
                content: "🔄 Generating job requisition data based on your request...",
                timestamp: new Date(),
            }
            setMessages(prev => [...prev, loadingMessage])

            try {
                // Call the backend API
                const response = await fetch('http://localhost:8000/fill-job-requisition', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: userInput,
                        markConfidential: false,
                    }),
                })

                const result = await response.json()

                if (result.success && result.data) {
                    // Dispatch custom event to fill the form
                    const event = new CustomEvent('fillJobForm', { detail: result.data })
                    window.dispatchEvent(event)

                    // Show success message
                    setMessages(prev => prev.filter(m => m.id !== loadingMessage.id).concat({
                        id: `msg-${Date.now()}-ai`,
                        role: 'assistant',
                        content: `✅ Great! I've filled in the form for "${result.data.title}". The form will be populated with:\n\n• Department: ${result.data.department}\n• Location: ${result.data.location}\n• Years: ${result.data.targetYearsMin}-${result.data.targetYearsMax}\n• Required Skills: ${result.data.requiredSkills.join(', ')}\n${result.data.description ? `\n📝 Rich HTML job description has been added!` : ''}\n\nFeel free to adjust any fields before submitting!`,
                        timestamp: new Date(),
                    }))
                } else {
                    throw new Error(result.message || 'Failed to generate job data')
                }
            } catch (error) {
                // Show error message
                setMessages(prev => prev.filter(m => m.id !== loadingMessage.id).concat({
                    id: `msg-${Date.now()}-ai`,
                    role: 'assistant',
                    content: `❌ Sorry, I couldn't generate the job data. Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure the backend is running on http://localhost:8000`,
                    timestamp: new Date(),
                }))
            }
        } else {
            // Simulate AI response for other queries
            setTimeout(() => {
                const aiResponse: Message = {
                    id: `msg-${Date.now()}-ai`,
                    role: 'assistant',
                    content: "I'm analyzing your request... This is a demo response. In a real implementation, this would be powered by an AI model to provide contextual assistance.",
                    timestamp: new Date(),
                }
                setMessages(prev => [...prev, aiResponse])
            }, 1000)
        }
    }

    const handleSuggestionClick = async (suggestion: Suggestion) => {
        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: suggestion.text,
            timestamp: new Date(),
        }

        setMessages([...messages, userMessage])

        // Check if this is a job generation suggestion on create job page
        if (location.pathname === '/jobs/new') {
            // Show loading message
            const loadingMessage: Message = {
                id: `msg-${Date.now()}-loading`,
                role: 'assistant',
                content: "🔄 Generating job requisition data based on your request...",
                timestamp: new Date(),
            }
            setMessages(prev => [...prev, loadingMessage])

            try {
                // Call the backend API
                const response = await fetch('http://localhost:8000/fill-job-requisition', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: suggestion.text,
                        markConfidential: false,
                    }),
                })

                const result = await response.json()

                if (result.success && result.data) {
                    // Dispatch custom event to fill the form
                    const event = new CustomEvent('fillJobForm', { detail: result.data })
                    window.dispatchEvent(event)

                    // Show success message
                    setMessages(prev => prev.filter(m => m.id !== loadingMessage.id).concat({
                        id: `msg-${Date.now()}-ai`,
                        role: 'assistant',
                        content: `✅ Great! I've filled in the form for "${result.data.title}". The form will be populated with:\n\n• Department: ${result.data.department}\n• Location: ${result.data.location}\n• Years: ${result.data.targetYearsMin}-${result.data.targetYearsMax}\n• Required Skills: ${result.data.requiredSkills.join(', ')}\n${result.data.description ? `\n📝 Rich HTML job description has been added!` : ''}\n\nFeel free to adjust any fields before submitting!`,
                        timestamp: new Date(),
                    }))
                } else {
                    throw new Error(result.message || 'Failed to generate job data')
                }
            } catch (error) {
                // Show error message
                setMessages(prev => prev.filter(m => m.id !== loadingMessage.id).concat({
                    id: `msg-${Date.now()}-ai`,
                    role: 'assistant',
                    content: `❌ Sorry, I couldn't generate the job data. Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure the backend is running on http://localhost:8000`,
                    timestamp: new Date(),
                }))
            }
        } else {
            // Simulate AI response based on suggestion
            setTimeout(() => {
                const aiResponse: Message = {
                    id: `msg-${Date.now()}-ai`,
                    role: 'assistant',
                    content: `Great question! ${suggestion.text} - I can help with that. This is a demo response showing contextual AI assistance.`,
                    timestamp: new Date(),
                }
                setMessages(prev => [...prev, aiResponse])
            }, 1000)
        }
    }

    if (!isOpen) {
        return (

            <Box
                sx={{
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 60,
                    bgcolor: 'white',
                    borderLeft: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <IconButton
                    onClick={() => setIsOpen(true)}
                    sx={{
                        transform: 'rotate(90deg)',
                        color: '#4F46E5',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Sparkles size={20} />
                        <Typography variant="caption" fontWeight={600}>
                            AI
                        </Typography>
                    </Box>
                </IconButton>
            </Box>
        )
    }

    return (

        <Paper
            sx={{
                position: 'fixed',
                right: 0,
                top: 0,
                bottom: 0,
                width: 380,
                bgcolor: 'white',
                borderLeft: '1px solid #E2E8F0',
                borderRadius: 0,
                display: 'flex',
                flexDirection: 'column',
                zIndex: 100,
                boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.12)',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 3,
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Sparkles size={20} className="text-white" strokeWidth={2} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'white' }}>
                            AI Companion
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            Always here to help
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    size="small"
                    onClick={() => setIsOpen(false)}
                    sx={{
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                    }}
                >
                    <X size={20} />
                </IconButton>
            </Box>

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <Box sx={{ p: 2, borderBottom: '1px solid #F1F5F9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                        <Lightbulb size={14} className="text-amber-500" strokeWidth={2} />
                        <Typography variant="caption" fontWeight={600} color="text.secondary">
                            Quick actions
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {suggestions.map((suggestion, index) => (
                            <motion.div
                                key={suggestion.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <Chip
                                    label={suggestion.text}
                                    size="small"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    sx={{
                                        bgcolor: '#F0F4FF',
                                        color: '#4F46E5',
                                        border: '1px solid #C7D2FE',
                                        '&:hover': {
                                            bgcolor: '#E0E7FF',
                                            cursor: 'pointer',
                                        },
                                        fontSize: '0.75rem',
                                    }}
                                />
                            </motion.div>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Messages */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <Box
                                    sx={{
                                        maxWidth: '85%',
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: message.role === 'user' ? '#4F46E5' : '#F1F5F9',
                                        color: message.role === 'user' ? 'white' : '#1E293B',
                                    }}
                                >
                                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                        {message.content}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, px: 0.5 }}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </Box>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </Box>

            {/* Input */}
            <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0' }}>
                <Box sx={{ position: 'relative' }}>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={6}
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage()
                            }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                paddingRight: '48px',
                                paddingBottom: '12px',
                            },
                        }}
                    />
                    <IconButton
                        onClick={handleSendMessage}
                        disabled={!input.trim()}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            bottom: 8,
                            bgcolor: '#4F46E5',
                            color: 'white',
                            width: 32,
                            height: 32,
                            '&:hover': { bgcolor: '#4338CA' },
                            '&:disabled': { bgcolor: '#E2E8F0', color: '#94A3B8' },
                        }}
                    >
                        <Send size={16} />
                    </IconButton>
                </Box>
            </Box>
        </Paper>
    )
}
