import { Route, Routes } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import { PagesProvider } from './context/PagesContext'
import { ImportsProvider } from './context/ImportsContext'
import Dashboard from './pages/Dashboard'
import MyPages from './pages/MyPages'
import CsvImports from './pages/CsvImports'
import ModulePlaceholder from './pages/ModulePlaceholder'
import NotFound from './pages/NotFound'

const PLACEHOLDER_ROUTES = [
  {
    path: '/analytics',
    eyebrow: 'Analytics',
    title: 'Performance analytics',
    description: 'Trends and breakdowns for the pages you manage.',
    note: 'Analytics appear once a page has data to analyse.',
  },
  {
    path: '/competitors',
    eyebrow: 'Competitor Research',
    title: 'Competitor research',
    description: 'Track what is working across accounts in your categories.',
    note: 'Research tooling is not wired up in this foundation.',
  },
  {
    path: '/studio',
    eyebrow: 'AI Content Studio',
    title: 'AI Content Studio',
    description: 'Draft, refine and repurpose content per page.',
    note: 'Generation is not connected in this UI-only build.',
  },
  {
    path: '/calendar',
    eyebrow: 'Content Calendar',
    title: 'Content calendar',
    description: 'Plan and schedule what goes out, per page.',
    note: 'Scheduling is not available yet.',
  },
  {
    path: '/settings',
    eyebrow: 'Settings',
    title: 'Workspace settings',
    description: 'Preferences for your workspace and connected pages.',
    note: 'Settings are added as modules come online.',
  },
]

export default function App() {
  return (
    <PagesProvider>
      <ImportsProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/pages" element={<MyPages />} />
            <Route path="/imports" element={<CsvImports />} />
            {PLACEHOLDER_ROUTES.map(({ path, ...props }) => (
              <Route key={path} path={path} element={<ModulePlaceholder {...props} />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ImportsProvider>
    </PagesProvider>
  )
}
