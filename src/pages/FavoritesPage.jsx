import { Container, Row, Col } from 'react-bootstrap'
import PageHeader from '../components/PageHeader'
import CafeCard from '../components/CafeCard'
import { useFavorites } from '../contexts/FavoritesContext'
import { useCafeImages } from '../hooks/useCafeImages'

function FavoritesPage() {
  const { favorites } = useFavorites()
  const { imageByCafeId } = useCafeImages(favorites)

  return (
    <>
      <PageHeader
        title="Your Bookmarked Cafes"
        subtitle="Save cafes you want to revisit later."
      />
      <Container className="py-4">
        {favorites.length === 0 ? (
          <p className="text-muted mb-0">
            You don’t have any bookmarks yet. Browse cafes and hit “Bookmark”.
          </p>
        ) : (
          <Row>
            {favorites.map(cafe => (
              <Col md={4} key={cafe.id} className="mb-4">
                <CafeCard cafe={cafe} imageUrl={imageByCafeId[cafe.id]} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  )
}

export default FavoritesPage

