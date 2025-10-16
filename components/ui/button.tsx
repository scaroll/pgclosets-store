// TEMPORARY: Button redirects to AppleButton while OnceUI is disabled
// This maintains backward compatibility while avoiding OnceUI Next.js 15 issues
// See WAVE1_AGENT2_NEXTJS15_CRITICAL_ISSUE.md for details

export { AppleButton as Button, appleButtonVariants as buttonVariants, type AppleButtonProps as ButtonProps } from './AppleButton'
