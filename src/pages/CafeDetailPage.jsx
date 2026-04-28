import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Card, Button, ListGroup, Form } from 'react-bootstrap'
import PageHeader from '../components/PageHeader'
import LoadingState from '../components/LoadingState'
import BookmarkButton from '../components/BookmarkButton'
import { fetchCafeByOsmId } from '../api/overpass'
import { getCafeFallbackImageUrl } from '../utils/images'
import { useReviews } from '../contexts/ReviewsContext'

function CafeDetailPage() {
  const { osmType, osmId } = useParams()
  const [cafe, setCafe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rating, setRating] = useState('5')
  const [reviewText, setReviewText] = useState('')
  const { getReview, upsertReview, removeReview } = useReviews()

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchCafeByOsmId({ osmType, osmId, signal: controller.signal })
      .then(result => setCafe(result))
      .catch(err => {
        if (err?.name === 'AbortError') return
        setError(err)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [osmType, osmId])

  useEffect(() => {
    if (!cafe?.id) return
    const existing = getReview(cafe.id)
    if (!existing) {
      setRating('5')
      setReviewText('')
      return
    }
    setRating(String(existing.rating))
    setReviewText(existing.text || '')
  }, [cafe?.id, getReview])

  const handleSubmitReview = (e) => {
    e.preventDefault()
    if (!cafe) return
    upsertReview({
      cafe,
      rating: Number(rating),
      text: reviewText,
    })
  }

  const handleDeleteReview = () => {
    if (!cafe?.id) return
    removeReview(cafe.id)
    setRating('5')
    setReviewText('')
  }

  return (
    <>
      <PageHeader
        title={cafe?.name || 'Cafe details'}
        subtitle={cafe?.location || 'Loading location…'}
      >
        <div className="d-flex gap-2">
          <Button as={Link} to="/search" variant="outline-dark">
            Back to Search
          </Button>
          {cafe ? <BookmarkButton cafe={cafe} size="sm" /> : null}
        </div>
      </PageHeader>

      <Container className="py-5">
        <LoadingState loading={loading} error={error}>
          {!cafe ? (
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="h5 mb-2">Cafe not found</h2>
                <p className="text-muted mb-0">
                  This usually means the link is invalid or the cafe is no longer in OpenStreetMap.
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <Card.Img
                variant="top"
                src={cafe.image || getCafeFallbackImageUrl(cafe, { variant: 'hero' })}
                alt={cafe.image ? `Photo of ${cafe.name}` : `Cafe photo placeholder for ${cafe.name}`}
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
              <Card.Body>
                {cafe.description ? <Card.Text>{cafe.description}</Card.Text> : null}
                <ListGroup variant="flush">
                  {cafe.openingHours ? (
                    <ListGroup.Item>
                      <strong>Hours:</strong> {cafe.openingHours}
                    </ListGroup.Item>
                  ) : null}
                  {cafe.wheelchair ? (
                    <ListGroup.Item>
                      <strong>Wheelchair:</strong> {cafe.wheelchair}
                    </ListGroup.Item>
                  ) : null}
                  {cafe.outdoorSeating ? (
                    <ListGroup.Item>
                      <strong>Outdoor seating:</strong> {cafe.outdoorSeating}
                    </ListGroup.Item>
                  ) : null}
                  {cafe.takeaway ? (
                    <ListGroup.Item>
                      <strong>Takeaway:</strong> {cafe.takeaway}
                    </ListGroup.Item>
                  ) : null}
                  {cafe.website ? (
                    <ListGroup.Item>
                      <strong>Website:</strong>{' '}
                      <a href={cafe.website} target="_blank" rel="noreferrer">
                        {cafe.website}
                      </a>
                    </ListGroup.Item>
                  ) : null}
                  {cafe.phone ? (
                    <ListGroup.Item>
                      <strong>Phone:</strong> {cafe.phone}
                    </ListGroup.Item>
                  ) : null}
                </ListGroup>

                <hr />

                <section aria-labelledby="review-heading">
                  <h2 id="review-heading" className="h5 mb-3">Your Review</h2>
                  <Form onSubmit={handleSubmitReview}>
                    <Form.Group className="mb-3" controlId="reviewRating">
                      <Form.Label>Rating</Form.Label>
                      <Form.Select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Okay</option>
                        <option value="2">2 - Poor</option>
                        <option value="1">1 - Very poor</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="reviewText">
                      <Form.Label>Review notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="What did you like? Atmosphere, drinks, seating, Wi-Fi..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                      />
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button type="submit" variant="dark">Save Review</Button>
                      {getReview(cafe.id) ? (
                        <Button type="button" variant="outline-danger" onClick={handleDeleteReview}>
                          Delete Review
                        </Button>
                      ) : null}
                    </div>
                  </Form>
                </section>
              </Card.Body>
            </Card>
          )}
        </LoadingState>
      </Container>
    </>
  )
}

export default CafeDetailPage