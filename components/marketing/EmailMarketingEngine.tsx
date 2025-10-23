"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Mail,
  Gift,
  Star,
  ShoppingCart,
  Calendar,
  Users,
  Send,
  CheckCircle,
  TrendingUp,
  Zap,
  Clock,
  Award,
  Package
} from "lucide-react"

interface EmailCampaign {
  id: string
  name: string
  type: 'welcome' | 'abandoned_cart' | 'post_purchase' | 're_engagement' | 'newsletter' | 'promotional' | 'birthday' | 'review_request'
  trigger: string
  subject: string
  template: string
  isActive: boolean
  metrics: {
    sent: number
    opened: number
    clicked: number
    converted: number
    revenue: number
  }
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  preview: string
  content: string
  variables: string[]
}

const EMAIL_CAMPAIGNS: EmailCampaign[] = [
  {
    id: 'welcome_series',
    name: 'Welcome Series',
    type: 'welcome',
    trigger: 'New subscriber signup',
    subject: 'Welcome to PG Closets - Transform Your Space!',
    template: 'welcome',
    isActive: true,
    metrics: { sent: 1247, opened: 892, clicked: 267, converted: 89, revenue: 45670 }
  },
  {
    id: 'abandoned_cart_recovery',
    name: 'Abandoned Cart Recovery',
    type: 'abandoned_cart',
    trigger: 'Cart abandoned > 2 hours',
    subject: 'Your Dream Closet is Waiting - Complete Your Order',
    template: 'abandoned_cart',
    isActive: true,
    metrics: { sent: 456, opened: 312, clicked: 89, converted: 23, revenue: 12450 }
  },
  {
    id: 'post_purchase_followup',
    name: 'Post-Purchase Follow-up',
    type: 'post_purchase',
    trigger: '7 days after purchase',
    subject: 'How\'s Your New Custom Closet Working Out?',
    template: 'post_purchase',
    isActive: true,
    metrics: { sent: 234, opened: 198, clicked: 67, converted: 12, revenue: 8900 }
  },
  {
    id: 're_engagement_campaign',
    name: 'Re-engagement Campaign',
    type: 're_engagement',
    trigger: 'No activity > 30 days',
    subject: 'We Miss You! Here\'s 15% Off Your Next Order',
    template: 're_engagement',
    isActive: true,
    metrics: { sent: 892, opened: 445, clicked: 123, converted: 34, revenue: 15600 }
  },
  {
    id: 'weekly_newsletter',
    name: 'Weekly Newsletter',
    type: 'newsletter',
    trigger: 'Weekly schedule',
    subject: 'This Week\'s Closet Design Inspiration',
    template: 'newsletter',
    isActive: true,
    metrics: { sent: 2341, opened: 1456, clicked: 345, converted: 45, revenue: 23400 }
  },
  {
    id: 'seasonal_promotion',
    name: 'Seasonal Promotion',
    type: 'promotional',
    trigger: 'Seasonal campaign',
    subject: 'Spring Storage Solutions - Up to 20% Off',
    template: 'promotional',
    isActive: true,
    metrics: { sent: 3456, opened: 2341, clicked: 567, converted: 123, revenue: 67800 }
  },
  {
    id: 'birthday_rewards',
    name: 'Birthday Rewards',
    type: 'birthday',
    trigger: 'Customer birthday',
    subject: 'Happy Birthday from PG Closets! A Gift For You',
    template: 'birthday',
    isActive: true,
    metrics: { sent: 234, opened: 201, clicked: 89, converted: 23, revenue: 12300 }
  },
  {
    id: 'review_request',
    name: 'Review Request',
    type: 'review_request',
    trigger: '21 days after installation',
    subject: 'Share Your Experience & Get a Gift',
    template: 'review_request',
    isActive: true,
    metrics: { sent: 123, opened: 98, clicked: 45, converted: 12, revenue: 3450 }
  }
]

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Series',
    subject: 'Welcome to PG Closets - Your Custom Storage Journey Begins!',
    preview: 'Thank you for joining us! Here\'s your exclusive welcome offer...',
    content: 'welcome_template_content',
    variables: ['first_name', 'welcome_discount', 'expiry_date']
  },
  {
    id: 'abandoned_cart',
    name: 'Abandoned Cart Recovery',
    subject: 'Your Custom Closet is Waiting - Complete Your Order',
    preview: 'Don\'t miss out on your perfect storage solution...',
    content: 'abandoned_cart_template_content',
    variables: ['first_name', 'cart_items', 'total_value', 'recovery_discount']
  },
  {
    id: 'post_purchase',
    name: 'Post-Purchase Follow-up',
    subject: 'How\'s Your New Custom Closet Working Out?',
    preview: 'We hope you\'re loving your new storage solution...',
    content: 'post_purchase_template_content',
    variables: ['first_name', 'product_name', 'installation_date', 'care_tips']
  }
]

