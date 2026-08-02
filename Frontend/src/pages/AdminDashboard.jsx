import { useDashboard } from "../hooks/admin/useAdmin";
import Loader from "../layouts/ui/Loader";

const AdminDashboard = () => {
  const { data: stats, error, isLoading } = useDashboard();

  if (isLoading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <div className="container py-4">
      {/* Welcome Section */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h2 className="fw-bold mb-1">Admin Dashboard 📊</h2>
          <p className="text-muted mb-0">
            Manage jobs, applications, and users from one place.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="fs-1 mb-2">💼</div>
              <h3 className="fw-bold text-primary">
                {stats?.totalJobs}
              </h3>
              <p className="text-muted mb-0">Total Jobs</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="fs-1 mb-2">🟢</div>
              <h3 className="fw-bold text-success">
                {stats?.totalActiveJobs}
              </h3>
              <p className="text-muted mb-0">Active Jobs</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="fs-1 mb-2">🔒</div>
              <h3 className="fw-bold text-danger">
                {stats?.totalClosedJobs}
              </h3>
              <p className="text-muted mb-0">Closed Jobs</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="fs-1 mb-2">📝</div>
              <h3 className="fw-bold text-warning">
                {stats?.totalApplications}
              </h3>
              <p className="text-muted mb-0">Total Applications</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="fs-1 mb-2">👥</div>
              <h3 className="fw-bold text-info">
                {stats?.totalUsers}
              </h3>
              <p className="text-muted mb-0">Registered Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="card shadow-sm border-0 mt-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Overview</h5>
          <div className="row text-center">
            <div className="col-md-4">
              <h4 className="text-primary">{stats?.totalJobs}</h4>
              <small className="text-muted">Jobs Posted</small>
            </div>
            <div className="col-md-4">
              <h4 className="text-success">{stats?.totalApplications}</h4>
              <small className="text-muted">Applications Received</small>
            </div>
            <div className="col-md-4">
              <h4 className="text-info">{stats?.totalUsers}</h4>
              <small className="text-muted">Platform Users</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;