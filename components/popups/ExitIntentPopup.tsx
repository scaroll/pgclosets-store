'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { JobberQuoteForm } from '@/components/forms/JobberQuoteForm';
import { ga4 } from '@/lib/analytics/ga4-events';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ExitIntentPopupProps {
  enabled?: boolean;
  delay?: number; // Minimum time on page before showing (ms)
  showOnce?: boolean; // Only show once per session
}

export function ExitIntentPopup({ 
  enabled = true, 
  delay = 5000, 
  showOnce = true 
}: ExitIntentPopupProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const startTime = useRef(Date.now());
  const exitDetected = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // Check if already shown in this session
    if (showOnce && sessionStorage.getItem('exitIntentShown')) {
      setHasShown(true);
      return;
    }

    // Track time spent on page
    const timer = setInterval(() => {
      setTimeSpent(Date.now() - startTime.current);
    }, 1000);

    // Mouse leave detection for exit intent
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the page
      if (e.clientY <= 0 && !hasShown && !exitDetected.current && timeSpent >= delay) {
        exitDetected.current = true;
        setShowPopup(true);
        setHasShown(true);
        
        // Track exit intent trigger
        ga4.exitIntentTriggered(window.location.pathname);
        
        // Remember that popup was shown
        if (showOnce) {
          sessionStorage.setItem('exitIntentShown', 'true');
        }
      }
    };

    // Mobile scroll detection as exit intent alternative
    let lastScrollTop = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // If scrolling up rapidly (potential exit behavior on mobile)
      if (scrollTop < lastScrollTop - 100 && scrollTop < 100 && !hasShown && timeSpent >= delay) {
        exitDetected.current = true;
        setShowPopup(true);
        setHasShown(true);
        
        ga4.exitIntentTriggered(window.location.pathname);
        
        if (showOnce) {
          sessionStorage.setItem('exitIntentShown', 'true');
        }
      }
      lastScrollTop = scrollTop;
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, hasShown, timeSpent, delay, showOnce]);

  const handleClose = () => {
    setShowPopup(false);
    
    // Track popup dismissal
    ga4.customEvent({
      event_name: 'exit_intent_popup_dismissed',
      event_parameters: {
        time_spent_before_trigger: timeSpent,
        popup_content: 'jobber_quote_form'
      }
    });
  };

  const handleFormComplete = () => {
    setShowPopup(false);
    
    // Track successful conversion from exit intent
    ga4.customEvent({
      event_name: 'exit_intent_conversion',
      event_parameters: {
        time_spent_before_trigger: timeSpent,
        conversion_type: 'form_submission'
      }
    });
  };

  if (!enabled || !showPopup) return null;

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="max-w-lg p-0 gap-0 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 shadow-2xl">
        {/* Header with close button */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/20 h-8 w-8 p-0"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <span className="text-3xl" role="img" aria-label="Stop">✋</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Wait! Don't Miss Out
            </h2>
            <p className="text-blue-100">
              Get 15% off your first custom closet project
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Offer details */}
          <div className="text-center mb-6">
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center space-x-2 text-yellow-800">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-bold">Limited Time Offer</p>
                  <p className="text-sm">Save 15% + Free Design Consultation</p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              Schedule your free consultation now and get an exclusive discount on your custom closet project.
            </p>

            {/* Benefits list */}
            <div className="space-y-2 text-left">
              {[
                'Free in-home consultation & measurement',
                '3D design rendering included',
                'Premium products with warranty',
                'Professional installation team'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Jobber Form */}
          <JobberQuoteForm 
            formTitle=""
            trackingLabel="exit_intent_popup"
            onLoadComplete={handleFormComplete}
            className="exit-intent-form"
          />

          {/* Trust signals */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★★★★★</span>
                <span>4.9/5 Rating</span>
              </div>
              <div>200+ Happy Customers</div>
              <div>Licensed & Insured</div>
            </div>
          </div>
        </div>

        {/* Footer with urgency */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold text-red-600">Offer expires in 24 hours</span>
            </p>
            <p className="text-xs text-gray-500">
              Or call us directly at{' '}
              <a 
                href="tel:+16132622604" 
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => ga4.jobberPhoneClick('exit_intent_popup_phone')}
              >
                (613) 262-2604
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}