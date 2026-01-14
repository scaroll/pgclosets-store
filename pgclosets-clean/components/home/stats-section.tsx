'use client'

import { useEffect, useState, useRef } from 'react'
import { TrendingUp, Users, Award, Clock } from 'lucide-react'

interface Stat {
  id: string
  icon: any
  value: number
  label: string
  suffix: string
  description: string
  color: string
}

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({})
  const sectionRef = useRef<HTMLElement>(null)

  const stats: Stat[] = [
    {
      id: 'customers',
      icon: Users,
      value: 2000,
      label: 'Happy Customers',
      suffix: '+',
      description: 'Satisfied homeowners across Ottawa',
      color: 'text-blue-600'
    },
    {
      id: 'years',
      icon: Award,
      value: 14,
      label: 'Years Experience',
      suffix: '+',
      description: 'Serving Ottawa since 2010',
      color: 'text-green-600'
    },
    {
      id: 'installations',
      icon: TrendingUp,
      value: 3500,
      label: 'Installations',
      suffix: '+',
      description: 'Professional door installations completed',
      color: 'text-purple-600'
    },
    {
      id: 'response',
      icon: Clock,
      value: 24,
      label: 'Hour Response',
      suffix: 'h',
      description: 'Average quote response time',
      color: 'text-orange-600'
    }
  ]

  // Intersection Observer for triggering animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.3,
        rootMargin: '-50px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Animate numbers when visible
  useEffect(() => {
    if (!isVisible) return

    const animateValue = (stat: Stat) => {
      const startTime = Date.now()
      const duration = 2000 + Math.random() * 1000 // 2-3 seconds

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = Math.floor(stat.value * easeOutQuart)

        setAnimatedValues(prev => ({
          ...prev,
          [stat.id]: currentValue
        }))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }

    // Stagger animations
    stats.forEach((stat, index) => {
      setTimeout(() => animateValue(stat), index * 200)
    })
  }, [isVisible])

  const formatNumber = (value: number, suffix: string) => {
    if (suffix === 'h') {
      return `${value}${suffix}`
    }

    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k${suffix}`
    }

    return `${value}${suffix}`
  }

  return (
    <section ref={sectionRef} className="section-dense bg-white">
      <div className="container-apple">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const animatedValue = animatedValues[stat.id] || 0

            return (
              <div
                key={stat.id}
                className="text-center group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-4 ${stat.color} bg-current/10 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>

                {/* Value */}
                <div className="mb-2">
                  <div className="text-3xl lg:text-4xl font-bold text-pg-navy">
                    {formatNumber(animatedValue, stat.suffix)}
                  </div>
                </div>

                {/* Label */}
                <h3 className="text-base lg:text-lg font-semibold text-pg-navy mb-1">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-pg-gray leading-relaxed">
                  {stat.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-16 pt-12 border-t border-pg-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

            <div className="group">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors duration-200">
                <span className="text-green-600 font-bold text-lg">✓</span>
              </div>
              <h4 className="font-semibold text-pg-navy mb-1">Licensed & Insured</h4>
              <p className="text-sm text-pg-gray">Fully licensed contractors with comprehensive insurance coverage</p>
            </div>

            <div className="group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors duration-200">
                <span className="text-blue-600 font-bold text-lg">★</span>
              </div>
              <h4 className="font-semibold text-pg-navy mb-1">5-Star Rating</h4>
              <p className="text-sm text-pg-gray">Consistently rated 5 stars across Google, Facebook, and BBB</p>
            </div>

            <div className="group">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors duration-200">
                <span className="text-purple-600 font-bold text-lg">∞</span>
              </div>
              <h4 className="font-semibold text-pg-navy mb-1">Lifetime Warranty</h4>
              <p className="text-sm text-pg-gray">All products and installations backed by our lifetime warranty</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection