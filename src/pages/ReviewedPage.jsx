import { Container, Row, Col } from 'react-bootstrap'
import PageHeader from '../components/PageHeader'
import CafeCard from '../components/CafeCard'
import { useCafeImages } from '../hooks/useCafeImages'
import { useReviews } from '../contexts/ReviewsContext'

function ReviewedPage() {
  const { reviewedCafes } = useReviews()
  const cafes = reviewedCafes.map(r => r.cafeSummary)
  const { imageByCafeId } = useCafeImages(cafes)

  return (
    <>
      <PageHeader
        title="Your Reviewed Cafes"
        subtitle="See every cafe you have reviewed and your latest rating."
      />

      <Container className="py-4">
        {reviewedCafes.length === 0 ? (
          <p className="text-muted mb-0">
            You have not reviewed any cafes yet. Open a cafe and submit your review.
          </p>
        ) : (
          <Row>
            {reviewedCafes.map(({ cafeSummary, text, updatedAt }) => (
              <Col md={6} lg={4} key={cafeSummary.id} className="mb-4">
                <CafeCard
                  cafe={cafeSummary}
                  imageUrl={imageByCafeId[cafeSummary.id]}
                  reviewText={text}
                  showReviewMeta
                  updatedAt={updatedAt}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  )
}

export default ReviewedPage

