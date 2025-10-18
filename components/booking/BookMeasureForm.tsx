"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, MapPin } from "lucide-react";

export function BookMeasureForm() {
  const [_step, _setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Address
    street: "",
    city: "Ottawa",
    province: "ON",
    postal_code: "",

    // Contact
    name: "",
    email: "",
    phone: "",

    // Details
    opening_type: "",
    rough_width: "",
    rough_height: "",
    notes: "",

    // Calculated
    within_radius: true,
    measure_fee: 0
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would normally send to your backend/CRM
    // For now, we'll simulate success
    console.log("Booking submitted:", formData);

    // Track event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'book_measure_submit', {
        address: `${formData.city}, ${formData.province}`,
        within_radius: formData.within_radius,
        measure_fee: formData.measure_fee
      });
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            You're Booked!
          </h2>
          <p className="text-green-800 mb-4">
            We'll call you within 24 hours to confirm your appointment and discuss timing.
          </p>
          <p className="text-sm text-green-700">
            Check your email for confirmation details.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 1: Address */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-teal-700" />
            <h3 className="text-lg font-semibold">Your Address</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  placeholder="K1A 0B1"
                  required
                />
              </div>
            </div>

            {formData.postal_code && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-semibold">
                  ✓ Within 30 km — Free measure
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Contact */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(613) 701-6393"
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Project Details */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Project Details (Optional)</h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="opening_type">What type of door are you interested in?</Label>
              <select
                id="opening_type"
                value={formData.opening_type}
                onChange={(e) => setFormData({ ...formData, opening_type: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Select a type...</option>
                <option value="barn">Barn Door</option>
                <option value="bypass">Bypass Closet Door</option>
                <option value="bifold">Bifold Closet Door</option>
                <option value="pivot">Pivot Door</option>
                <option value="room-divider">Room Divider</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rough_width">Rough Width (inches)</Label>
                <Input
                  id="rough_width"
                  type="number"
                  value={formData.rough_width}
                  onChange={(e) => setFormData({ ...formData, rough_width: e.target.value })}
                  placeholder="48"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Approximate is fine
                </p>
              </div>

              <div>
                <Label htmlFor="rough_height">Rough Height (inches)</Label>
                <Input
                  id="rough_height"
                  type="number"
                  value={formData.rough_height}
                  onChange={(e) => setFormData({ ...formData, rough_height: e.target.value })}
                  placeholder="80"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Approximate is fine
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Tell us about your project, any specific requirements, or questions..."
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="submit" className="flex-1 h-12 text-base">
          Request In-Home Measure
        </Button>
        <Button type="button" variant="outline" className="flex-1 h-12 text-base" asChild>
          <a href="/">Continue Shopping</a>
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        We'll call you within 24 hours to schedule a convenient time. No obligation, no pressure.
      </p>
    </form>
  );
}
