import { Construction } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

/**
 * Shared shell for modules that are routed but not implemented yet.
 * Replace a route's element with a real screen when that module is built.
 */
export default function ModulePlaceholder({ eyebrow, title, description, note }) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <EmptyState icon={Construction} title="Coming soon" description={note} />
    </>
  )
}
