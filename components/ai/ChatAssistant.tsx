"use client";

import { useState } from 'react';
import { useChat } from 'ai/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResponsiveBreakpoints } from '@/hooks/use-responsive-breakpoints';

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useResponsiveBreakpoints();
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <>
      {/* Apple-inspired Chat Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 group",
          "w-14 h-14 lg:w-16 lg:h-16 rounded-full",
          "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-apple-xl",
          "flex items-center justify-center",
          "hover:shadow-apple-modal transition-all duration-300",
          "backdrop-blur-apple bg-opacity-90",
          isOpen && "hidden"
        )}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Ask AI assistant"
      >
        <Bot className="w-6 h-6 lg:w-7 lg:h-7" />
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Apple-inspired Modal Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-apple z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Modal */}
            <motion.div
              className={cn(
                "fixed z-50 bg-apple-gray-50 rounded-apple-2xl shadow-apple-modal border border-apple-gray-200 flex flex-col overflow-hidden",
                isMobile
                  ? "inset-4 max-h-[80vh]"
                  : "bottom-6 right-6 w-full max-w-md h-[600px]"
              )}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 0.8
              }}
            >
              {/* Premium Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sm:p-6 flex items-center justify-between relative overflow-hidden">
                {/* Animated background elements */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                      "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />

                <div className="flex items-center gap-3 relative z-10">
                  <motion.div
                    className="w-10 h-10 bg-white/20 backdrop-blur-apple rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Bot className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">AI Design Assistant</h3>
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-2 h-2 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <p className="text-xs text-white/80">Online & ready to help</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"
                  aria-label="Close chat"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

            {/* Apple-inspired Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8 space-y-6"
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto shadow-apple-sm"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                  >
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </motion.div>

                  <div className="space-y-3">
                    <h4 className="text-lg sm:text-xl font-semibold text-apple-gray-900">
                      Welcome to PG Closets AI
                    </h4>
                    <p className="text-sm text-apple-gray-600 max-w-xs mx-auto leading-relaxed">
                      Your personal design assistant for premium closet solutions. Ask me anything about products, design, or scheduling!
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 max-w-sm mx-auto">
                    <motion.button
                      onClick={() => {
                        handleInputChange({
                          target: { value: "What types of closet doors do you offer?" }
                        } as any);
                      }}
                      className="px-4 py-3 text-sm bg-apple-gray-100 hover:bg-apple-gray-200 rounded-apple-lg transition-all duration-200 text-left hover:shadow-apple-sm group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">
                        What types of closet doors do you offer?
                      </span>
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        handleInputChange({
                          target: { value: "How do I schedule a consultation?" }
                        } as any);
                      }}
                      className="px-4 py-3 text-sm bg-apple-gray-100 hover:bg-apple-gray-200 rounded-apple-lg transition-all duration-200 text-left hover:shadow-apple-sm group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">
                        How do I schedule a consultation?
                      </span>
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        handleInputChange({
                          target: { value: "What areas do you serve?" }
                        } as any);
                      }}
                      className="px-4 py-3 text-sm bg-apple-gray-100 hover:bg-apple-gray-200 rounded-apple-lg transition-all duration-200 text-left hover:shadow-apple-sm group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">
                        What areas do you serve?
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Message Display */}
              {messages.map((message: any) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-apple-sm"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Bot className="w-4 h-4 text-white" />
                    </motion.div>
                  )}

                  <motion.div
                    className={cn(
                      "max-w-[80%] rounded-apple-2xl px-4 py-3 shadow-apple-sm",
                      message.role === 'user'
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "bg-apple-gray-100 text-apple-gray-900 border border-apple-gray-200"
                    )}
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </motion.div>
                </motion.div>
              ))}

              {/* Enhanced Loading State */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <motion.div
                    className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-apple-sm"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </motion.div>
                  <div className="bg-apple-gray-100 rounded-apple-2xl px-4 py-3 border border-apple-gray-200 shadow-apple-sm">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-apple-gray-400 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-apple-gray-400 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-apple-gray-400 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Apple-inspired Input Area */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 bg-apple-gray-50 border-t border-apple-gray-200">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about closet doors, design ideas..."
                  className="flex-1 bg-white border-apple-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-apple-xl text-sm h-12 shadow-apple-sm"
                  disabled={isLoading}
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="h-12 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-apple-xl shadow-apple-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
