import { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import cafes from '../data/cafes'
import CafeCard from '../components/CafeCard'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'

function SearchPage() {
  const [searchText, setSearchText] = useState('')
  const [priceFilter, setPriceFilter] = useState('All')

  const filteredCafes = cafes.filter(cafe => {
    const matchesSearch =
      cafe.name.toLowerCase().includes(searchText.toLowerCase()) ||
      cafe.location.toLowerCase().includes(searchText.toLowerCase())

    const matchesPrice =
      priceFilter === 'All' || cafe.price === priceFilter

    return matchesSearch && matchesPrice
  })

  return (
    <Container className="py-4">
      <h1 className="mb-4">Search Cafes</h1>

      <Row className="mb-4">
        <Col md={8}>
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
        </Col>
        <Col md={4}>
          <FilterPanel priceFilter={priceFilter} setPriceFilter={setPriceFilter} />
        </Col>
      </Row>

      <Row>
        {filteredCafes.map(cafe => (
          <Col md={4} key={cafe.id} className="mb-4">
            <CafeCard cafe={cafe} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default SearchPage