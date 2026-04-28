import { Pagination } from 'react-bootstrap'

function range(start, end) {
  const out = []
  for (let i = start; i <= end; i += 1) out.push(i)
  return out
}

function ResultsPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const windowSize = 5
  const half = Math.floor(windowSize / 2)
  let start = Math.max(1, currentPage - half)
  let end = Math.min(totalPages, start + windowSize - 1)
  start = Math.max(1, end - windowSize + 1)

  const pages = range(start, end)

  return (
    <nav aria-label="Cafe results pages" className="d-flex justify-content-center mt-4">
      <Pagination className="mb-0 flex-wrap">
        <Pagination.First
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />

        {start > 1 ? (
          <>
            <Pagination.Item onClick={() => onPageChange(1)} active={currentPage === 1}>
              1
            </Pagination.Item>
            {start > 2 ? <Pagination.Ellipsis disabled /> : null}
          </>
        ) : null}

        {pages.map(p => (
          <Pagination.Item
            key={p}
            active={p === currentPage}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Pagination.Item>
        ))}

        {end < totalPages ? (
          <>
            {end < totalPages - 1 ? <Pagination.Ellipsis disabled /> : null}
            <Pagination.Item
              onClick={() => onPageChange(totalPages)}
              active={currentPage === totalPages}
            >
              {totalPages}
            </Pagination.Item>
          </>
        ) : null}

        <Pagination.Next
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </nav>
  )
}

export default ResultsPagination

