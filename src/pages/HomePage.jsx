import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CafeCard from '../components/CafeCard'
import PageHeader from '../components/PageHeader'
import LoadingState from '../components/LoadingState'
import { useCafes } from '../hooks/useCafes'
import { useCafeImages } from '../hooks/useCafeImages'

function HomePage() {
  const { cafes, loading, error } = useCafes()
  const { imageByCafeId } = useCafeImages(cafes)

  return (
    <>
      <PageHeader
        title="Find local cafes!"
        subtitle="Explore cozy study spots, brunch cafes, and specialty coffee places near you."
      >
        <Button as={Link} to="/search" variant="dark">
          Search Cafes
        </Button>
      </PageHeader>

      <Container className="py-5">
        <Row className="align-items-center g-4">
          <Col md={6}>
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
              alt="Cafe interior"
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col md={6}>
            <div className="p-4 border rounded bg-white shadow-sm">
              <h2 className="h4 mb-2">What you can do</h2>
              <ul className="mb-0">
                <li>Browse featured cafes</li>
                <li>Search by name or address</li>
                <li>Filter by accessibility and amenities</li>
                <li>Bookmark cafes to revisit later</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>

      <Container className="py-5">
        <h2 className="mb-4">Featured Cafes</h2>
        <LoadingState loading={loading} error={error}>
          <Row>
            {cafes.slice(0, 3).map(cafe => (
              <Col md={4} key={cafe.id} className="mb-4">
                <CafeCard
                  cafe={cafe}
                  imageUrl={imageByCafeId[cafe.id]}
                  showRatingLabel={false}
                />
              </Col>
            ))}
          </Row>
        </LoadingState>
      </Container>
    </>
  )
}

export default HomePage