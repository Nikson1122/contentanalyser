import {
  LayoutDashboard,
  Layers,
  FileSpreadsheet,
  BarChart3,
  Telescope,
  Sparkles,
  FlaskConical,
  CalendarDays,
  Settings,
} from 'lucide-react'

/**
 * Single source of truth for sidebar + routing.
 * Add a module here and it appears in the sidebar automatically.
 */
export const navigation = [
  { label: 'Overview', to: '/', icon: LayoutDashboard, end: true },
  { label: 'My Pages', to: '/pages', icon: Layers },
  { label: 'CSV Imports', to: '/imports', icon: FileSpreadsheet },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Competitor Research', to: '/competitors', icon: Telescope },
  { label: 'AI Content Studio', to: '/studio', icon: Sparkles },
  { label: 'Video Learning Lab', to: '/video-lab', icon: FlaskConical },
  { label: 'Content Calendar', to: '/calendar', icon: CalendarDays },
  { label: 'Settings', to: '/settings', icon: Settings },
]
