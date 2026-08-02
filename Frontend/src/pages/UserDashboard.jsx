import { useUser } from "../hooks/user/userUser"
import Loader from "../layouts/ui/Loader"
const UserDashboard = () => {
  const {data: user, error, isLoading} = useUser()
  console.log(user)
  if(isLoading) return <Loader />
  if(error) return <div>{error}</div>
  return (
    <div className="container py-4">
      {/* Welcome Section */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h2 className="fw-bold mb-1">Welcome Back 👋</h2>
          <p className="text-muted mb-0">
            Track your job applications and progress here.
          </p>
        </div>
      </div>

      {/* user Cards */}
      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="fs-1 mb-2">📄</div>
              <h3 className="fw-bold text-primary">
                {user?.totalAppliedJobs}
              </h3>
              <p className="text-muted mb-0">Applied Jobs</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="fs-1 mb-2">⏳</div>
              <h3 className="fw-bold text-warning">
                {user?.totalPendingApplications}
              </h3>
              <p className="text-muted mb-0">Pending</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="fs-1 mb-2">✅</div>
              <h3 className="fw-bold text-success">
                {user?.totalApprovedApplications}
              </h3>
              <p className="text-muted mb-0">Approved</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="fs-1 mb-2">❌</div>
              <h3 className="fw-bold text-danger">
                {user?.totalRejectedApplications}
              </h3>
              <p className="text-muted mb-0">Rejected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard