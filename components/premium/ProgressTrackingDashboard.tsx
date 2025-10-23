"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  DollarSign,
  Package,
  Calendar,
  Download,
  Share2,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Target,
  Award,
  Zap,
  Activity,
  PieChart,
  LineChart,
  Timer,
  Flag,
  ChevronRight,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

interface ProjectMilestone {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'delayed'
  progress: number
  dueDate: Date
  completedDate?: Date
  assignee?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  dependencies?: string[]
}

interface ProjectProgress {
  id: string
  name: string
  description: string
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold'
  progress: number
  startDate: Date
  endDate: Date
  milestones: ProjectMilestone[]
  budget: number
  spent: number
  team: TeamMember[]
  client: string
  category: string
  priority: 'low' | 'medium' | 'high'
}

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  availability: 'available' | 'busy' | 'offline'
}

interface ProgressMetric {
  label: string
  value: number | string
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  color: string
}

interface ProgressTrackingDashboardProps {
  projects: ProjectProgress[]
  teamMembers: TeamMember[]
  refreshInterval?: number
  enableRealTime?: boolean
  showAnalytics?: boolean
  allowExport?: boolean
  onProjectUpdate?: (project: ProjectProgress) => void
  className?: string
}

export const ProgressTrackingDashboard: React.FC<ProgressTrackingDashboardProps> = ({
  projects,
  teamMembers,
  refreshInterval = 30000,
  enableRealTime = true,
  showAnalytics = true,
  allowExport = true,
  onProjectUpdate,
  className
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectProgress | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  // Auto-refresh effect
  useEffect(() => {
    if (enableRealTime) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 1000)
      }, refreshInterval)

      return () => clearInterval(interval)
    }
  }, [enableRealTime, refreshInterval])

  // Calculate overall metrics
  const calculateMetrics = (): ProgressMetric[] => {
    const activeProjects = projects.filter(p => p.status === 'in-progress')
    const completedProjects = projects.filter(p => p.status === 'completed')
    const delayedProjects = projects.filter(p =>
      p.milestones.some(m => m.status === 'delayed')
    )
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
    const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)
    const averageProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length

    return [
      {
        label: 'Active Projects',
        value: activeProjects.length,
        change: 2,
        trend: 'up',
        icon: <Activity className="h-5 w-5" />,
        color: 'blue'
      },
      {
        label: 'Completed',
        value: completedProjects.length,
        change: 1,
        trend: 'up',
        icon: <CheckCircle className="h-5 w-5" />,
        color: 'green'
      },
      {
        label: 'Delayed',
        value: delayedProjects.length,
        change: -1,
        trend: 'down',
        icon: <AlertCircle className="h-5 w-5" />,
        color: 'red'
      },
      {
        label: 'Budget Used',
        value: `${Math.round((totalSpent / totalBudget) * 100)}%`,
        change: 5,
        trend: 'up',
        icon: <DollarSign className="h-5 w-5" />,
        color: 'purple'
      },
      {
        label: 'Team Utilization',
        value: '78%',
        change: 3,
        trend: 'up',
        icon: <Users className="h-5 w-5" />,
        color: 'orange'
      },
      {
        label: 'Avg Progress',
        value: `${Math.round(averageProgress)}%`,
        change: 8,
        trend: 'up',
        icon: <Target className="h-5 w-5" />,
        color: 'teal'
      }
    ]
  }

  // Filter projects
  const filteredProjects = projects.filter(project => {
    if (filterStatus === 'all') return true
    return project.status === filterStatus
  })

  // Get status color
  const getStatusColor = (status: string) => {
    const colors = {
      'planning': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'review': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'on-hold': 'bg-gray-100 text-gray-800',
      'delayed': 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'border-gray-300',
      'medium': 'border-yellow-300',
      'high': 'border-orange-400',
      'critical': 'border-red-500'
    }
    return colors[priority as keyof typeof colors] || 'border-gray-300'
  }

  // Export data
  const exportData = () => {
    const data = {
      projects,
      metrics: calculateMetrics(),
      exportDate: new Date().toISOString(),
      timeRange
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `progress-dashboard-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const metrics = calculateMetrics()

  return (
    <div className={`w-full max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress Dashboard</h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
            {enableRealTime && (
              <span className="flex items-center gap-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLoading(!isLoading)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {allowExport && (
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                    {metric.icon}
                  </div>
                  {metric.change !== undefined && (
                    <div className={`flex items-center text-sm ${
                      metric.trend === 'up' ? 'text-green-600' :
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.trend === 'up' ? <ArrowUp className="h-3 w-3" /> :
                       metric.trend === 'down' ? <ArrowDown className="h-3 w-3" /> :
                       <Minus className="h-3 w-3" />}
                      {Math.abs(metric.change)}%
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium mr-2">Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">All Projects</option>
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mr-2">Time Range:</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedProject?.id === project.id ? 'border-primary bg-primary/5' : ''
                      } ${getPriorityColor(project.priority)}`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{project.client}</p>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Budget</p>
                            <p className="font-medium">${project.budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Spent</p>
                            <p className="font-medium">${project.spent.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Due Date</p>
                            <p className="font-medium">{project.endDate.toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {project.team.slice(0, 3).map((member) => (
                              <img
                                key={member.id}
                                src={member.avatar}
                                alt={member.name}
                                className="w-8 h-8 rounded-full border-2 border-background"
                              />
                            ))}
                            {project.team.length > 3 && (
                              <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs">
                                +{project.team.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Flag className={`h-4 w-4 ${
                              project.priority === 'critical' ? 'text-red-500' :
                              project.priority === 'high' ? 'text-orange-500' :
                              project.priority === 'medium' ? 'text-yellow-500' :
                              'text-gray-500'
                            }`} />
                            <span className="text-xs capitalize">{project.priority}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Details */}
        <div className="space-y-4">
          {selectedProject ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{selectedProject.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Description</p>
                      <p className="text-sm">{selectedProject.description}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Milestones</p>
                      <div className="space-y-2">
                        {selectedProject.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center gap-3 p-2 bg-muted rounded">
                            <div className={`w-2 h-2 rounded-full ${
                              milestone.status === 'completed' ? 'bg-green-500' :
                              milestone.status === 'in-progress' ? 'bg-yellow-500' :
                              milestone.status === 'delayed' ? 'bg-red-500' :
                              'bg-gray-300'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{milestone.title}</p>
                              <p className="text-xs text-muted-foreground">{milestone.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {milestone.progress}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teamMembers.slice(0, 5).map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          member.availability === 'available' ? 'bg-green-500' :
                          member.availability === 'busy' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">Select a Project</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a project from the list to view detailed information
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProgressTrackingDashboard