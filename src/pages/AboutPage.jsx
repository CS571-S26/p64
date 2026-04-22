import { Container } from 'react-bootstrap'
import PageHeader from '../components/PageHeader'

function AboutPage() {
  return (
    <>
      <PageHeader
        title="About CafeFinder"
        subtitle="A simple way to discover cafes, compare ratings, and browse by location and price."
      />
      <Container className="py-5">
        <h2 className="h4">How it works</h2>
        <ul>
          <li>Use Search to find cafes by name or neighborhood</li>
          <li>Filter results by price</li>
          <li>Open any cafe to see details</li>
        </ul>
      </Container>
    </>
  )
}

export default AboutPage