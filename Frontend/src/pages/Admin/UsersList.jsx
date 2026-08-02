import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/admin/useAdmin";
import Loader from "../../layouts/ui/Loader";

const UsersList = () => {
  const { data, error, isLoading } = useUser();
  const navigate = useNavigate()
  if (isLoading) return <Loader />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  console.log("data0", data)
  return (
    <div className="container-fluid">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h4 className="mb-0 fw-bold">👥 Users List</h4>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Job Role</th>
                </tr>
              </thead>

              <tbody>
                {data?.data?.length ? (
                  data.data.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              fontWeight: "bold",
                            }}
                          >
                            {user.full_name?.charAt(0).toUpperCase()}
                          </div>

                          <span className="fw-semibold">{user.full_name}</span>
                        </div>
                      </td>

                      <td>{user.email}</td>

                      <td>{user.mobile_number}</td>

                      <td>
                        <span className="badge bg-info">{user.job_role}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            navigate(`/admin/users/${user.user_id}`)
                          }
                        >
                          👁 View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-end">
            <span className="badge bg-primary fs-6">
              Total Users: {data?.data?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
