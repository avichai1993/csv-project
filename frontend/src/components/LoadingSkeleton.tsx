/**
 * Loading Skeleton Component
 *
 * Displays placeholder content while data is loading.
 * Provides better UX than a simple spinner.
 */

import { Table, Placeholder, Card } from "react-bootstrap";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

/**
 * Table loading skeleton
 */
export function TableSkeleton({
  rows = 5,
  columns = 7,
}: TableSkeletonProps) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i}>
              <Placeholder animation="glow">
                <Placeholder xs={8} />
              </Placeholder>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex}>
                <Placeholder animation="glow">
                  <Placeholder xs={Math.floor(Math.random() * 4) + 6} />
                </Placeholder>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

/**
 * Card loading skeleton
 */
export function CardSkeleton() {
  return (
    <Card>
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={6} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{" "}
          <Placeholder xs={6} /> <Placeholder xs={8} />
        </Placeholder>
      </Card.Body>
    </Card>
  );
}

/**
 * Form loading skeleton
 */
export function FormSkeleton() {
  return (
    <div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="mb-3">
          <Placeholder animation="glow">
            <Placeholder xs={3} className="mb-2" />
          </Placeholder>
          <Placeholder animation="glow">
            <Placeholder
              xs={12}
              size="lg"
              style={{ height: "38px", borderRadius: "4px" }}
            />
          </Placeholder>
        </div>
      ))}
    </div>
  );
}

/**
 * Simple inline loading indicator
 */
export function InlineLoader() {
  return (
    <span className="d-inline-flex align-items-center">
      <span
        className="spinner-border spinner-border-sm me-2"
        role="status"
        aria-hidden="true"
      />
      Loading...
    </span>
  );
}

export default TableSkeleton;
