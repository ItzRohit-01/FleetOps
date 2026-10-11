import { useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { cn } from '../../lib/utils'

interface ToastProps {
  message?: string
  type?: 'success' | 'error' | 'info'
}

export default function Toast(props?: ToastProps) {
  const storeToast = useAppStore(s => s.toast)
  const clearToast = useAppStore(s => s.clearToast)

  const activeToast = (props?.message && props?.type) ? { message: props.message, type: props.type } : storeToast

  useEffect(() => {
    if (activeToast) {
      const t = setTimeout(clearToast, 3500)
      return () => clearTimeout(t)
    }
  }, [activeToast, clearToast])

  if (!activeToast) return null

  const styles = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    info: 'bg-primary-container text-white',
  }
  const icons = { success: 'check_circle', error: 'error', info: 'info' }

  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in',
      styles[activeToast.type]
    )}>
      <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>
        {icons[activeToast.type]}
      </span>
      {activeToast.message}
      <button onClick={clearToast} className="ml-2 opacity-70 hover:opacity-100">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
      </button>
    </div>
  )
}
