import { NavLink } from 'react-router-dom'
import { Activity, ChevronsLeft, ChevronsRight, X } from 'lucide-react'
import { navigation } from '../../constants/navigation'

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const width = collapsed ? 'lg:w-[76px]' : 'lg:w-64'

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-30 bg-surface-950/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-surface-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl transition-[transform,width] duration-200 ease-out lg:translate-x-0 ${width} ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-glow-500 text-surface-950 shadow-lg shadow-accent-500/30 ring-1 ring-inset ring-white/25">
            <Activity className="size-5" aria-hidden="true" />
          </span>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">CreatorPulse AI</p>
              <p className="truncate text-[11px] text-accent-400/80">Content intelligence</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Main navigation">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onCloseMobile}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-accent-500/20 to-accent-500/[0.04] font-semibold text-white shadow-inner shadow-accent-500/10 ring-1 ring-accent-500/25'
                    : 'text-slate-400 hover:translate-x-0.5 hover:bg-white/5 hover:text-slate-100'
                } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <span
                      className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-accent-400 shadow-[0_0_12px_2px] shadow-accent-400/50"
                      aria-hidden="true"
                    />
                  ) : null}
                  <Icon
                    className={`size-[18px] shrink-0 transition-colors ${
                      isActive ? 'text-accent-300' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                    aria-hidden="true"
                  />
                  <span className={collapsed ? 'lg:hidden' : ''}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse control */}
        <div className="hidden border-t border-white/10 p-3 lg:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100 ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            {collapsed ? (
              <ChevronsRight className="size-[18px]" aria-hidden="true" />
            ) : (
              <>
                <ChevronsLeft className="size-[18px]" aria-hidden="true" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
