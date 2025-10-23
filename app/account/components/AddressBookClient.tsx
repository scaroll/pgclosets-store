'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Plus, Edit, Trash2, ArrowLeft, Home, Building, Package, Map, Navigation, Check, Star, Globe, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface Address {
  id: string
  type: 'home' | 'work' | 'shipping' | 'billing'
  name: string
  company?: string
  address: string
  address2?: string
  city: string
  province: string
  postalCode: string
  country: string
  phone: string
  email?: string
  instructions?: string
  isDefault: boolean
  coordinates?: {
    lat: number
    lng: number
  }
  verified: boolean
  deliveryNotes?: string
  accessInstructions?: string
  businessHours?: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
}

interface AddressFormData {
  type: 'home' | 'work' | 'shipping' | 'billing'
  name: string
  company?: string
  address: string
  address2?: string
  city: string
  province: string
  postalCode: string
  country: string
  phone: string
  email?: string
  instructions?: string
  isDefault: boolean
}

export function AddressBookClient() {
  const { toast } = useToast()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [mapView, setMapView] = useState(false)

  const [formData, setFormData] = useState<AddressFormData>({
    type: 'home',
    name: '',
    company: '',
    address: '',
    address2: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',
    phone: '',
    email: '',
    instructions: '',
    isDefault: false
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      // Mock data - replace with actual API call
      const mockAddresses: Address[] = [
        {
          id: '1',
          type: 'home',
          name: 'John Smith',
          address: '123 Elgin Street',
          address2: 'Apt 4B',
          city: 'Ottawa',
          province: 'ON',
          postalCode: 'K1A 0B1',
          country: 'Canada',
          phone: '+1 (613) 555-0123',
          email: 'john.smith@email.com',
          instructions: 'Ring doorbell 3 times',
          isDefault: true,
          coordinates: { lat: 45.4215, lng: -75.6972 },
          verified: true,
          deliveryNotes: 'Leave packages with concierge',
          accessInstructions: 'Elevator access, 4th floor'
        },
        {
          id: '2',
          type: 'work',
          name: 'John Smith',
          company: 'Design Studio Ottawa',
          address: '456 Sparks Street',
          city: 'Ottawa',
          province: 'ON',
          postalCode: 'K1R 7S8',
          country: 'Canada',
          phone: '+1 (613) 555-0456',
          email: 'john@designstudio.com',
          isDefault: false,
          coordinates: { lat: 45.4255, lng: -75.6903 },
          verified: true,
          businessHours: {
            monday: '9:00 AM - 5:00 PM',
            tuesday: '9:00 AM - 5:00 PM',
            wednesday: '9:00 AM - 5:00 PM',
            thursday: '9:00 AM - 5:00 PM',
            friday: '9:00 AM - 5:00 PM',
            saturday: 'Closed',
            sunday: 'Closed'
          }
        },
        {
          id: '3',
          type: 'shipping',
          name: 'Sarah Johnson',
          address: '789 Queen Elizabeth Drive',
          city: 'Ottawa',
          province: 'ON',
          postalCode: 'K2C 1L5',
          country: 'Canada',
          phone: '+1 (613) 555-0789',
          instructions: 'Front door is painted blue',
          isDefault: false,
          coordinates: { lat: 45.3876, lng: -75.6960 },
          verified: false,
          deliveryNotes: 'Preferred delivery time: 2-4 PM'
        }
      ]
      setAddresses(mockAddresses)
    } catch (error) {
      console.error('Error fetching addresses:', error)
      toast({
        title: "Error loading addresses",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = async () => {
    try {
      // Validate form
      if (!formData.name || !formData.address || !formData.city || !formData.province || !formData.postalCode || !formData.phone) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      // Mock API call
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        verified: false,
        coordinates: { lat: 45.4215 + Math.random() * 0.1, lng: -75.6972 + Math.random() * 0.1 }
      }

      if (formData.isDefault) {
        setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })))
      }

      setAddresses(prev => [...prev, newAddress])
      setIsAddDialogOpen(false)
      resetForm()

      toast({
        title: "Address added successfully",
        description: "Your new address has been saved.",
      })
    } catch (error) {
      toast({
        title: "Error adding address",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      type: address.type,
      name: address.name,
      company: address.company || '',
      address: address.address,
      address2: address.address2 || '',
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      email: address.email || '',
      instructions: address.instructions || '',
      isDefault: address.isDefault
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateAddress = async () => {
    try {
      if (!editingAddress) return

      const updatedAddress: Address = {
        ...editingAddress,
        ...formData
      }

      if (formData.isDefault) {
        setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })))
      }

      setAddresses(prev => prev.map(addr => addr.id === editingAddress.id ? updatedAddress : addr))
      setIsEditDialogOpen(false)
      setEditingAddress(null)
      resetForm()

      toast({
        title: "Address updated successfully",
        description: "Your changes have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error updating address",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setIsDeleting(addressId)
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setAddresses(prev => prev.filter(addr => addr.id !== addressId))
      toast({
        title: "Address deleted",
        description: "The address has been removed from your account.",
      })
    } catch (error) {
      toast({
        title: "Error deleting address",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      })))

      toast({
        title: "Default address updated",
        description: "This address is now your default.",
      })
    } catch (error) {
      toast({
        title: "Error updating default address",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleVerifyAddress = async (addressId: string) => {
    try {
      // Mock verification API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setAddresses(prev => prev.map(addr =>
        addr.id === addressId ? { ...addr, verified: true } : addr
      ))

      toast({
        title: "Address verified",
        description: "Your address has been verified and is ready for delivery.",
      })
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Please check your address details and try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'home',
      name: '',
      company: '',
      address: '',
      address2: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'Canada',
      phone: '',
      email: '',
      instructions: '',
      isDefault: false
    })
  }

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />
      case 'work': return <Building className="h-4 w-4" />
      case 'shipping': return <Package className="h-4 w-4" />
      case 'billing': return <Star className="h-4 w-4" />
      default: return <MapPin className="h-4 w-4" />
    }
  }

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
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
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Account
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Address Book</h1>
                <p className="text-gray-600">Manage your shipping and billing addresses</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setMapView(!mapView)}
                className={cn(mapView && "bg-blue-50 text-blue-600 border-blue-200")}
              >
                <Map className="h-4 w-4 mr-2" />
                {mapView ? 'List View' : 'Map View'}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                    <DialogDescription>
                      Enter the details for your new address. All fields marked with * are required.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Address Type *</Label>
                        <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home">Home</SelectItem>
                            <SelectItem value="work">Work</SelectItem>
                            <SelectItem value="shipping">Shipping</SelectItem>
                            <SelectItem value="billing">Billing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="John Smith"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Design Studio Ottawa"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="123 Elgin Street"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address2">Apartment, Suite, etc. (Optional)</Label>
                      <Input
                        id="address2"
                        value={formData.address2}
                        onChange={(e) => setFormData(prev => ({ ...prev, address2: e.target.value }))}
                        placeholder="Apt 4B"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Ottawa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="province">Province *</Label>
                        <Select value={formData.province} onValueChange={(value) => setFormData(prev => ({ ...prev, province: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ON">Ontario</SelectItem>
                            <SelectItem value="QC">Quebec</SelectItem>
                            <SelectItem value="BC">British Columbia</SelectItem>
                            <SelectItem value="AB">Alberta</SelectItem>
                            <SelectItem value="MB">Manitoba</SelectItem>
                            <SelectItem value="SK">Saskatchewan</SelectItem>
                            <SelectItem value="NS">Nova Scotia</SelectItem>
                            <SelectItem value="NB">New Brunswick</SelectItem>
                            <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                            <SelectItem value="PE">Prince Edward Island</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                          placeholder="K1A 0B1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="United States">United States</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (613) 555-0123"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john.smith@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                      <Textarea
                        id="instructions"
                        value={formData.instructions}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                        placeholder="Ring doorbell 3 times, leave packages at back door..."
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isDefault"
                        checked={formData.isDefault}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
                      />
                      <Label htmlFor="isDefault">Set as default address</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAddress}>Add Address</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {addresses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No addresses yet</h3>
              <p className="text-gray-600 mb-6">Add your first address to get started with faster checkout</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Address List */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                  <Card key={address.id} className={cn("relative transition-all hover:shadow-lg", selectedAddress?.id === address.id && "ring-2 ring-blue-500")}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {getAddressIcon(address.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg capitalize">{address.type}</CardTitle>
                            <p className="text-sm text-gray-600">{address.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {address.verified && (
                            <Badge className="bg-green-100 text-green-800">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {address.isDefault && (
                            <Badge className="bg-blue-100 text-blue-800">Default</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-900">
                          {address.address}
                          {address.address2 && <span>, {address.address2}</span>}
                        </p>
                        <p className="text-sm text-gray-900">
                          {address.city}, {address.province} {address.postalCode}
                        </p>
                        <p className="text-sm text-gray-900">{address.country}</p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                        {address.company && <p className="text-sm text-gray-600">{address.company}</p>}
                        {address.instructions && (
                          <p className="text-sm text-blue-600 italic">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {address.instructions}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-2 mb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditAddress(address)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAddress(address.id)}
                            disabled={isDeleting === address.id}
                          >
                            {isDeleting === address.id ? (
                              <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedAddress(address)}
                        >
                          <Map className="h-4 w-4 mr-2" />
                          View on Map
                        </Button>
                        {!address.verified && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerifyAddress(address.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Verify
                          </Button>
                        )}
                        {!address.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(address.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Set Default
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Map View */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Address Map
                  </CardTitle>
                  <CardDescription>
                    Click on an address to view its location
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedAddress ? (
                    <div className="space-y-4">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                        {/* Mock map - in production, integrate with Google Maps or Mapbox */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3">
                          <p className="font-semibold text-sm">{selectedAddress.name}</p>
                          <p className="text-xs text-gray-600">{selectedAddress.address}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Location Details</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Type:</span> <span className="capitalize">{selectedAddress.type}</span></p>
                          <p><span className="font-medium">Coordinates:</span> {selectedAddress.coordinates?.lat.toFixed(4)}, {selectedAddress.coordinates?.lng.toFixed(4)}</p>
                          {selectedAddress.deliveryNotes && (
                            <p><span className="font-medium">Delivery Notes:</span> {selectedAddress.deliveryNotes}</p>
                          )}
                          {selectedAddress.accessInstructions && (
                            <p><span className="font-medium">Access:</span> {selectedAddress.accessInstructions}</p>
                          )}
                        </div>
                      </div>
                      {selectedAddress.businessHours && (
                        <div className="space-y-2">
                          <h4 className="font-semibold">Business Hours</h4>
                          <div className="text-sm space-y-1">
                            {Object.entries(selectedAddress.businessHours).map(([day, hours]) => (
                              <p key={day} className="capitalize">
                                <span className="font-medium">{day}:</span> {hours}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Navigation className="h-4 w-4 mr-2" />
                          Get Directions
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setSelectedAddress(null)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 font-medium">No Address Selected</p>
                      <p className="text-sm text-gray-500">Click on an address to view its location</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Address Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-500" />
              Address Guidelines & Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="shipping" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="installation">Installation</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <TabsContent value="shipping" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">Best Practices</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use complete and accurate postal codes</li>
                      <li>• Include apartment/unit numbers for multi-unit buildings</li>
                      <li>• Provide a contact phone number for delivery coordination</li>
                      <li>• Add specific delivery instructions for complex locations</li>
                      <li>• Verify addresses before placing large orders</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600">Delivery Options</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Standard delivery (5-7 business days)</li>
                      <li>• Express delivery (2-3 business days)</li>
                      <li>• White glove service available for premium items</li>
                      <li>• Weekend delivery by special arrangement</li>
                      <li>• Real-time tracking on all shipments</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="installation" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-purple-600">Site Requirements</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Verify parking availability for installation vehicles</li>
                      <li>• Ensure clear pathways to installation area</li>
                      <li>• Confirm electrical outlet locations and capacity</li>
                      <li>• Measure doorways and hallways for large items</li>
                      <li>• Remove existing fixtures if necessary</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-orange-600">Scheduling Tips</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Schedule 2-3 weeks in advance for best availability</li>
                      <li>• Allow 4-6 hours for standard installations</li>
                      <li>• Someone 18+ must be present during installation</li>
                      <li>• Pets should be secured during the visit</li>
                      <li>• Review installation plan with technician beforehand</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="security" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Privacy Protection</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• All addresses are encrypted and securely stored</li>
                      <li>• We never share your address information with third parties</li>
                      <li>• Address verification uses secure API connections</li>
                      <li>• You can delete addresses at any time</li>
                      <li>• Two-factor authentication available for account security</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-indigo-600">Verification Benefits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Faster checkout with verified addresses</li>
                      <li>• Reduced delivery errors and returns</li>
                      <li>• Priority processing for verified locations</li>
                      <li>• Access to premium delivery options</li>
                      <li>• Automatic address formatting and correction</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>
              Update the details for this address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Same form fields as Add Dialog */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Address Type *</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Smith"
                />
              </div>
            </div>

            {/* Add all other form fields similar to Add Dialog */}

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
              />
              <Label htmlFor="edit-isDefault">Set as default address</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAddress}>Update Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}