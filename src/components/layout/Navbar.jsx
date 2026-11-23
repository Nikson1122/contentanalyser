import { useLocation } from 'react-router-dom'
import { Bell, Menu, Search, UserRound } from 'lucide-react'
import { navigation } from '../../constants/navigation'

function useCurrentTitle() {
  const { pathname } = useLocation()
  const match = [...navigation]
    .sort((a, b) => b.to.length - a.to.length)
    .find((item) => (item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)))
  return match?.label ?? 'CreatorPulse AI'
}

export default function Navbar({ onOpenMobileNav }) {
  const title = useCurrentTitle()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-surface-950/70 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <h2 className="truncate text-sm font-semibold text-slate-100">{title}</h2>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search"
            aria-label="Search"
            className="h-9 w-44 rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 transition-colors hover:border-white/20 focus:border-accent-500/60 focus:bg-white/[0.07] md:w-64"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl p-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Bell className="size-5" aria-hidden="true" />
          <span
            className="absolute right-2 top-2 size-1.5 rounded-full bg-accent-400 ring-2 ring-surface-950"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          aria-label="Account"
          className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-surface-700 to-surface-850 text-slate-300 shadow-inner shadow-white/5 transition-colors hover:border-accent-500/40 hover:text-white"
        >
          <UserRound className="size-[18px]" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
