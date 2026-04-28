import { Alert, Spinner } from 'react-bootstrap'

function LoadingState({ loading, error, children }) {
  if (loading) {
    return (
      <div className="d-flex align-items-center gap-3 py-4" role="status" aria-live="polite">
        <Spinner animation="border" />
        <div>Loading cafes…</div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        <Alert.Heading className="h5">We couldn’t load cafes</Alert.Heading>
        <p className="mb-0">
          Please try again in a moment. (Overpass can be busy.)
        </p>
      </Alert>
    )
  }

  return children
}

export default LoadingState

