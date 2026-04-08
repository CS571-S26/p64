import { useParams } from 'react-router-dom'
import { Container, Card } from 'react-bootstrap'
import cafes from '../data/cafes'

function CafeDetailPage() {
  const { id } = useParams()
  const cafe = cafes.find(c => c.id === Number(id))

  if (!cafe) {
    return (
      <Container className="py-5">
        <h2>Cafe not found</h2>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Img
          variant="top"
          src={cafe.image}
          alt={cafe.name}
          style={{ maxHeight: '400px', objectFit: 'cover' }}
        />
        <Card.Body>
          <Card.Title>{cafe.name}</Card.Title>
          <Card.Text>
            <strong>Location:</strong> {cafe.location} <br />
            <strong>Rating:</strong> {cafe.rating} <br />
            <strong>Price:</strong> {cafe.price}
          </Card.Text>
          <Card.Text>{cafe.description}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default CafeDetailPage