import { Form } from 'react-bootstrap'

function SearchBar({ searchText, setSearchText }) {
  return (
    <Form.Group controlId="searchText">
      <Form.Label>Search</Form.Label>
      <Form.Control
        type="text"
        placeholder="Search by cafe name or address…"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        autoComplete="off"
      />
    </Form.Group>
  )
}

export default SearchBar