export default function EmailMarketingEngine() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(EMAIL_CAMPAIGNS)
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null)
  const [emailList, setEmailList] = useState({
    total: 12456,
    active: 8934,
    engaged: 5678,
    newThisMonth: 1247
  })
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [email, setEmail] = useState('')
  const [preferences, setPreferences] = useState({
    newsletter: true,
    promotions: true,
    design_tips: true,
    exclusive_offers: false
  })

  // Show email capture popup after 10 seconds
  useEffect(() => {
    const hasSubscribed = localStorage.getItem('email-subscribed')
    const dismissedCount = parseInt(localStorage.getItem('email-popup-dismissed') || '0')

    if (!hasSubscribed && dismissedCount < 3) {
      const timer = setTimeout(() => {
        setShowEmailCapture(true)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Send to email service
      localStorage.setItem('email-subscribed', 'true')
      localStorage.setItem('email-preferences', JSON.stringify(preferences))
      setShowEmailCapture(false)

      // Track subscription
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'email_subscribe', {
          event_category: 'Email Marketing',
          custom_preferences: preferences
        })
      }
    }
  }

  const handleDismiss = () => {
    const dismissedCount = parseInt(localStorage.getItem('email-popup-dismissed') || '0')
    localStorage.setItem('email-popup-dismissed', (dismissedCount + 1).toString())
    setShowEmailCapture(false)
  }

  const toggleCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign =>
      campaign.id === campaignId
        ? { ...campaign, isActive: !campaign.isActive }
        : campaign
    ))
  }

  const calculateOpenRate = (campaign: EmailCampaign) => {
    return campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : '0'
  }

  const calculateCTR = (campaign: EmailCampaign) => {
    return campaign.clicked > 0 ? ((campaign.clicked / campaign.opened) * 100).toFixed(1) : '0'
  }

  const calculateConversionRate = (campaign: EmailCampaign) => {
    return campaign.clicked > 0 ? ((campaign.converted / campaign.clicked) * 100).toFixed(1) : '0'
  }

  return (
    <>
      {/* Email Marketing Dashboard Component */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Email Marketing Engine</h1>
            <p className="text-gray-600 mt-2">Automated email campaigns driving customer engagement and revenue</p>
          </div>
          <Button onClick={() => setShowEmailCapture(true)}>
            <Mail className="w-4 h-4 mr-2" />
            Test Email Capture
          </Button>
        </div>

        {/* Email List Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                  <p className="text-2xl font-bold">{emailList.total.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">+{emailList.newThisMonth} this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                  <p className="text-2xl font-bold">{emailList.active.toLocaleString()}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">{((emailList.active / emailList.total) * 100).toFixed(1)}% engagement</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Open Rate</p>
                  <p className="text-2xl font-bold">42.3%</p>
                </div>
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">+3.2% vs last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold">$189K</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">+$45K this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${campaign.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div>
                          <h4 className="font-semibold">{campaign.name}</h4>
                          <p className="text-sm text-gray-600">{campaign.trigger}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCampaign(campaign.id)}
                      >
                        {campaign.isActive ? 'Pause' : 'Activate'}
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{campaign.sent}</div>
                        <div className="text-gray-500">Sent</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{calculateOpenRate(campaign)}%</div>
                        <div className="text-gray-500">Open</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{calculateCTR(campaign)}%</div>
                        <div className="text-gray-500">CTR</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">${(campaign.revenue / 1000).toFixed(1)}K</div>
                        <div className="text-gray-500">Revenue</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top Performing Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map((campaign, index) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-gray-600">
                            {calculateOpenRate(campaign)}% open • {calculateConversionRate(campaign)}% conversion
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(campaign.revenue / 1000).toFixed(1)}K</p>
                        <p className="text-sm text-gray-600">Revenue</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email Capture Popup */}
      {showEmailCapture && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full relative">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>

            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Get Exclusive Design Tips & Offers</h3>
                <p className="text-gray-600 text-sm">
                  Join 12,000+ homeowners getting the latest in custom storage solutions
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">What interests you most?</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="newsletter"
                        checked={preferences.newsletter}
                        onCheckedChange={(checked) =>
                          setPreferences(prev => ({ ...prev, newsletter: checked as boolean }))
                        }
                      />
                      <label htmlFor="newsletter" className="text-sm">Weekly design inspiration</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="promotions"
                        checked={preferences.promotions}
                        onCheckedChange={(checked) =>
                          setPreferences(prev => ({ ...prev, promotions: checked as boolean }))
                        }
                      />
                      <label htmlFor="promotions" className="text-sm">Special offers & discounts</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="design_tips"
                        checked={preferences.design_tips}
                        onCheckedChange={(checked) =>
                          setPreferences(prev => ({ ...prev, design_tips: checked as boolean }))
                        }
                      />
                      <label htmlFor="design_tips" className="text-sm">Storage organization tips</label>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Gift className="w-4 h-4 mr-2" />
                  Subscribe & Get 10% Off
                </Button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                Unsubscribe anytime. We respect your privacy.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}