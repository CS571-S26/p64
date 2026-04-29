import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import BookmarkButton from './BookmarkButton'
import { getCafeFallbackImageUrl } from '../utils/images'
import { useReviews } from '../contexts/ReviewsContext'

function CafeCard({
  cafe,
  imageUrl,
  reviewText,
  showReviewMeta = false,
  updatedAt,
  showRatingLabel = true,
}) {
  const detailPath = cafe?.osmType && cafe?.osmId ? `/cafe/${cafe.osmType}/${cafe.osmId}` : null
  const src = cafe.image || imageUrl || getCafeFallbackImageUrl(cafe, { variant: 'card' })
  const alt = cafe.image || imageUrl ? `Photo of ${cafe.name}` : `Cafe photo placeholder for ${cafe.name}`
  const { getReview } = useReviews()
  const review = getReview(cafe?.id)
  const rating = review?.rating || null
  const stars = rating ? `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}` : null

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={src}
        alt={alt}
        style={{ height: '220px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{cafe.name}</Card.Title>
        <Card.Text>
          {cafe.location}
        </Card.Text>
        <div className="d-flex gap-2">
          <Button
            as={Link}
            to={detailPath || '#'}
            variant="outline-dark"
            disabled={!detailPath}
          >
            View Details
          </Button>
          <BookmarkButton cafe={cafe} />
          {stars ? (
            <span
              className="align-self-center text-warning fw-semibold"
              aria-label={`Your rating: ${rating} out of 5 stars`}
              title={`Your rating: ${rating}/5`}
              style={{
                textShadow: '-0.25px 0 #212529, 0 0.25px #212529, 0.25px 0 #212529, 0 -0.25px #212529',
              }}
            >
              {showRatingLabel ? `Your rating: ${stars}` : stars}
            </span>
          ) : (
            <Button
              as={Link}
              to={detailPath ? `${detailPath}#review-heading` : '#'}
              variant="outline-secondary"
              disabled={!detailPath}
            >
              Review
            </Button>
          )}
        </div>
        {reviewText && !showReviewMeta ? (
          <Card.Text className="mt-3 mb-0 text-muted">
            <strong>Your comment:</strong> {reviewText}
          </Card.Text>
        ) : null}
        {showReviewMeta && rating ? (
          <Card.Text className="mt-2 mb-0 text-muted">
            <strong className="fs-6">Your Review</strong>
            <br />
            <strong>Rating:</strong> {rating}/5
            {reviewText ? (
              <>
                <br />
                <strong>Comment:</strong> {reviewText}
              </>
            ) : null}
            {updatedAt ? (
              <>
                <br />
                <strong>Updated:</strong> {new Date(updatedAt).toLocaleString()}
              </>
            ) : null}
          </Card.Text>
        ) : null}
      </Card.Body>
    </Card>
  )
}

export default CafeCard