"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  MessageCircle,
  Send,
  Minimize2,
  Maximize2,
  X,
  Bot,
  User,
  Clock,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  Mic,
  Phone,
  Mail,
  Star,
  Zap,
  Brain,
  Lightbulb,
  ShoppingBag,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Download
} from 'lucide-react'

interface ChatMessage {
  id: string
  sender: 'user' | 'agent' | 'bot'
  content: string
  timestamp: Date
  status?: 'sending' | 'sent' | 'delivered' | 'read'
  attachments?: string[]
  reactions?: {
    thumbsUp?: number
    thumbsDown?: number
  }
  quickReplies?: string[]
  typing?: boolean
}

interface ChatAgent {
  id: string
  name: string
  avatar: string
  status: 'online' | 'away' | 'offline'
  department: string
  rating: number
  responseTime: string
}

interface LiveChatWidgetProps {
  agents: ChatAgent[]
  enableAI?: boolean
  enableVoice?: boolean
  enableFileUpload?: boolean
  enableQuickReplies?: boolean
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  theme?: 'light' | 'dark' | 'auto'
  onMessageSend?: (message: string) => void
  onChatEnd?: () => void
  className?: string
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  agents,
  enableAI = true,
  enableVoice = false,
  enableFileUpload = true,
  enableQuickReplies = true,
  position = 'bottom-right',
  theme = 'auto',
  onMessageSend,
  onChatEnd,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      content: 'Hello! Welcome to PG Closets. How can I help you today?',
      timestamp: new Date(),
      quickReplies: ['Product Information', 'Order Status', 'Design Consultation', 'Technical Support']
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<ChatAgent | null>(null)
  const [chatMode, setChatMode] = useState<'bot' | 'human'>('bot')
  const [unreadCount, setUnreadCount] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Simulate agent response
  const simulateAgentResponse = (userMessage: string) => {
    setIsTyping(true)

    setTimeout(() => {
      const responses = [
        "I understand you're looking for information about our products. Let me help you with that.",
        "That's a great question! Based on your needs, I'd recommend our custom closet solutions.",
        "I'd be happy to help you with that. Can you tell me more about your specific requirements?",
        "Thank you for your interest! Our design team can create the perfect solution for you.",
        "I can definitely assist you with that. Let me connect you with one of our specialists."
      ]

      const aiResponses = [
        "Based on your inquiry, I can suggest our most popular modular closet systems.",
        "I've analyzed your needs and found several options that would work perfectly for your space.",
        "Let me use our AI-powered recommendation engine to find the best match for you.",
        "I can help you design the perfect closet solution based on your preferences and budget."
      ]

      const responseText = chatMode === 'bot'
        ? aiResponses[Math.floor(Math.random() * aiResponses.length)]
        : responses[Math.floor(Math.random() * responses.length)]

      const newMessage: ChatMessage = {
        id: `response-${Date.now()}`,
        sender: chatMode === 'bot' ? 'bot' : 'agent',
        content: responseText,
        timestamp: new Date(),
        status: 'delivered',
        quickReplies: enableQuickReplies ? [
          'Tell me more',
          'Show me products',
          'Schedule consultation',
          'Pricing information'
        ] : undefined
      }

      setMessages(prev => [...prev, newMessage])
      setIsTyping(false)
    }, 1500 + Math.random() * 1500)
  }

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: newMessage,
      timestamp: new Date(),
      status: 'sending'
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg
        )
      )
    }, 500)

    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id ? { ...msg, status: 'delivered' as const } : msg
        )
      )
    }, 1000)

    onMessageSend?.(newMessage)
    simulateAgentResponse(newMessage)
  }

  // Handle quick reply
  const handleQuickReply = (reply: string) => {
    setNewMessage(reply)
    setTimeout(() => sendMessage(), 100)
  }

  // Handle reaction
  const handleReaction = (messageId: string, reaction: 'thumbsUp' | 'thumbsDown') => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: {
                ...msg.reactions,
                [reaction]: (msg.reactions?.[reaction] || 0) + 1
              }
            }
          : msg
      )
    )
  }

  // Switch to human agent
  const switchToHumanAgent = () => {
    setChatMode('human')
    const availableAgent = agents.find(agent => agent.status === 'online') || agents[0]
    setSelectedAgent(availableAgent)

    const message: ChatMessage = {
      id: `transfer-${Date.now()}`,
      sender: 'bot',
      content: `I'm connecting you with ${availableAgent.name} from our ${availableAgent.department} team. Please wait a moment...`,
      timestamp: new Date(),
      status: 'delivered'
    }

    setMessages(prev => [...prev, message])
  }

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'top-left':
        return 'top-4 left-4'
      default:
        return 'bottom-4 right-4'
    }
  }

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50 ${className}`}>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              size="lg"
              className="relative rounded-full w-14 h-14 shadow-lg"
              onClick={() => setIsOpen(true)}
            >
              <MessageCircle className="h-6 w-6" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-96 h-[600px] shadow-2xl"
          >
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {chatMode === 'bot' ? (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      ) : (
                        <>
                          <img
                            src={selectedAgent?.avatar || '/api/placeholder/40/40'}
                            alt={selectedAgent?.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        </>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {chatMode === 'bot' ? 'AI Assistant' : selectedAgent?.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {chatMode === 'bot' ? (
                          <>
                            <Zap className="h-3 w-3" />
                            <span>Always online</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>{selectedAgent?.department}</span>
                            <span>•</span>
                            <span>{selectedAgent?.responseTime} response time</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {chatMode === 'bot' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={switchToHumanAgent}
                      >
                        <User className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsOpen(false)
                        onChatEnd?.()
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Chat Messages */}
              {!isMinimized && (
                <>
                  <CardContent className="flex-1 overflow-y-auto pt-0">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {message.sender !== 'user' && (
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                              {message.sender === 'bot' ? (
                                <Bot className="h-4 w-4" />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                            </div>
                          )}

                          <div className={`max-w-[70%] ${
                            message.sender === 'user' ? 'order-first' : ''
                          }`}>
                            <div
                              className={`rounded-lg p-3 ${
                                message.sender === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>

                            {/* Quick Replies */}
                            {message.quickReplies && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {message.quickReplies.map((reply, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuickReply(reply)}
                                    className="text-xs"
                                  >
                                    {reply}
                                  </Button>
                                ))}
                              </div>
                            )}

                            {/* Message Metadata */}
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>{formatTimestamp(message.timestamp)}</span>
                              {message.sender === 'user' && message.status && (
                                <span>
                                  {message.status === 'sending' && <Clock className="h-3 w-3" />}
                                  {message.status === 'sent' && <Check className="h-3 w-3" />}
                                  {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                                  {message.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
                                </span>
                              )}
                            </div>

                            {/* Reactions */}
                            {message.reactions && (
                              <div className="flex items-center gap-2 mt-1">
                                {message.reactions.thumbsUp > 0 && (
                                  <button
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-green-600"
                                    onClick={() => handleReaction(message.id, 'thumbsUp')}
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                    {message.reactions.thumbsUp}
                                  </button>
                                )}
                                {message.reactions.thumbsDown > 0 && (
                                  <button
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600"
                                    onClick={() => handleReaction(message.id, 'thumbsDown')}
                                  >
                                    <ThumbsDown className="h-3 w-3" />
                                    {message.reactions.thumbsDown}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3"
                        >
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <div ref={messagesEndRef} />
                  </CardContent>

                  {/* Chat Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2 mb-2">
                      {enableFileUpload && (
                        <Button variant="outline" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Smile className="h-4 w-4" />
                      </Button>
                      {enableVoice && (
                        <Button
                          variant={isRecording ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => setIsRecording(!isRecording)}
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        ref={inputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-3">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        View Products
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Phone className="h-3 w-3 mr-1" />
                        Call Us
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Mail className="h-3 w-3 mr-1" />
                        Email Support
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LiveChatWidget