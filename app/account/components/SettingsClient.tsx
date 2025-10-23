'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Bell, Shield, Globe, Moon, Sun, Monitor, Smartphone, Mail, Phone, CreditCard, Package, ChevronRight, Save, Trash2, AlertTriangle, Check, Eye, EyeOff, Lock, Key, LogOut, Download, Trash, Database, Wifi } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface Settings {
  notifications: {
    email: {
      orders: boolean
      promotions: boolean
      newsletter: boolean
      accountUpdates: boolean
      securityAlerts: boolean
    }
    sms: {
      deliveryUpdates: boolean
      appointmentReminders: boolean
      promotions: boolean
    }
    push: {
      newProducts: boolean
      sales: boolean
      orderUpdates: boolean
    }
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends'
    showOnlineStatus: boolean
    allowDataCollection: boolean
    personalizedAds: boolean
    sharePurchaseHistory: boolean
  }
  preferences: {
    language: string
    timezone: string
    currency: string
    theme: 'light' | 'dark' | 'system'
    dateFormat: string
    units: 'metric' | 'imperial'
  }
  security: {
    twoFactorEnabled: boolean
    sessionTimeout: number
    loginAlerts: boolean
    passwordResetRequired: boolean
    activeSessions: Array<{
      id: string
      device: string
      location: string
      lastActive: string
      current: boolean
    }>
  }
  communication: {
    preferredContact: 'email' | 'phone' | 'sms'
    marketingConsent: boolean
    surveyParticipation: boolean
    betaFeatures: boolean
  }
}

