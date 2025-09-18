"use client"

import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { User, Mail, Phone, Calendar, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { FileUpload } from "../../../components/ui/file-upload"
import { useState } from "react"

export default function ProfilePage() {
  const [profilePicture, setProfilePicture] = useState<File | null>(null)

  const handleProfilePictureSelect = async (file: File) => {
    setProfilePicture(file)
    console.log("[v0] Profile picture selected:", file?.name)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center relative">
                <span className="text-primary-foreground font-bold text-sm">PG</span>
              </div>
              <div>
                <span className="text-xl font-bold text-foreground font-serif">PG Closets</span>
                <p className="text-xs text-muted-foreground">Premium Home Organization</p>
              </div>
            </Link>

            <Link href="/account">
              <Button variant="ghost" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Account
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 font-serif">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload accept="image/*" maxSize={5 * 1024 * 1024} onUpload={handleProfilePictureSelect} className="mb-4" />
              <p className="text-xs text-muted-foreground text-center">JPG, PNG up to 5MB</p>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" className="bg-muted/50" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Smith" className="bg-muted/50" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="email" type="email" defaultValue="john.smith@email.com" className="pl-10 bg-muted/50" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="phone" type="tel" defaultValue="+1 (416) 555-0123" className="pl-10 bg-muted/50" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="birthday">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="birthday" type="date" defaultValue="1985-06-15" className="pl-10 bg-muted/50" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>Your primary address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="address" defaultValue="123 Main Street" className="pl-10 bg-muted/50" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="Toronto" className="bg-muted/50" />
                  </div>
                  <div>
                    <Label htmlFor="province">Province</Label>
                    <Input id="province" defaultValue="ON" className="bg-muted/50" />
                  </div>
                  <div>
                    <Label htmlFor="postal">Postal Code</Label>
                    <Input id="postal" defaultValue="M5V 3A8" className="bg-muted/50" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Communication and notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    className="bg-muted/50"
                    defaultValue="Home organization enthusiast with a passion for luxury closet systems."
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="emailNotifications" defaultChecked className="rounded" />
                    <Label htmlFor="emailNotifications" className="text-sm">
                      Receive email notifications about orders and promotions
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="smsNotifications" className="rounded" />
                    <Label htmlFor="smsNotifications" className="text-sm">
                      Receive SMS notifications for order updates
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="newsletter" defaultChecked className="rounded" />
                    <Label htmlFor="newsletter" className="text-sm">
                      Subscribe to our newsletter for design tips and new products
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" className="bg-transparent">
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
