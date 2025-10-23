'use client'

import React, { useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AnimatedCardProps {
  title?: string
  description?: string
  image?: string
  badge?: string
  className?: string
  children: React.ReactNode
  variant?: 'default' | 'tilt' | 'flip' | 'lift' | 'glow' | 'slide' | 'expand'
  height?: 'auto' | 'fixed'
}

export default function AnimatedCard({
  title,
  description,
  image,
  badge,
  className,
  children,
  variant = 'default',
  height = 'auto'
}: AnimatedCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  // For tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(y, { stiffness: 300, damping: 30 })
  const rotateY = useSpring(x, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (variant === 'tilt') {
      const rect = e.currentTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      x.set((e.clientX - centerX) / 10)
      y.set((e.clientY - centerY) / 10)
    }
  }

  const handleMouseLeave = () => {
    if (variant === 'tilt') {
      x.set(0)
      y.set(0)
    }
  }

  const getCardVariants = () => {
    switch (variant) {
      case 'lift':
        return {
          initial: { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' },
          hover: {
            y: -8,
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
          }
        }
      case 'glow':
        return {
          initial: { boxShadow: '0 1px 3px rgba(0,0,0,0.12)' },
          hover: {
            boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
            transition: { duration: 0.3 }
          }
        }
      case 'slide':
        return {
          initial: { x: 0 },
          hover: {
            x: 10,
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
          }
        }
      case 'expand':
        return {
          initial: { scale: 1 },
          hover: {
            scale: 1.02,
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
          }
        }
      default:
        return {
          initial: { scale: 1 },
          hover: {
            scale: 1.02,
            transition: { duration: 0.2 }
          }
        }
    }
  }

  const cardContent = (
    <>
      {image && (
        <div className="relative overflow-hidden">
          <motion.img
            src={image}
            alt={title || 'Card image'}
            className={cn(
              'w-full object-cover',
              height === 'fixed' ? 'h-48' : 'h-64'
            )}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-4 right-4"
            >
              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                {badge}
              </Badge>
            </motion.div>
          )}
        </div>
      )}

      {(title || description) && (
        <CardHeader className={cn(image && 'pb-4')}>
          {title && (
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          )}
          {description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          )}
        </CardHeader>
      )}

      <CardContent className={cn(!title && !description && 'pt-6')}>
        {children}
      </CardContent>
    </>
  )

  if (variant === 'flip') {
    return (
      <div className="relative w-full h-96 perspective-1000">
        <motion.div
          className="relative w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <Card
            className={cn(
              'absolute w-full h-full backface-hidden cursor-pointer',
              className
            )}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {cardContent}
          </Card>

          {/* Back */}
          <motion.div
            className="absolute w-full h-full backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <Card className={cn('w-full h-full', className)}>
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">Back Content</h3>
                  <p className="text-muted-foreground">
                    This is the back of the card with additional information.
                  </p>
                  <Button onClick={() => setIsFlipped(false)}>
                    Flip Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      variants={getCardVariants()}
      initial="initial"
      whileHover="hover"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        variant === 'tilt'
          ? {
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d'
            }
          : {}
      }
      className={cn(
        'cursor-pointer',
        variant === 'glow' && 'border-transparent bg-gradient-to-br from-blue-50 to-purple-50',
        className
      )}
    >
      <Card className={cn(
        'border-0 shadow-lg',
        variant === 'lift' && 'transition-all duration-300',
        variant === 'glow' && 'bg-transparent',
        className
      )}>
        {cardContent}
      </Card>
    </motion.div>
  )
}

// Specialized animated card components
export function FeatureCard({
  icon,
  title,
  description,
  delay = 0
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <AnimatedCard variant="lift" className="text-center">
        <motion.div
          className="text-4xl mb-4 inline-block"
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </AnimatedCard>
    </motion.div>
  )
}

export function TestimonialCard({
  quote,
  author,
  role,
  avatar
}: {
  quote: string
  author: string
  role: string
  avatar?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatedCard variant="glow" className="text-center">
        <div className="space-y-4">
          <div className="text-3xl">"</div>
          <p className="text-lg italic">{quote}</p>
          <div className="flex items-center justify-center gap-3">
            {avatar && (
              <img
                src={avatar}
                alt={author}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div className="text-left">
              <p className="font-semibold">{author}</p>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </motion.div>
  )
}

export function PricingCard({
  title,
  price,
  features,
  highlighted = false,
  cta = 'Get Started'
}: {
  title: string
  price: string
  features: string[]
  highlighted?: boolean
  cta?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatedCard
        variant={highlighted ? 'glow' : 'lift'}
        className={cn(
          'relative',
          highlighted && 'border-primary ring-2 ring-primary/20'
        )}
      >
        {highlighted && (
          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            Most Popular
          </Badge>
        )}
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <div className="text-4xl font-bold text-primary">
            {price}
            <span className="text-lg font-normal text-muted-foreground">/month</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
          <Button
            className={cn(
              'w-full mt-6',
              highlighted && 'bg-primary hover:bg-primary/90'
            )}
            variant={highlighted ? 'default' : 'outline'}
          >
            {cta}
          </Button>
        </CardContent>
      </AnimatedCard>
    </motion.div>
  )
}