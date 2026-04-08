import { Form } from 'react-bootstrap'

function FilterPanel({ priceFilter, setPriceFilter }) {
  return (
    <Form.Select
      value={priceFilter}
      onChange={(e) => setPriceFilter(e.target.value)}
    >
      <option value="All">All Prices</option>
      <option value="$">$</option>
      <option value="$$">$$</option>
      <option value="$$$">$$$</option>
    </Form.Select>
  )
}

export default FilterPanel