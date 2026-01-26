'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { faqCategories, type FAQ } from './faq-data'

export function FAQContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('products')

  // Filter FAQs based on search query
  const filterFAQs = (faqs: FAQ[]) => {
    if (!searchQuery.trim()) return faqs

    const query = searchQuery.toLowerCase()
    return faqs.filter(
      faq => faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
    )
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Find answers to common questions about our products, installation services, warranty,
          shipping, and returns.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative mx-auto max-w-xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-12 pl-10 text-base"
          />
        </div>
      </div>

      {/* Category Tabs with Accordions */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-5">
          {faqCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {faqCategories.map(category => {
          const filteredFAQs = filterFAQs(category.faqs)

          return (
            <TabsContent key={category.id} value={category.id}>
              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq, index) => (
                    <AccordionItem
                      key={`${category.id}-${index}`}
                      value={`${category.id}-${index}`}
                    >
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="leading-relaxed text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No FAQs found matching your search.</p>
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>

      {/* Contact CTA */}
      <div className="mt-16 rounded-lg bg-muted p-8 text-center">
        <h2 className="mb-3 text-2xl font-semibold">Still have questions?</h2>
        <p className="mb-6 text-muted-foreground">
          Can&apos;t find the answer you&apos;re looking for? Our customer support team is here to
          help.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Contact Us
        </Link>
      </div>
    </>
  )
}
