import { useEffect, useMemo, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import CafeCard from '../components/CafeCard'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import PageHeader from '../components/PageHeader'
import LoadingState from '../components/LoadingState'
import { useCafes } from '../hooks/useCafes'
import ResultsPagination from '../components/ResultsPagination'
import { useCafeImages } from '../hooks/useCafeImages'

function SearchPage() {
  const [searchText, setSearchText] = useState('')
  const [accessibilityFilter, setAccessibilityFilter] = useState('All')
  const [page, setPage] = useState(1)
  const { cafes, loading, error } = useCafes()
  const { imageByCafeId } = useCafeImages(cafes)

  useEffect(() => {
    setPage(1)
  }, [searchText, accessibilityFilter])

  const filteredCafes = useMemo(() => {
    const q = searchText.trim().toLowerCase()

    return cafes.filter(cafe => {
      const matchesSearch =
        !q ||
        cafe.name.toLowerCase().includes(q) ||
        cafe.location.toLowerCase().includes(q)

      const matchesAccessibility = (() => {
        if (accessibilityFilter === 'All') return true
        if (accessibilityFilter === 'WheelchairYes') return cafe.wheelchair === 'yes'
        if (accessibilityFilter === 'OutdoorSeatingYes') return cafe.outdoorSeating === 'yes'
        if (accessibilityFilter === 'TakeawayYes') return cafe.takeaway === 'yes'
        return true
      })()

      return matchesSearch && matchesAccessibility
    })
  }, [cafes, searchText, accessibilityFilter])

  const pageSize = 21
  const totalPages = Math.max(1, Math.ceil(filteredCafes.length / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const startIdx = (safePage - 1) * pageSize
  const pagedCafes = filteredCafes.slice(startIdx, startIdx + pageSize)

  return (
    <>
      <PageHeader
        title="Search Cafes"
        subtitle="Search by name or address, then refine with filters."
      />
      <Container className="py-4">
        <Row className="mb-4">
          <Col md={8}>
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
          </Col>
          <Col md={4}>
            <FilterPanel
              accessibilityFilter={accessibilityFilter}
              setAccessibilityFilter={setAccessibilityFilter}
            />
          </Col>
        </Row>

        <LoadingState loading={loading} error={error}>
          <Row>
            {pagedCafes.map(cafe => (
              <Col md={4} key={cafe.id} className="mb-4">
                <CafeCard
                  cafe={cafe}
                  imageUrl={imageByCafeId[cafe.id]}
                  showRatingLabel={false}
                />
              </Col>
            ))}
          </Row>

          <ResultsPagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </LoadingState>
      </Container>
    </>
  )
}

export default SearchPage