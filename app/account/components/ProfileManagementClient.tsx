'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Save, Camera, Shield, Check, X, Edit2, UserPlus, Building, Briefcase } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  company?: string
  jobTitle?: string
  birthday?: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  preferences: {
    emailNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
    twoFactorAuth: boolean
    profileVisibility: 'public' | 'private' | 'friends'
  }
}

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export function ProfileManagementClient({ user }: { user: User }) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user.name?.split(' ')[0] || '',
    lastName: user.name?.split(' ')[1] || '',
    email: user.email || '',
    phone: '',
    bio: '',
    company: '',
    jobTitle: '',
    birthday: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Canada'
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      twoFactorAuth: false,
      profileVisibility: 'private'
    }
  })

  const [tempProfileData, setTempProfileData] = useState<ProfileData>(profileData)

  useEffect(() => {
    // Fetch additional profile data from API
    const fetchProfileData = async () => {
      try {
        // Mock data - replace with actual API call
        const additionalData: Partial<ProfileData> = {
          phone: '+1 (613) 555-0123',
          bio: 'Interior design enthusiast looking for premium storage solutions.',
          company: 'Design Studio Ottawa',
          jobTitle: 'Senior Designer',
          birthday: '1985-06-15',
          address: {
            street: '123 Elgin Street',
            city: 'Ottawa',
            state: 'Ontario',
            zipCode: 'K1A 0B1',
            country: 'Canada'
          },
          preferences: {
            emailNotifications: true,
            smsNotifications: true,
            marketingEmails: false,
            twoFactorAuth: false,
            profileVisibility: 'private'
          }
        }

        setProfileData(prev => ({ ...prev, ...additionalData }))
        setTempProfileData(prev => ({ ...prev, ...additionalData }))
      } catch (error) {
        console.error('Error fetching profile data:', error)
      }
    }

    fetchProfileData()
  }, [])

  const handleEdit = () => {
    setTempProfileData(profileData)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setTempProfileData(profileData)
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setProfileData(tempProfileData)
      setIsEditing(false)

      toast({
        title: "Profile updated successfully",
        description: "Your changes have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setTempProfileData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ProfileData] as any),
          [child]: value
        }
      }))
    } else {
      setTempProfileData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleAvatarUpload = () => {
    // TODO: Implement avatar upload
    toast({
      title: "Feature coming soon",
      description: "Avatar upload will be available in the next update.",
    })
  }

  const getProfileCompletion = () => {
    const fields = Object.keys(profileData).filter(key => key !== 'preferences')
    const filledFields = fields.filter(key => {
      if (typeof profileData[key as keyof ProfileData] === 'string') {
        return profileData[key as keyof ProfileData] !== ''
      } else if (typeof profileData[key as keyof ProfileData] === 'object') {
        return Object.values(profileData[key as keyof ProfileData] as any).some(v => v !== '')
      }
      return false
    })
    return Math.round((filledFields.length / fields.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.image || ''} alt={user.name || ''} />
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {profileData.firstName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0"
                  onClick={handleAvatarUpload}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-gray-600">{profileData.email}</p>
                {profileData.jobTitle && profileData.company && (
                  <p className="text-sm text-gray-500">{profileData.jobTitle} at {profileData.company}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <Button onClick={handleEdit} className="flex items-center gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="personal" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="contact">Contact Details</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Manage your basic personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={isEditing ? tempProfileData.firstName : profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className={cn(!isEditing && "bg-gray-50")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={isEditing ? tempProfileData.lastName : profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      className={cn(!isEditing && "bg-gray-50")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthday">Birthday</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={isEditing ? tempProfileData.birthday : profileData.birthday}
                    onChange={(e) => handleInputChange('birthday', e.target.value)}
                    disabled={!isEditing}
                    className={cn(!isEditing && "bg-gray-50")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={isEditing ? tempProfileData.bio : profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    className={cn(!isEditing && "bg-gray-50")}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Manage your contact details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? tempProfileData.email : profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className={cn(!isEditing && "bg-gray-50")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={isEditing ? tempProfileData.phone : profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={cn(!isEditing && "bg-gray-50")}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Primary Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={isEditing ? tempProfileData.address.street : profileData.address.street}
                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                        disabled={!isEditing}
                        className={cn(!isEditing && "bg-gray-50")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={isEditing ? tempProfileData.address.city : profileData.address.city}
                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                        disabled={!isEditing}
                        className={cn(!isEditing && "bg-gray-50")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={isEditing ? tempProfileData.address.state : profileData.address.state}
                        onChange={(e) => handleInputChange('address.state', e.target.value)}
                        disabled={!isEditing}
                        className={cn(!isEditing && "bg-gray-50")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        value={isEditing ? tempProfileData.address.zipCode : profileData.address.zipCode}
                        onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                        disabled={!isEditing}
                        className={cn(!isEditing && "bg-gray-50")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={isEditing ? tempProfileData.address.country : profileData.address.country}
                        onValueChange={(value) => handleInputChange('address.country', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className={cn(!isEditing && "bg-gray-50")}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United States">United States</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Information
                </CardTitle>
                <CardDescription>
                  Your professional details for better service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Your company name"
                      value={isEditing ? tempProfileData.company : profileData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      disabled={!isEditing}
                      className={cn(!isEditing && "bg-gray-50")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      placeholder="Your role or position"
                      value={isEditing ? tempProfileData.jobTitle : profileData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      disabled={!isEditing}
                      className={cn(!isEditing && "bg-gray-50")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    id="twoFactor"
                    checked={isEditing ? tempProfileData.preferences.twoFactorAuth : profileData.preferences.twoFactorAuth}
                    onCheckedChange={(checked) => handleInputChange('preferences.twoFactorAuth', checked)}
                    disabled={!isEditing}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Privacy Settings</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="profileVisibility">Profile Visibility</Label>
                      <p className="text-sm text-gray-600">Control who can see your profile information</p>
                    </div>
                    <Select
                      value={isEditing ? tempProfileData.preferences.profileVisibility : profileData.preferences.profileVisibility}
                      onValueChange={(value: 'public' | 'private' | 'friends') => handleInputChange('preferences.profileVisibility', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="friends">Friends</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={isEditing ? tempProfileData.preferences.emailNotifications : profileData.preferences.emailNotifications}
                        onCheckedChange={(checked) => handleInputChange('preferences.emailNotifications', checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="smsNotifications">SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Receive updates via text message</p>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={isEditing ? tempProfileData.preferences.smsNotifications : profileData.preferences.smsNotifications}
                        onCheckedChange={(checked) => handleInputChange('preferences.smsNotifications', checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="marketingEmails">Marketing Emails</Label>
                        <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                      </div>
                      <Switch
                        id="marketingEmails"
                        checked={isEditing ? tempProfileData.preferences.marketingEmails : profileData.preferences.marketingEmails}
                        onCheckedChange={(checked) => handleInputChange('preferences.marketingEmails', checked)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Profile Completion Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>
              Complete your profile to get personalized recommendations and better service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">{getProfileCompletion()}% Complete</span>
              {getProfileCompletion() === 100 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  Complete
                </Badge>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProfileCompletion()}%` }}
              />
            </div>
            {getProfileCompletion() < 100 && (
              <p className="text-sm text-gray-600 mt-2">
                {getProfileCompletion() < 50 && 'Add your phone number and address to improve your profile.'}
                {getProfileCompletion() >= 50 && getProfileCompletion() < 100 && 'You\'re almost there! Add a few more details to complete your profile.'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}