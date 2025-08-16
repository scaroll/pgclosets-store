'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Skeleton } from '@/components/ui/skeleton';
import { useInView } from 'react-intersection-observer';
import { ga4 } from '@/lib/analytics/ga4-events';

interface JobberFormProps {
  formTitle?: string;
  className?: string;
  onLoadComplete?: () => void;
  trackingLabel?: string;
  lazyLoad?: boolean;
}

declare global {
  interface Window {
    JobberFormEmbed?: {
      initialize: (config: {
        clienthub_id: string;
        form_url: string;
        container: HTMLElement;
      }) => void;
    };
    fbq?: (...args: any[]) => void;
  }
}

export function JobberQuoteForm({ 
  formTitle = "Get Your Free Quote",
  className = "",
  onLoadComplete,
  trackingLabel = "main_quote_form",
  lazyLoad = true
}: JobberFormProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ threshold: 0.1 });
  const hasTrackedView = useRef(false);
  
  const CLIENT_HUB_ID = '83a3d24e-c18d-441c-80d1-d85419ea28ae';
  const FORM_URL = `https://clienthub.getjobber.com/client_hubs/${CLIENT_HUB_ID}/public/work_request/embedded_work_request_form`;

  useEffect(() => {
    // Track form view when it comes into viewport
    if (inView && !hasTrackedView.current) {
      hasTrackedView.current = true;
      ga4.jobberFormView(trackingLabel, CLIENT_HUB_ID);
    }
  }, [inView, trackingLabel, CLIENT_HUB_ID]);

  useEffect(() => {
    if (!lazyLoad || inView) {
      loadJobberForm();
    }
  }, [inView, lazyLoad]);

  const loadJobberForm = () => {
    // Check if form is already loaded
    if (window.JobberFormEmbed && formRef.current) {
      initializeForm();
    }
  };

  const initializeForm = () => {
    if (formRef.current && window.JobberFormEmbed) {
      try {
        window.JobberFormEmbed.initialize({
          clienthub_id: CLIENT_HUB_ID,
          form_url: FORM_URL,
          container: formRef.current
        });
        
        setIsLoaded(true);
        attachFormListeners();
        
        if (onLoadComplete) {
          onLoadComplete();
        }
      } catch (error) {
        console.error('Failed to initialize Jobber form:', error);
        setIsError(true);
        ga4.jobberFormError('initialization_failed', (error as Error).message);
      }
    }
  };

  const attachFormListeners = () => {
    // Listen for form interactions
    const formElement = formRef.current?.querySelector('form');
    if (!formElement) return;

    let hasStartedFilling = false;
    let fieldsFilled = new Set<string>();

    // Track form start
    formElement.addEventListener('focusin', (e) => {
      if (!hasStartedFilling) {
        hasStartedFilling = true;
        ga4.jobberFormStart(trackingLabel);
      }
      
      const target = e.target as HTMLInputElement;
      if (target.name && !fieldsFilled.has(target.name)) {
        ga4.jobberFormFieldInteraction(target.name, 'focus');
      }
    });

    // Track field completion
    formElement.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.name) {
        fieldsFilled.add(target.name);
        ga4.jobberFormFieldInteraction(target.name, 'completed');
      }
    });

    // Track form submission
    formElement.addEventListener('submit', (e) => {
      const formData = new FormData(formElement);
      const projectType = formData.get('project_type')?.toString();
      const urgency = formData.get('urgency')?.toString();
      
      ga4.jobberFormSubmit(trackingLabel, {
        fields_filled: fieldsFilled.size,
        estimated_value: estimateLeadValue(formElement),
        project_type: projectType,
        urgency: urgency
      });
    });
  };

  const estimateLeadValue = (form: HTMLFormElement): number => {
    // Estimate lead value based on form inputs
    const projectType = form.querySelector<HTMLSelectElement>('[name*="project"]')?.value;
    const roomCount = form.querySelector<HTMLInputElement>('[name*="rooms"]')?.value;
    
    let baseValue = 2000; // Base closet value
    
    if (projectType?.includes('premium')) baseValue *= 2;
    if (roomCount) baseValue *= parseInt(roomCount);
    
    return baseValue;
  };


  if (isError) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-8 text-center ${className}`}>
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Unable to Load Quote Form
        </h3>
        <p className="text-red-600 mb-4">
          Please try refreshing the page or contact us directly.
        </p>
        <a 
          href="tel:+16132622604" 
          className="inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
          onClick={() => ga4.jobberPhoneClick('form_error_fallback')}
        >
          Call (613) 262-2604
        </a>
      </div>
    );
  }

  return (
    <div ref={ref} className={`jobber-form-container ${className}`}>
      {formTitle && (
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {formTitle}
        </h2>
      )}
      
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-32" />
        </div>
      )}
      
      {/* Jobber form container */}
      <div 
        id="jobber-form-embed" 
        ref={formRef}
        className={`${!isLoaded ? 'hidden' : ''}`}
      />
      
      {/* Load Jobber scripts */}
      {(!lazyLoad || inView) && (
        <>
          <link
            rel="stylesheet"
            href="https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css"
            media="screen"
          />
          <Script
            src="https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js"
            strategy="lazyOnload"
            onLoad={initializeForm}
            onError={() => setIsError(true)}
            data-clienthub-id={CLIENT_HUB_ID}
            data-form-url={FORM_URL}
          />
        </>
      )}
    </div>
  );
}