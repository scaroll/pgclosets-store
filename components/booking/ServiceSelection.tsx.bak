'use client';

import { services } from '@/lib/services';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceSelectionProps {
  selectedService?: string;
  onSelect: (service: string) => void;
  onNext: () => void;
}

export default function ServiceSelection({
  selectedService,
  onSelect,
  onNext,
}: ServiceSelectionProps) {
  const handleSelect = (serviceSlug: string) => {
    onSelect(serviceSlug);
  };

  const handleContinue = () => {
    if (selectedService) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedService === service.slug;

          return (
            <Card
              key={service.slug}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:shadow-lg',
                isSelected && 'ring-2 ring-blue-600 bg-blue-50/50'
              )}
              onClick={() => handleSelect(service.slug)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-lg flex items-center justify-center',
                        isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      {service.slug === 'consultation' && (
                        <Badge variant="success" className="mt-1">
                          Most Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  {service.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{service.duration}</span>
                  </div>
                  {service.pricing.starting > 0 ? (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>From ${service.pricing.starting}</span>
                    </div>
                  ) : (
                    <Badge variant="success" className="text-xs">
                      FREE
                    </Badge>
                  )}
                </div>

                {/* Key Benefits */}
                <div className="mt-3 space-y-1">
                  {service.benefits.slice(0, 3).map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Special Offer Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg">
        <p className="text-sm font-medium mb-1">
          🎉 Limited Time Offer
        </p>
        <p className="text-xs text-blue-100">
          Book a free consultation today and receive 15% off your first closet installation!
        </p>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!selectedService}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Continue to Schedule
        </Button>
      </div>
    </div>
  );
}