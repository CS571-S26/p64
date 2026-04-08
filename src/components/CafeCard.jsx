import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function CafeCard({ cafe }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={cafe.image}
        alt={cafe.name}
        style={{ height: '220px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{cafe.name}</Card.Title>
        <Card.Text>
          {cafe.location} <br />
          Rating: {cafe.rating} <br />
          Price: {cafe.price}
        </Card.Text>
        <Button as={Link} to={`/cafe/${cafe.id}`} variant="outline-dark">
          View Details
        </Button>
      </Card.Body>
    </Card>
  )
}

export default CafeCard