"use client";

import React, { useEffect, useState } from 'react';
import { altTextUtils, touchUtils } from '@/lib/accessibility-utils';

interface AccessibilityReport {
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    category: string;
    message: string;
    element?: string;
  }>;
  passed: Array<{
    category: string;
    message: string;
  }>;
}

const AccessibilityValidator: React.FC<{ enabled?: boolean }> = ({ enabled = false }) => {
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const runAccessibilityAudit = () => {
      const issues: AccessibilityReport['issues'] = [];
      const passed: AccessibilityReport['passed'] = [];

      // Check images for alt text
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (!img.alt) {
          issues.push({
            type: 'error',
            category: 'Images',
            message: `Image ${index + 1} missing alt text`,
            element: img.src || 'Unknown source'
          });
        } else if (!altTextUtils.validateAltText(img.alt)) {
          issues.push({
            type: 'warning',
            category: 'Images',
            message: `Image ${index + 1} has poor alt text: "${img.alt}"`,
            element: img.src || 'Unknown source'
          });
        } else {
          passed.push({
            category: 'Images',
            message: `Image ${index + 1} has good alt text`
          });
        }
      });

      // Check headings hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      let hasH1 = false;

      headings.forEach((heading, _index) => {
        const level = parseInt(heading.tagName.charAt(1));

        if (level === 1) {
          if (hasH1) {
            issues.push({
              type: 'error',
              category: 'Headings',
              message: `Multiple H1 elements found. Page should have only one H1.`,
              element: heading.textContent?.slice(0, 50) || 'Unknown heading'
            });
          }
          hasH1 = true;
        }

        if (lastLevel > 0 && level > lastLevel + 1) {
          issues.push({
            type: 'warning',
            category: 'Headings',
            message: `Heading level jumps from H${lastLevel} to H${level}. Should be sequential.`,
            element: heading.textContent?.slice(0, 50) || 'Unknown heading'
          });
        }

        lastLevel = level;
      });

      if (hasH1) {
        passed.push({
          category: 'Headings',
          message: 'Page has a main H1 heading'
        });
      } else {
        issues.push({
          type: 'error',
          category: 'Headings',
          message: 'Page missing H1 heading'
        });
      }

      // Check touch targets
      const interactiveElements = document.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], [role="link"]'
      );

      interactiveElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          if (!touchUtils.meetsMinTouchTarget(element)) {
            issues.push({
              type: 'warning',
              category: 'Touch Targets',
              message: 'Interactive element smaller than 44x44px minimum',
              element: element.textContent?.slice(0, 30) || element.tagName
            });
          }
        }
      });

      // Check for skip navigation
      const skipLink = document.querySelector('a[href="#main-content"], a[href*="skip"]');
      if (skipLink) {
        passed.push({
          category: 'Navigation',
          message: 'Skip navigation link found'
        });
      } else {
        issues.push({
          type: 'warning',
          category: 'Navigation',
          message: 'No skip navigation link found'
        });
      }

      // Check for focus indicators
      const focusableElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        passed.push({
          category: 'Focus Management',
          message: `${focusableElements.length} focusable elements found`
        });
      }

      // Check for ARIA labels on form inputs
      const formInputs = document.querySelectorAll('input, select, textarea');
      let unlabeledInputs = 0;

      formInputs.forEach(input => {
        const hasLabel = document.querySelector(`label[for="${input.id}"]`) ||
                        input.getAttribute('aria-label') ||
                        input.getAttribute('aria-labelledby');

        if (!hasLabel) {
          unlabeledInputs++;
        }
      });

      if (unlabeledInputs > 0) {
        issues.push({
          type: 'error',
          category: 'Forms',
          message: `${unlabeledInputs} form inputs without proper labels`
        });
      } else if (formInputs.length > 0) {
        passed.push({
          category: 'Forms',
          message: 'All form inputs have proper labels'
        });
      }

      // Calculate score
      const totalChecks = issues.length + passed.length;
      const score = totalChecks > 0 ? Math.round((passed.length / totalChecks) * 100) : 100;

      setReport({
        score,
        issues,
        passed
      });
    };

    // Run audit after a short delay to ensure DOM is ready
    const timer = setTimeout(runAccessibilityAudit, 1000);
    return () => clearTimeout(timer);
  }, [enabled]);

  if (!enabled || !report) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-pg-button-primary text-white px-4 py-2 rounded-lg shadow-lg hover:bg-pg-button-primary-hover focus:outline-none focus:ring-2 focus:ring-pg-sky"
        aria-expanded={isVisible}
        aria-controls="accessibility-report"
      >
        A11y Score: {report.score}%
      </button>

      {isVisible && (
        <div
          id="accessibility-report"
          className="absolute bottom-full right-0 mb-2 w-96 max-h-96 overflow-y-auto bg-white border-2 border-pg-button-secondary rounded-lg shadow-xl"
          role="dialog"
          aria-label="Accessibility Report"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-pg-text-primary">
                Accessibility Report
              </h2>
              <button
                onClick={() => setIsVisible(false)}
                className="text-pg-text-muted hover:text-pg-text-primary"
                aria-label="Close accessibility report"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <div className={`text-2xl font-bold ${
                report.score >= 90 ? 'text-pg-status-success' :
                report.score >= 70 ? 'text-pg-status-warning' :
                'text-pg-status-error'
              }`}>
                {report.score}%
              </div>
              <div className="text-sm text-pg-text-secondary">
                Accessibility Score
              </div>
            </div>

            {report.issues.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-pg-text-primary mb-2">
                  Issues ({report.issues.length})
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {report.issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-xs ${
                        issue.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                        issue.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                        'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      <div className="font-medium">{issue.category}</div>
                      <div>{issue.message}</div>
                      {issue.element && (
                        <div className="text-xs opacity-75 mt-1">
                          Element: {issue.element}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.passed.length > 0 && (
              <div>
                <h3 className="font-semibold text-pg-text-primary mb-2">
                  Passed ({report.passed.length})
                </h3>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {report.passed.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 bg-green-50 text-green-800 rounded text-xs border border-green-200"
                    >
                      <span className="font-medium">{item.category}:</span> {item.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityValidator;