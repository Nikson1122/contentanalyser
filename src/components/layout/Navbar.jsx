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
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/5 bg-surface-950/80 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <h2 className="truncate text-sm font-medium text-slate-200">{title}</h2>

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
            className="h-9 w-44 rounded-lg border border-white/10 bg-surface-900 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 transition-colors focus:border-accent-500/60 md:w-64"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Bell className="size-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="Account"
          className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-surface-800 text-slate-300 transition-colors hover:border-accent-500/40 hover:text-white"
        >
          <UserRound className="size-[18px]" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
