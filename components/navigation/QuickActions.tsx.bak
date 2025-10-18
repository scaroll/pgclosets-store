"use client"

import Link from "next/link"
import { Mail, Image as ImageIcon, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { trackNavigationClick } from "@/lib/analytics/enhanced-tracking"

interface QuickAction {
  label: string
  href: string
  icon: React.ReactNode
  variant: "primary" | "secondary" | "outline"
  description?: string
}

const quickActions: QuickAction[] = [
  {
    label: "Free Quote",
    href: "/request-work",
    icon: <Calendar className="w-4 h-4" />,
    variant: "primary",
    description: "Get instant estimate",
  },
  {
    label: "Gallery",
    href: "/gallery",
    icon: <ImageIcon className="w-4 h-4" />,
    variant: "outline",
    description: "View our work",
  },
  {
    label: "Contact",
    href: "/contact",
    icon: <Mail className="w-4 h-4" />,
    variant: "outline",
    description: "Get in touch",
  },
]

export function QuickActions() {
  return (
    <div className="flex items-center gap-2">
      {quickActions.map((action) => {
        const isPrimary = action.variant === "primary"

        return (
          <Link
            key={action.href}
            href={action.href}
            onClick={() => trackNavigationClick({
              link_text: action.label,
              link_url: action.href,
              menu_section: 'quick_actions',
              destination_type: 'internal',
            })}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
              isPrimary
                ? "bg-black text-white hover:bg-gray-800 shadow-sm hover:shadow-md"
                : action.variant === "secondary"
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
            )}
            title={action.description}
          >
            <span className={cn(
              "transition-transform duration-200",
              "group-hover:scale-110"
            )}>
              {action.icon}
            </span>
            <span className="hidden xl:inline">{action.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

// Mobile Quick Actions Bar
export function MobileQuickActions() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 lg:hidden">
      <div className="grid grid-cols-3 gap-1 p-2">
        {quickActions.map((action) => {
          const isPrimary = action.variant === "primary"

          return (
            <Link
              key={action.href}
              href={action.href}
              onClick={() => trackNavigationClick({
                link_text: action.label,
                link_url: action.href,
                menu_section: 'mobile_quick_actions',
                destination_type: 'internal',
              })}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 rounded-lg transition-colors",
                isPrimary
                  ? "bg-black text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              )}
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
