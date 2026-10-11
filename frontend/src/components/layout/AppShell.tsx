import { useState, type ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const sidebarWidth = collapsed ? 64 : 260

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <TopBar />
        <main className="flex-1 p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
