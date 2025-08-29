import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Database } from "lucide-react"
import PgHeader from "@/components/PgHeader"
import PgFooter from "@/components/PgFooter"
import { H4, Body, BodySmall } from "@/components/typography/typography"

export default function PrivacyPolicyPage() {
  return (
    <>
      <PgHeader />
      <main className="min-h-screen bg-pg-background">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-pg-navy/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-pg-navy" />
              </div>
            </div>
            <h1 className="text-5xl font-extrabold text-pg-charcoal mb-6 tracking-tight">Privacy Policy</h1>
            <p className="text-xl text-pg-charcoal/70 max-w-2xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-pg-charcoal/50 mt-4">Last updated: January 2025</p>
          </div>

          <div className="space-y-8">
            <div className="grid-spacing-lg">
              <Card className="card-brand-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-primary" />
                    Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="content-spacing-md">
                  <div className="content-spacing-sm">
                    <H4 className="heading-with-spacing">Personal Information</H4>
                    <Body className="text-muted-foreground">
                      We collect information you provide directly to us, such as when you create an account, make a
                      purchase, or contact us for support. This may include your name, email address, phone number,
                      shipping address, and payment information.
                    </Body>
                  </div>
                  <div>
                    <H4 className="heading-with-spacing">Usage Information</H4>
                    <Body className="text-muted-foreground">
                      We automatically collect certain information about your use of our website, including your IP
                      address, browser type, pages visited, and the time and date of your visits.
                    </Body>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-brand-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2 text-primary" />
                    How We Use Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="content-spacing-md">
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Process and fulfill your orders and provide customer service
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Send you important information about your orders and account
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Improve our website and services based on your feedback and usage patterns
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Send you marketing communications (with your consent)
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Comply with legal obligations and protect our rights
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-brand-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-primary" />
                    Information Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="content-spacing-md">
                  <Body className="text-muted-foreground">
                    We implement appropriate technical and organizational security measures to protect your personal
                    information against unauthorized access, alteration, disclosure, or destruction. However, no method
                    of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee
                    absolute security.
                  </Body>
                </CardContent>
              </Card>

              <Card className="card-brand-elevated">
                <CardHeader>
                  <CardTitle>Your Rights and Choices</CardTitle>
                </CardHeader>
                <CardContent className="content-spacing-md">
                  <Body className="text-muted-foreground">You have the right to:</Body>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Access and update your personal information
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Request deletion of your personal information
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Opt out of marketing communications
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Request a copy of your personal information
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-brand-elevated">
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="content-spacing-md">
                  <Body className="text-muted-foreground mb-4">
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                  </Body>
                  <div className="space-y-2 text-muted-foreground">
                    <BodySmall>Email: privacy@pgclosets.com</BodySmall>
                    <BodySmall>Phone: 1-800-PG-CLOSET</BodySmall>
                    <BodySmall>Address: 123 Organization Way, Toronto, ON M5V 3A8</BodySmall>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <PgFooter />
    </>
  )
}
