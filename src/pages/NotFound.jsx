import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <EmptyState
      icon={Compass}
      title="Page not found"
      description="That route does not exist in this workspace."
      action={
        <Button as={Link} to="/">
          Back to overview
        </Button>
      }
      className="mt-10"
    />
  )
}
