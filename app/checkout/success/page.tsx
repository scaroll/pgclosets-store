import { CheckCircle, Download, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
            <p className="text-muted-foreground mt-2">
              Thank you for your order. Your payment has been processed successfully.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
              <ul className="text-sm text-green-700 space-y-1 text-left">
                <li>• You'll receive an email confirmation shortly</li>
                <li>• Our team will contact you within 24 hours</li>
                <li>• We'll schedule your installation consultation</li>
                <li>• Professional installation included</li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/store">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Need help? Contact us at{' '}
                <a href="mailto:support@pgclosets.ca" className="text-primary hover:underline">
                  support@pgclosets.ca
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <Badge variant="outline" className="bg-white/80">
            Order ID: #PGC-{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </Badge>
        </div>
      </div>
    </div>
  )
}