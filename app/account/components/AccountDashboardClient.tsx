'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, MapPin, Package, Heart, Settings, CreditCard, Shield, Star, Clock, TrendingUp, Calendar, ChevronRight, Award, Gift, Zap, Bell, LogOut } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface DashboardStats {
  totalOrders: number
  totalSpent: number
  loyaltyPoints: number
  savedItems: number
  upcomingConsultations: number
  memberSince: string
  memberTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
}

interface RecentOrder {
  id: string
  date: string
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: number
  trackingNumber?: string
}

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export function AccountDashboardClient({ user }: { user: User }) {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
    savedItems: 0,
    upcomingConsultations: 0,
    memberSince: new Date().toLocaleDateString(),
    memberTier: 'Silver'
  })

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchDashboardData = async () => {
      try {
        // Mock data - replace with actual API calls
        setStats({
          totalOrders: 12,
          totalSpent: 4850.00,
          loyaltyPoints: 2450,
          savedItems: 8,
          upcomingConsultations: 2,
          memberSince: 'January 15, 2023',
          memberTier: 'Gold'
        })

        setRecentOrders([
          {
            id: 'ORD-2024-001',
            date: '2024-10-15',
            status: 'delivered',
            total: 1250.00,
            items: 3,
            trackingNumber: '1Z98754321'
          },
          {
            id: 'ORD-2024-002',
            date: '2024-10-10',
            status: 'shipped',
            total: 890.00,
            items: 2,
            trackingNumber: '1Z98754322'
          },
          {
            id: 'ORD-2024-003',
            date: '2024-10-05',
            status: 'processing',
            total: 560.00,
            items: 1
          }
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const quickActions: QuickAction[] = [
    {
      title: 'Book Consultation',
      description: 'Schedule a virtual design consultation',
      icon: <Calendar className="h-5 w-5" />,
      href: '/book',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Browse Products',
      description: 'Explore our premium closet solutions',
      icon: <Package className="h-5 w-5" />,
      href: '/products',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Wishlist',
      description: 'View your saved designs and products',
      icon: <Heart className="h-5 w-5" />,
      href: '/wishlist',
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    {
      title: 'Track Orders',
      description: 'Monitor your order status and deliveries',
      icon: <Clock className="h-5 w-5" />,
      href: '/account/orders',
      color: 'bg-green-500 hover:bg-green-600'
    }
  ]

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'Gold': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
      case 'Silver': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
      case 'Bronze': return 'bg-gradient-to-r from-orange-700 to-orange-900 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getTierProgress = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 25
      case 'Silver': return 50
      case 'Gold': return 75
      case 'Platinum': return 100
      default: return 0
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Account Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.image || ''} alt={user.name || ''} />
                <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user.name || 'Valued Customer'}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <Badge className={cn(getTierColor(stats.memberTier))}>
                    {stats.memberTier} Member
                  </Badge>
                  <span className="text-sm text-gray-500">Member since {stats.memberSince}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/account/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/api/auth/signout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
            <div className="absolute top-0 right-0 h-full w-1 bg-blue-500"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+$1,250 from last month</p>
            </CardContent>
            <div className="absolute top-0 right-0 h-full w-1 bg-green-500"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.loyaltyPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+150 this week</p>
            </CardContent>
            <div className="absolute top-0 right-0 h-full w-1 bg-yellow-500"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.savedItems}</div>
              <p className="text-xs text-muted-foreground">3 on sale now</p>
            </CardContent>
            <div className="absolute top-0 right-0 h-full w-1 bg-pink-500"></div>
          </Card>
        </div>

        {/* Loyalty Progress */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  {stats.memberTier} Status
                </CardTitle>
                <CardDescription>
                  You're {stats.memberTier === 'Platinum' ? 'at the top!' : `${100 - getTierProgress(stats.memberTier)}% away from ${stats.memberTier === 'Bronze' ? 'Silver' : stats.memberTier === 'Silver' ? 'Gold' : stats.memberTier === 'Gold' ? 'Platinum' : 'the next tier'}`}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.loyaltyPoints.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Points</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={getTierProgress(stats.memberTier)} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Bronze</span>
              <span>Silver</span>
              <span>Gold</span>
              <span>Platinum</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Access your most frequently used features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <div className="group relative overflow-hidden rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md hover:border-gray-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-start space-x-3">
                          <div className={cn("p-2 rounded-lg text-white", action.color)}>
                            {action.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your latest purchases and their status</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/account/orders">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{order.id}</h4>
                          <p className="text-sm text-gray-600">{order.date} • {order.items} items</p>
                          {order.trackingNumber && (
                            <p className="text-xs text-blue-600">Tracking: {order.trackingNumber}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">${order.total.toLocaleString()}</div>
                        <Badge className={cn("text-xs", getStatusColor(order.status))}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Consultations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Upcoming Consultations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-blue-900">Design Consultation</h4>
                      <Badge variant="secondary">Tomorrow</Badge>
                    </div>
                    <p className="text-sm text-blue-700">2:00 PM - Virtual Meeting</p>
                    <Button size="sm" variant="outline" className="mt-2 w-full">
                      Join Meeting
                    </Button>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">Measurement Session</h4>
                      <Badge variant="outline">Oct 25</Badge>
                    </div>
                    <p className="text-sm text-gray-600">10:00 AM - In-Home</p>
                    <Button size="sm" variant="ghost" className="mt-2 w-full">
                      Reschedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rewards & Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-500" />
                  Your Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Exclusive Designs</p>
                      <p className="text-xs text-gray-600">Access to limited editions</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Extended Warranty</p>
                      <p className="text-xs text-gray-600">5-year protection plan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Priority Support</p>
                      <p className="text-xs text-gray-600">24/7 dedicated service</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Link href="/account/profile">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">Profile Information</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                  <Link href="/account/addresses">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">Address Book</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                  <Link href="/account/payment-methods">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">Payment Methods</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                  <Link href="/account/settings">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Settings className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">Settings & Preferences</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}