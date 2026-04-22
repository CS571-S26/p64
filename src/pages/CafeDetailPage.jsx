import { useParams, Link } from 'react-router-dom'
import { Container, Card, Button } from 'react-bootstrap'
import cafes from '../data/cafes'
import PageHeader from '../components/PageHeader'

function CafeDetailPage() {
  const { id } = useParams()
  const cafeId = Number(id)
  const cafe = cafes.find(c => c.id === cafeId)

  if (!cafe) {
    return (
      <>
        <PageHeader
          title="Cafe not found"
          subtitle="This usually means the URL is missing/has an invalid cafe id."
        >
          <Button as={Link} to="/search" variant="dark">
            Back to Search
          </Button>
        </PageHeader>
        <Container className="py-5" />
      </>
    )
  }

  return (
    <>
      <PageHeader title={cafe.name} subtitle={`${cafe.location} • ${cafe.price}`}>
        <Button as={Link} to="/search" variant="outline-dark">
          Back to Search
        </Button>
      </PageHeader>
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Img
            variant="top"
            src={cafe.image}
            alt={cafe.name}
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
          <Card.Body>
            <Card.Text>
              <strong>Rating:</strong> {cafe.rating}
            </Card.Text>
            <Card.Text>{cafe.description}</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default CafeDetailPage