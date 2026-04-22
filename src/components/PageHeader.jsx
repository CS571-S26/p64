import { Container } from 'react-bootstrap'

function PageHeader({ title, subtitle, children }) {
  return (
    <section className="py-4 bg-light border-bottom">
      <Container>
        <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3">
          <div>
            <h1 className="mb-1">{title}</h1>
            {subtitle ? <p className="text-muted mb-0">{subtitle}</p> : null}
          </div>
          {children ? <div className="flex-shrink-0">{children}</div> : null}
        </div>
      </Container>
    </section>
  )
}

export default PageHeader
