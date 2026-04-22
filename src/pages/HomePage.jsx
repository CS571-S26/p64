import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import cafes from '../data/cafes'
import CafeCard from '../components/CafeCard'
import PageHeader from '../components/PageHeader'

function HomePage() {
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
                <li>Search by name or neighborhood</li>
                <li>Filter by price</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>

      <Container className="py-5">
        <h2 className="mb-4">Featured Cafes</h2>
        <Row>
          {cafes.slice(0, 3).map(cafe => (
            <Col md={4} key={cafe.id} className="mb-4">
              <CafeCard cafe={cafe} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}

export default HomePage