export function SettingsClient({ user }: { user: User }) {
  const { toast } = useToast()
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: {
        orders: true,
        promotions: false,
        newsletter: true,
        accountUpdates: true,
        securityAlerts: true
      },
      sms: {
        deliveryUpdates: true,
        appointmentReminders: true,
        promotions: false
      },
      push: {
        newProducts: true,
        sales: true,
        orderUpdates: true
      }
    },
    privacy: {
      profileVisibility: 'private',
      showOnlineStatus: false,
      allowDataCollection: false,
      personalizedAds: false,
      sharePurchaseHistory: false
    },
    preferences: {
      language: 'English',
      timezone: 'Eastern Time (ET)',
      currency: 'CAD',
      theme: 'system',
      dateFormat: 'MM/DD/YYYY',
      units: 'metric'
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      loginAlerts: true,
      passwordResetRequired: false,
      activeSessions: [
        {
          id: '1',
          device: 'Chrome on MacBook Pro',
          location: 'Ottawa, ON',
          lastActive: '2024-10-20T10:30:00Z',
          current: true
        },
        {
          id: '2',
          device: 'Safari on iPhone 14',
          location: 'Ottawa, ON',
          lastActive: '2024-10-19T18:45:00Z',
          current: false
        }
      ]
    },
    communication: {
      preferredContact: 'email',
      marketingConsent: false,
      surveyParticipation: true,
      betaFeatures: false
    }
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 500))
      // Settings are already set with default values
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: "Error loading settings",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your new password matches the confirmation.",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Your password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error changing password",
        description: "Please check your current password and try again.",
        variant: "destructive",
      })
    }
  }

  const handleEnable2FA = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSettings(prev => ({
        ...prev,
        security: {
          ...prev.security,
          twoFactorEnabled: true
        }
      }))

      toast({
        title: "Two-factor authentication enabled",
        description: "Your account is now more secure.",
      })
    } catch (error) {
      toast({
        title: "Error enabling 2FA",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleDisable2FA = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSettings(prev => ({
        ...prev,
        security: {
          ...prev.security,
          twoFactorEnabled: false
        }
      }))

      toast({
        title: "Two-factor authentication disabled",
        description: "You may want to consider keeping 2FA enabled for security.",
      })
    } catch (error) {
      toast({
        title: "Error disabling 2FA",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSettings(prev => ({
        ...prev,
        security: {
          ...prev.security,
          activeSessions: prev.security.activeSessions.filter(s => s.id !== sessionId)
        }
      }))

      toast({
        title: "Session revoked",
        description: "The session has been successfully revoked.",
      })
    } catch (error) {
      toast({
        title: "Error revoking session",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleExportData = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Data export started",
        description: "You'll receive an email with your data download link shortly.",
      })
    } catch (error) {
      toast({
        title: "Error exporting data",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Redirect to home page after account deletion
      window.location.href = '/'
    } catch (error) {
      toast({
        title: "Error deleting account",
        description: "Please contact support for assistance.",
        variant: "destructive",
      })
    }
  }

  const updateSetting = (category: keyof Settings, subcategory: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: value
      }
    }))
  }

  const updateNestedSetting = (category: keyof Settings, subcategory: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: {
          ...prev[category][subcategory as keyof typeof prev[category]],
          [field]: value
        }
      }
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 h-96 bg-gray-200 rounded-lg"></div>
              <div className="lg:col-span-3 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/account">
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                  Back to Account
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your account preferences and security</p>
              </div>
            </div>
            <Button onClick={handleSaveSettings} disabled={saving}>
              {saving ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-0">
                <nav className="space-y-1">
                  <Tabs defaultValue="notifications" orientation="vertical" className="w-full">
                    <TabsList className="h-auto p-0 bg-transparent space-y-1">
                      <TabsTrigger value="notifications" className="w-full justify-start p-3 text-left hover:bg-gray-50">
                        <Bell className="h-4 w-4 mr-3" />
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger value="privacy" className="w-full justify-start p-3 text-left hover:bg-gray-50">
                        <Shield className="h-4 w-4 mr-3" />
                        Privacy
                      </TabsTrigger>
                      <TabsTrigger value="preferences" className="w-full justify-start p-3 text-left hover:bg-gray-50">
                        <Globe className="h-4 w-4 mr-3" />
                        Preferences
                      </TabsTrigger>
                      <TabsTrigger value="security" className="w-full justify-start p-3 text-left hover:bg-gray-50">
                        <Lock className="h-4 w-4 mr-3" />
                        Security
                      </TabsTrigger>
                      <TabsTrigger value="communication" className="w-full justify-start p-3 text-left hover:bg-gray-50">
                        <Mail className="h-4 w-4 mr-3" />
                        Communication
                      </TabsTrigger>
                      <TabsTrigger value="data" className="w-full justify-start p-3 text-left hover:bg-gray-50">
                        <Database className="h-4 w-4 mr-3" />
                        Data & Account
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="notifications" className="space-y-6">
              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Notifications
                    </CardTitle>
                    <CardDescription>
                      Choose which email notifications you'd like to receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="email-orders">Order Updates</Label>
                        <p className="text-sm text-gray-600">Get notified about order status changes</p>
                      </div>
                      <Switch
                        id="email-orders"
                        checked={settings.notifications.email.orders}
                        onCheckedChange={(checked) => updateNestedSetting('notifications', 'email', 'orders', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="email-promotions">Promotions & Deals</Label>
                        <p className="text-sm text-gray-600">Receive exclusive offers and discounts</p>
                      </div>
                      <Switch
                        id="email-promotions"
                        checked={settings.notifications.email.promotions}
                        onCheckedChange={(checked) => updateNestedSetting('notifications', 'email', 'promotions', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="email-newsletter">Newsletter</Label>
                        <p className="text-sm text-gray-600">Monthly updates and design inspiration</p>
                      </div>
                      <Switch
                        id="email-newsletter"
                        checked={settings.notifications.email.newsletter}
                        onCheckedChange={(checked) => updateNestedSetting('notifications', 'email', 'newsletter', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="email-account">Account Updates</Label>
                        <p className="text-sm text-gray-600">Important account and security notifications</p>
                      </div>
                      <Switch
                        id="email-account"
                        checked={settings.notifications.email.accountUpdates}
                        onCheckedChange={(checked) => updateNestedSetting('notifications', 'email', 'accountUpdates', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      SMS Notifications
                    </CardTitle>
                    <CardDescription>
                      Get text message updates for important events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="sms-delivery">Delivery Updates</Label>
                        <p className="text-sm text-gray-600">Real-time delivery status updates</p>
                      </div>
                      <Switch
                        id="sms-delivery"
                        checked={settings.notifications.sms.deliveryUpdates}
                        onCheckedChange={(checked) => updateNestedSetting('notifications', 'sms', 'deliveryUpdates', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="sms-appointments">Appointment Reminders</Label>
                        <p className="text-sm text-gray-600">Reminders for consultations and installations</p>
                      </div>
                      <Switch
                        id="sms-appointments"
                        checked={settings.notifications.sms.appointmentReminders}
                        onCheckedChange={(checked) => updateNestedSetting('notifications', 'sms', 'appointmentReminders', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="sms-promotions">Promotional SMS</Label>
                        <p className="text-sm text-gray-600">Limited-time offers via text message</p>
                      </div>
                      <Switch
                        id="sms-promotions"
                        checked={settings.notifications.sms.promotions}
                        onCheckedChange={(checked) => updateNestedSetting('notifications', 'sms', 'promotions', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Control your privacy and data sharing preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-visibility">Profile Visibility</Label>
                      <Select
                        value={settings.privacy.profileVisibility}
                        onValueChange={(value: 'public' | 'private' | 'friends') => updateNestedSetting('privacy', 'profileVisibility', value, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                          <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                          <SelectItem value="friends">Friends - Only connected users can see your profile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="show-online">Show Online Status</Label>
                        <p className="text-sm text-gray-600">Let others see when you're online</p>
                      </div>
                      <Switch
                        id="show-online"
                        checked={settings.privacy.showOnlineStatus}
                        onCheckedChange={(checked) => updateNestedSetting('privacy', 'showOnlineStatus', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="data-collection">Allow Data Collection</Label>
                        <p className="text-sm text-gray-600">Help us improve our services with usage data</p>
                      </div>
                      <Switch
                        id="data-collection"
                        checked={settings.privacy.allowDataCollection}
                        onCheckedChange={(checked) => updateNestedSetting('privacy', 'allowDataCollection', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="personalized-ads">Personalized Advertising</Label>
                        <p className="text-sm text-gray-600">See ads based on your interests and purchases</p>
                      </div>
                      <Switch
                        id="personalized-ads"
                        checked={settings.privacy.personalizedAds}
                        onCheckedChange={(checked) => updateNestedSetting('privacy', 'personalizedAds', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="share-history">Share Purchase History</Label>
                        <p className="text-sm text-gray-600">Allow us to use your purchase history for recommendations</p>
                      </div>
                      <Switch
                        id="share-history"
                        checked={settings.privacy.sharePurchaseHistory}
                        onCheckedChange={(checked) => updateNestedSetting('privacy', 'sharePurchaseHistory', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance & Display</CardTitle>
                    <CardDescription>
                      Customize how the site looks and feels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={settings.preferences.theme}
                        onValueChange={(value: 'light' | 'dark' | 'system') => updateNestedSetting('preferences', 'theme', value, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System Default</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={settings.preferences.language}
                        onValueChange={(value) => updateNestedSetting('preferences', 'language', value, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="French">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={settings.preferences.timezone}
                        onValueChange={(value) => updateNestedSetting('preferences', 'timezone', value, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Eastern Time (ET)">Eastern Time (ET)</SelectItem>
                          <SelectItem value="Central Time (CT)">Central Time (CT)</SelectItem>
                          <SelectItem value="Mountain Time (MT)">Mountain Time (MT)</SelectItem>
                          <SelectItem value="Pacific Time (PT)">Pacific Time (PT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={settings.preferences.currency}
                        onValueChange={(value) => updateNestedSetting('preferences', 'currency', value, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select
                        value={settings.preferences.dateFormat}
                        onValueChange={(value) => updateNestedSetting('preferences', 'dateFormat', value, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="units">Measurement Units</Label>
                      <Select
                        value={settings.preferences.units}
                        onValueChange={(value: 'metric' | 'imperial') => updateNestedSetting('preferences', 'units', value, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="metric">Metric (cm, m)</SelectItem>
                          <SelectItem value="imperial">Imperial (in, ft)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                    </div>

                    <Button onClick={handlePasswordChange} className="w-full">
                      <Lock className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          {settings.security.twoFactorEnabled && (
                            <Badge className="bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" />
                              Enabled
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {settings.security.twoFactorEnabled
                            ? "Your account is protected with 2FA"
                            : "Require a verification code when signing in"}
                        </p>
                      </div>
                      <Button
                        variant={settings.security.twoFactorEnabled ? "outline" : "default"}
                        onClick={settings.security.twoFactorEnabled ? handleDisable2FA : handleEnable2FA}
                      >
                        {settings.security.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>
                      Manage devices that are currently signed in to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {settings.security.activeSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Smartphone className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">{session.device}</p>
                              <p className="text-sm text-gray-600">{session.location}</p>
                              <p className="text-xs text-gray-500">
                                Last active: {new Date(session.lastActive).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {session.current && (
                              <Badge variant="outline">Current Session</Badge>
                            )}
                            {!session.current && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRevokeSession(session.id)}
                              >
                                Revoke
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Communication Tab */}
              <TabsContent value="communication" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Communication Preferences</CardTitle>
                    <CardDescription>
                      How we should contact you and what you're interested in
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferred-contact">Preferred Contact Method</Label>
                      <Select
                        value={settings.communication.preferredContact}
                        onValueChange={(value: 'email' | 'phone' | 'sms') => updateNestedSetting('communication', 'preferredContact', value, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="marketing-consent">Marketing Communications</Label>
                        <p className="text-sm text-gray-600">Receive marketing materials and promotional offers</p>
                      </div>
                      <Switch
                        id="marketing-consent"
                        checked={settings.communication.marketingConsent}
                        onCheckedChange={(checked) => updateNestedSetting('communication', 'marketingConsent', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="survey-participation">Surveys & Feedback</Label>
                        <p className="text-sm text-gray-600">Help us improve by participating in surveys</p>
                      </div>
                      <Switch
                        id="survey-participation"
                        checked={settings.communication.surveyParticipation}
                        onCheckedChange={(checked) => updateNestedSetting('communication', 'surveyParticipation', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="beta-features">Beta Features</Label>
                        <p className="text-sm text-gray-600">Get early access to new features and updates</p>
                      </div>
                      <Switch
                        id="beta-features"
                        checked={settings.communication.betaFeatures}
                        onCheckedChange={(checked) => updateNestedSetting('communication', 'betaFeatures', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data & Account Tab */}
              <TabsContent value="data" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>
                      Download your data or manage your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Download className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">Export Your Data</h4>
                          <p className="text-sm text-gray-600">Download a copy of your personal data</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={handleExportData}>
                        Request Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    <CardDescription>
                      Irreversible actions that affect your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div>
                          <h4 className="font-medium text-red-900">Delete Account</h4>
                          <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                        </div>
                      </div>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}