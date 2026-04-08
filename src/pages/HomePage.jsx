import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import cafes from '../data/cafes'
import CafeCard from '../components/CafeCard'

function HomePage() {
  return (
    <>
      <section className="hero-section py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1>Find your next favorite cafe</h1>
              <p>
                Explore cozy study spots, brunch cafes, and specialty coffee places
                near you.
              </p>
              <Button as={Link} to="/search" variant="dark">
                Search Cafes
              </Button>
            </Col>
            <Col md={6}>
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
                alt="Cafe interior"
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

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