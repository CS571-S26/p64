import { Button } from 'react-bootstrap'
import { useFavorites } from '../contexts/FavoritesContext'

function BookmarkButton({ cafe, size = 'sm', variant = 'outline-primary' }) {
  const { isFavorited, toggleFavorite } = useFavorites()

  const active = isFavorited(cafe?.id)
  const label = active ? 'Remove bookmark' : 'Bookmark'

  return (
    <Button
      type="button"
      size={size}
      variant={active ? 'primary' : variant}
      onClick={() => toggleFavorite(cafe)}
      aria-pressed={active}
      aria-label={label}
    >
      {active ? 'Bookmarked' : 'Bookmark'}
    </Button>
  )
}

export default BookmarkButton

