import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface DetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  width?: string
}

export default function DetailDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'max-w-md',
}: DetailDrawerProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px] transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className={`fixed inset-y-0 right-0 pl-10 ${width} w-full flex pointer-events-auto`}>
        <div className="w-full bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col animate-drawer">
          {/* Header */}
          <div className="px-6 py-4 border-b border-outline-variant/40 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-base font-bold text-on-surface leading-tight">{title}</h3>
              {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {children}
          </div>

          {/* Footer actions */}
          {footer && (
            <div className="px-6 py-4 border-t border-outline-variant/40 bg-surface-container-low/50 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
