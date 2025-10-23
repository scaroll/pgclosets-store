"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  User,
  Bot,
  Phone,
  Mail
} from "lucide-react"

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot' | 'agent'
  timestamp: Date
  senderName?: string
}

const QUICK_RESPONSES = [
  "What's the shipping time?",
  "Do you offer international shipping?",
  "What's your return policy?",
  "How can I track my order?",
  "Do you have discounts available?"
]

const TYPING_INDICATORS = [
  "An agent is typing...",
  "Connecting you to an agent...",
  "Agent is reviewing your message..."
]

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! Welcome to PG Closets. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      senderName: 'Shopping Assistant'
    }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isAgentOnline, setIsAgentOnline] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Simulate agent status changes
    const interval = setInterval(() => {
      setIsAgentOnline(Math.random() > 0.1)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Auto-response simulation
    if (messages.length > 1 && messages[messages.length - 1].sender === 'user') {
      setIsTyping(true)
      setTimeout(() => {
        const responses = [
          "Thanks for your message! Let me check that for you.",
          "I understand your question. Let me find the best solution.",
          "Great question! Let me help you with that.",
          "I'll be right with you. Let me look that up."
        ]
        const botResponse: Message = {
          id: Date.now().toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: 'bot',
          timestamp: new Date(),
          senderName: 'Shopping Assistant'
        }
        setMessages(prev => [...prev, botResponse])
        setIsTyping(false)
      }, 2000)
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")

    if (isOpen && !isMinimized) {
      setIsTyping(true)
    }
  }

  const handleQuickResponse = (response: string) => {
    setInputMessage(response)
    handleSendMessage()
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setUnreadCount(0)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={toggleChat}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg relative"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>

        {/* Chat bubble hint */}
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-3 hidden lg:block">
          <p className="text-sm font-medium mb-1">Need help?</p>
          <p className="text-xs text-gray-600">Chat with our shopping experts</p>
          <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isMinimized ? 'w-80' : 'w-96'}`}>
      <Card className="shadow-xl">
        {/* Header */}
        <CardHeader className="bg-blue-600 text-white pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <CardTitle className="text-lg">Customer Support</CardTitle>
              <Badge variant={isAgentOnline ? "default" : "secondary"} className="bg-green-500">
                {isAgentOnline ? "Online" : "Away"}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimize}
                className="text-white hover:bg-blue-700 p-1 h-8 w-8"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="text-white hover:bg-blue-700 p-1 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="h-96 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.sender === 'agent'
                        ? 'bg-green-100 text-gray-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.senderName && (
                      <div className="flex items-center gap-1 mb-1">
                        {message.sender === 'bot' ? (
                          <Bot className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        <span className="text-xs font-medium opacity-75">
                          {message.senderName}
                        </span>
                      </div>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Quick Responses */}
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {QUICK_RESPONSES.map((response, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickResponse(response)}
                    className="text-xs h-8"
                  >
                    {response}
                  </Button>
                ))}
              </div>
            </div>

            {/* Contact Options */}
            <div className="px-4 pb-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Phone className="w-3 h-3" />
                <span>1-800-123-4567</span>
                <span>•</span>
                <Mail className="w-3 h-3" />
                <span>support@example.com</span>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}