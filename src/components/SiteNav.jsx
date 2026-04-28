import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useFavorites } from '../contexts/FavoritesContext'
import { useReviews } from '../contexts/ReviewsContext'

function SiteNav() {
  const { favoriteCount } = useFavorites()
  const { reviewCount } = useReviews()

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">CafeFinder</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/search">Search</Nav.Link>
            <Nav.Link as={Link} to="/favorites">
              Bookmarks{favoriteCount ? ` (${favoriteCount})` : ''}
            </Nav.Link>
            <Nav.Link as={Link} to="/reviews">
              Reviews{reviewCount ? ` (${reviewCount})` : ''}
            </Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default SiteNav