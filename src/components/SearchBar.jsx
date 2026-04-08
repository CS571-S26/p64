import { Form } from 'react-bootstrap'

function SearchBar({ searchText, setSearchText }) {
  return (
    <Form.Control
      type="text"
      placeholder="Search by cafe name or neighborhood..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
  )
}

export default SearchBar