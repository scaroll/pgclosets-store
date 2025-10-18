/**
 * DIVISION 5: CONVERSION RATE OPTIMIZATION
 * Live Chat Widget (Agent 24)
 *
 * Real-time support integration with proactive messaging
 */

'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'agent' | 'bot'
  timestamp: Date
  type?: 'text' | 'quick_reply' | 'product' | 'offer'
}

export interface LiveChatConfig {
  enabled: boolean
  proactiveMessage: string
  proactiveDelay: number // ms
  position: 'bottom-right' | 'bottom-left'
  theme: {
    primaryColor: string
    agentName: string
    agentAvatar?: string
  }
}

const defaultConfig: LiveChatConfig = {
  enabled: true,
  proactiveMessage: "Hi! 👋 Need help choosing the perfect closet doors? I'm here to help!",
  proactiveDelay: 30000, // 30 seconds
  position: 'bottom-right',
  theme: {
    primaryColor: '#2563eb',
    agentName: 'Sarah',
    agentAvatar: undefined
  }
}

interface LiveChatWidgetProps {
  config?: Partial<LiveChatConfig>
}

export function LiveChatWidget({ config: customConfig }: LiveChatWidgetProps) {
  const config = { ...defaultConfig, ...customConfig }
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showProactive, setShowProactive] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  /**
   * Show proactive message after delay
   */
  useEffect(() => {
    if (!config.enabled || isOpen) return

    const timer = setTimeout(() => {
      setShowProactive(true)
    }, config.proactiveDelay)

    return () => clearTimeout(timer)
  }, [config.enabled, config.proactiveDelay, isOpen])

  /**
   * Handle proactive message click
   */
  const handleProactiveClick = () => {
    setShowProactive(false)
    setIsOpen(true)

    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      text: config.proactiveMessage,
      sender: 'agent',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])

    // Add quick replies
    setTimeout(() => {
      const quickReplies: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: '',
        sender: 'bot',
        timestamp: new Date(),
        type: 'quick_reply'
      }
      setMessages(prev => [...prev, quickReplies])
    }, 1000)
  }

  /**
   * Send message
   */
  const sendMessage = (text: string) => {
    if (!text.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate agent typing
    setIsTyping(true)

    // Simulate agent response
    setTimeout(() => {
      setIsTyping(false)
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getAutomatedResponse(text),
        sender: 'agent',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, agentMessage])
    }, 1500)

    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'live_chat_message', {
        message_length: text.length
      })
    }
  }

  /**
   * Simple automated responses
   */
  const getAutomatedResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase()

    if (lower.includes('price') || lower.includes('cost')) {
      return "Our bypass doors start at $299. I can help you get an exact quote based on your specific needs. What size opening do you have?"
    }

    if (lower.includes('install') || lower.includes('installation')) {
      return "We offer professional installation throughout Ottawa. Our expert installers will ensure perfect fit and finish. Would you like to add installation to your quote?"
    }

    if (lower.includes('size') || lower.includes('measure')) {
      return "We offer standard sizes and custom dimensions. For best results, I recommend booking a free online quote where we'll take precise measurements. Should I schedule that for you?"
    }

    if (lower.includes('shipping') || lower.includes('delivery')) {
      return "Great question! We offer FREE shipping and delivery throughout the Ottawa area. Delivery typically takes 2-3 weeks from order confirmation."
    }

    return "Thanks for your message! For detailed assistance, I'd recommend speaking with one of our design experts. Would you like me to schedule a free online quote call?"
  }

  /**
   * Quick reply options
   */
  const quickReplies = [
    { id: '1', text: 'Get a Quote', action: () => sendMessage('I need a quote') },
    { id: '2', text: 'See Pricing', action: () => sendMessage('What are your prices?') },
    { id: '3', text: 'Installation Info', action: () => sendMessage('Tell me about installation') },
    { id: '4', text: 'Schedule Consultation', action: () => sendMessage('I want to schedule a consultation') }
  ]

  const positionClasses = config.position === 'bottom-right' ? 'right-4' : 'left-4'

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleProactiveClick}
            className={`fixed bottom-4 ${positionClasses} z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center`}
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6" />
            {showProactive && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Proactive Message Bubble */}
      <AnimatePresence>
        {showProactive && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`fixed bottom-20 ${positionClasses} z-50 max-w-xs`}
          >
            <div className="bg-white rounded-lg shadow-xl p-4 border border-gray-200">
              <button
                onClick={() => setShowProactive(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-sm text-gray-700 pr-6">{config.proactiveMessage}</p>
              <button
                onClick={handleProactiveClick}
                className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Chat Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-4 ${positionClasses} z-50 w-full max-w-sm h-[600px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 mx-4`}
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                  {config.theme.agentName[0]}
                </div>
                <div>
                  <div className="font-semibold">{config.theme.agentName}</div>
                  <div className="text-xs text-blue-100">Typically replies instantly</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'quick_reply' ? (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {quickReplies.map(reply => (
                        <button
                          key={reply.id}
                          onClick={reply.action}
                          className="px-3 py-2 border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                        >
                          {reply.text}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage(inputValue)
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Chat */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMinimized(false)}
            className={`fixed bottom-4 ${positionClasses} z-50 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Chat with {config.theme.agentName}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
