# PG Closets Documentation

> **Comprehensive documentation for the PG Closets luxury e-commerce platform**

Welcome to the PG Closets documentation. This guide provides everything you need to understand, develop, deploy, and maintain the PG Closets website.

## 📚 Documentation Sections

### 🚀 Getting Started
- **[Quick Start Guide](./onboarding/QUICK_START.md)** - Get up and running in minutes
- **[Development Setup](./developer-guides/SETUP.md)** - Complete environment configuration
- **[Project Architecture](./architecture/SYSTEM_OVERVIEW.md)** - Understanding the system
- **[Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute to the project

### 👨‍💻 Developer Documentation
- **[API Documentation](./api/README.md)** - REST API reference and guides
- **[Database Schema](./developer-guides/DATABASE_SCHEMA.md)** - Prisma models and relationships
- **[Component Library](./components/README.md)** - React component documentation
- **[Testing Guide](./developer-guides/TESTING_GUIDE.md)** - Writing and running tests
- **[Debugging Guide](./developer-guides/DEBUGGING_GUIDE.md)** - Troubleshooting techniques
- **[Performance Guide](./developer-guides/PERFORMANCE_GUIDE.md)** - Optimization strategies
- **[Security Guide](./developer-guides/SECURITY_GUIDE.md)** - Security best practices

### 🎨 Design System
- **[Design System](./design-system.md)** - Visual design language
- **[Color System](./color-system.md)** - Color palette and usage
- **[Typography](./TYPOGRAPHY.md)** - Font system and hierarchy
- **[Component Library](./UX_COMPONENT_LIBRARY.md)** - Reusable UI components
- **[Accessibility Guide](./ACCESSIBILITY_GUIDE.md)** - WCAG compliance standards

### 🏗️ Architecture
- **[System Overview](./architecture/SYSTEM_OVERVIEW.md)** - High-level architecture
- **[Data Flow](./architecture/DATA_FLOW.md)** - How data moves through the system
- **[Tech Stack](./architecture/TECH_STACK.md)** - Technologies and rationale
- **[Design Patterns](./architecture/DESIGN_PATTERNS.md)** - Patterns used in the codebase
- **[Decision Records](./architecture/DECISION_RECORDS.md)** - Architecture decisions (ADRs)

### 📝 Content Management
- **[Content Strategy](./CONTENT_STRATEGY.md)** - Content guidelines and voice
- **[SEO Guide](./SEO_IMPLEMENTATION_GUIDE.md)** - Search engine optimization
- **[Image Optimization](./IMAGE_OPTIMIZATION_GUIDE.md)** - Image best practices
- **[Copy Implementation](./COPY_IMPLEMENTATION_GUIDE.md)** - Writing effective copy
- **[Blog Content](./blog/CONTENT_STRATEGY.md)** - Blog publishing guide

### 🚀 Deployment & Operations
- **[Deployment Guide](./runbooks/DEPLOYMENT_RUNBOOK.md)** - Production deployment steps
- **[Rollback Runbook](./runbooks/ROLLBACK_RUNBOOK.md)** - How to rollback deployments
- **[Incident Response](./runbooks/INCIDENT_RESPONSE.md)** - Emergency procedures
- **[Monitoring](./runbooks/MONITORING_RUNBOOK.md)** - System health monitoring

### 🔧 Troubleshooting
- **[Common Errors](./troubleshooting/COMMON_ERRORS.md)** - Frequent issues and solutions
- **[Performance Issues](./troubleshooting/PERFORMANCE_ISSUES.md)** - Debugging slow pages
- **[Database Issues](./troubleshooting/DATABASE_ISSUES.md)** - Database problems
- **[Build Errors](./troubleshooting/BUILD_ERRORS.md)** - TypeScript/build failures
- **[Deployment Issues](./troubleshooting/DEPLOYMENT_ISSUES.md)** - Deployment troubleshooting

### 👥 Team & Processes
- **[Onboarding - Developer](./onboarding/NEW_DEVELOPER.md)** - For new developers
- **[Onboarding - Designer](./onboarding/NEW_DESIGNER.md)** - For new designers
- **[Onboarding - Content Editor](./onboarding/NEW_CONTENT_EDITOR.md)** - For content team
- **[Team Practices](./onboarding/TEAM_PRACTICES.md)** - Workflows and ceremonies
- **[Code Review Guide](./onboarding/CODE_REVIEW_GUIDE.md)** - Review best practices

### 📊 Analytics & SEO
- **[Analytics Setup](./GA4-FUNNEL-SETUP.md)** - Google Analytics 4 configuration
- **[SEO Comprehensive Plan](./SEO_COMPREHENSIVE_PLAN.md)** - Complete SEO strategy
- **[Local SEO](./google-business-profile.md)** - Google Business Profile optimization
- **[Citations Strategy](./local-citations.md)** - Local citation building

### 📱 User Experience
- **[Mobile Experience](./MOBILE_EXPERIENCE_GUIDE.md)** - Mobile optimization guide
- **[Interaction Design](./INTERACTION_DESIGN_GUIDE.md)** - Interaction patterns
- **[Loading States](./LOADING_STATES_GUIDE.md)** - Loading UI patterns
- **[Forms Guide](./forms/PREMIUM_FORMS_GUIDE.md)** - Form design and validation
- **[PWA Implementation](./PWA_IMPLEMENTATION.md)** - Progressive Web App features

### 🔒 Security & Compliance
- **[Security Guide](./developer-guides/SECURITY_GUIDE.md)** - Security best practices
- **[WCAG Compliance](./WCAG_COMPLIANCE_CHECKLIST.md)** - Accessibility compliance
- **[Privacy Policy](./legal/PRIVACY_POLICY.md)** - Privacy documentation
- **[Data Protection](./legal/DATA_PROTECTION.md)** - GDPR/CCPA compliance

### 📧 Marketing & Communication
- **[Email Marketing](./email/EMAIL_MARKETING_SYSTEM.md)** - Email campaign system
- **[Social Media](./social/SOCIAL_STRATEGY.md)** - Social media strategy
- **[Video Content](./video/VIDEO_STRATEGY.md)** - Video production guide
- **[Content Calendar](./social/CONTENT_CALENDAR.md)** - Content planning

### 📖 Knowledge Base
- **[Glossary](./knowledge-base/GLOSSARY.md)** - Project terminology
- **[Best Practices](./knowledge-base/BEST_PRACTICES.md)** - Development best practices
- **[Code Patterns](./knowledge-base/CODE_PATTERNS.md)** - Reusable patterns
- **[Lessons Learned](./knowledge-base/LESSONS_LEARNED.md)** - Project insights
- **[FAQ](./knowledge-base/FAQ.md)** - Frequently asked questions

## 🔍 Quick Links

### Most Used Docs
- [Quick Start](./onboarding/QUICK_START.md)
- [API Reference](./api/README.md)
- [Component Library](./components/README.md)
- [Deployment Guide](./runbooks/DEPLOYMENT_RUNBOOK.md)

### Emergency Runbooks
- [Incident Response](./runbooks/INCIDENT_RESPONSE.md)
- [Rollback Procedure](./runbooks/ROLLBACK_RUNBOOK.md)
- [Database Recovery](./runbooks/DATABASE_RECOVERY.md)

### Development
- [Setup Guide](./developer-guides/SETUP.md)
- [Testing Guide](./developer-guides/TESTING_GUIDE.md)
- [Debugging Guide](./developer-guides/DEBUGGING_GUIDE.md)

## 📦 Tech Stack Overview

```
Frontend:
  - Next.js 15.x (App Router)
  - React 18
  - TypeScript 5.x
  - Tailwind CSS
  - shadcn/ui Components

Backend:
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL (Vercel Postgres)
  - Supabase (Auth & Storage)

Infrastructure:
  - Vercel (Hosting)
  - GitHub (Version Control)
  - GitHub Actions (CI/CD)

Third-Party Services:
  - Stripe (Payments)
  - Resend (Email)
  - PostHog (Analytics)
  - Vercel Analytics (Web Vitals)
```

## 🎯 Project Goals

1. **Premium User Experience** - Luxury brand feel with elegant design
2. **Performance First** - Fast load times and smooth interactions
3. **Accessibility** - WCAG 2.1 AA compliance for all users
4. **SEO Optimized** - High search rankings and visibility
5. **Conversion Focused** - Optimized quote request and lead generation

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Quality Checks
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks
npm run test             # Run test suite

# Optimization
npm run analyze          # Analyze bundle size
npm run image:optimize   # Optimize images
npm run validate:performance  # Performance checks
```

## 📞 Support & Contact

- **Project Lead**: Spencer Carroll
- **Documentation Issues**: [Create an issue](https://github.com/pgclosets/store/issues)
- **Technical Questions**: See [FAQ](./knowledge-base/FAQ.md)
- **Emergency**: See [Incident Response](./runbooks/INCIDENT_RESPONSE.md)

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) before submitting pull requests.

## 📄 License

This project is proprietary software. See [LICENSE](../LICENSE) for details.

## 🔄 Documentation Updates

This documentation is continuously updated. Last major update: October 2025

To update documentation:
1. Make changes in the `/docs` directory
2. Test all code examples
3. Update the relevant index files
4. Submit a PR with clear description
5. Ensure docs are reviewed before merge

---

**Note**: If you find any documentation issues, please [create an issue](https://github.com/pgclosets/store/issues) or submit a pull request with improvements.
