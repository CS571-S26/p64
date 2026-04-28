import { Form } from 'react-bootstrap'

function FilterPanel({ accessibilityFilter, setAccessibilityFilter }) {
  return (
    <Form.Group controlId="accessibilityFilter">
      <Form.Label>Filter</Form.Label>
      <Form.Select
        value={accessibilityFilter}
        onChange={(e) => setAccessibilityFilter(e.target.value)}
      >
        <option value="All">All cafes</option>
        <option value="WheelchairYes">Wheelchair accessible</option>
        <option value="OutdoorSeatingYes">Outdoor seating</option>
        <option value="TakeawayYes">Takeaway available</option>
      </Form.Select>
    </Form.Group>
  )
}

export default FilterPanel