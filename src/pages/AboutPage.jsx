import { Container } from 'react-bootstrap'
import PageHeader from '../components/PageHeader'

function AboutPage() {
  return (
    <>
      <PageHeader
        title="About CafeFinder"
        subtitle="A simple way to discover cafes using OpenStreetMap data and save your favorites."
      />
      <Container className="py-5">
        <h2 className="h4">How it works</h2>
        <ul>
          <li>Search for cafes in Dane County pulled from the Overpass API</li>
          <li>Filter for wheelchair access, outdoor seating, or takeaway</li>
          <li>Bookmark cafes and revisit them on the Bookmarks page</li>
          <li>Write reviews and see all reviewed cafes on the Reviews page</li>
        </ul>
      </Container>
    </>
  )
}

export default AboutPage