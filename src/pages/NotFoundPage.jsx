import { Button, Container } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

function NotFoundPage() {
  const location = useLocation()

  return (
    <>
      <PageHeader
        title="Page not found"
        subtitle="That route doesn’t exist in CafeFinder."
      />
      <Container className="py-5">
        <p className="text-muted">
          Requested path: <code>{location.pathname}</code>
        </p>
        <div className="d-flex gap-2">
          <Button as={Link} to="/" variant="dark">
            Go Home
          </Button>
          <Button as={Link} to="/search" variant="outline-dark">
            Search Cafes
          </Button>
        </div>
      </Container>
    </>
  )
}

export default NotFoundPage
