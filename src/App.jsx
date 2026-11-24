import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import { SettingsProvider } from './context/SettingsContext'
import { PagesProvider } from './context/PagesContext'
import { ImportsProvider } from './context/ImportsContext'
import { CompetitorsProvider } from './context/CompetitorsContext'
import { StudioProvider } from './context/StudioContext'
import { CalendarProvider } from './context/CalendarContext'
import { VideoLabProvider } from './context/VideoLabContext'
import Dashboard from './pages/Dashboard'
import MyPages from './pages/MyPages'
import CsvImports from './pages/CsvImports'
import Competitors from './pages/Competitors'
import ContentStudio from './pages/ContentStudio'
import ContentCalendar from './pages/ContentCalendar'
import VideoLearningLab from './pages/VideoLearningLab'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

// Charting library is only needed here, so this route is code-split.
const Analytics = lazy(() => import('./pages/Analytics'))

function RouteFallback() {
  return (
    <div className="flex h-64 items-center justify-center text-sm text-slate-500">
      Loading…
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <PagesProvider>
        <ImportsProvider>
          <CompetitorsProvider>
            <StudioProvider>
              <CalendarProvider>
                <VideoLabProvider>
                  <Routes>
                    <Route element={<DashboardLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="/pages" element={<MyPages />} />
                      <Route path="/imports" element={<CsvImports />} />
                      <Route path="/competitors" element={<Competitors />} />
                      <Route path="/studio" element={<ContentStudio />} />
                      <Route path="/calendar" element={<ContentCalendar />} />
                      <Route path="/video-lab" element={<VideoLearningLab />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route
                        path="/analytics"
                        element={
                          <Suspense fallback={<RouteFallback />}>
                            <Analytics />
                          </Suspense>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </VideoLabProvider>
              </CalendarProvider>
            </StudioProvider>
          </CompetitorsProvider>
        </ImportsProvider>
      </PagesProvider>
    </SettingsProvider>
  )
}
