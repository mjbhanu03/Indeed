import { Link } from 'react-router-dom'

const NoDataFound = () => {
  return (
    <div className="text-center py-5">
      <p className="fs-5 text-muted">No Data Found.</p>
      <Link to="/jobs" className="btn btn-outline-primary mt-2">← Back to Jobs</Link>
    </div>
  )
}

export default NoDataFound
