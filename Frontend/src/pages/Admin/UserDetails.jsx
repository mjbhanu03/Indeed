import { useNavigate, useParams } from "react-router-dom";
import NoDataFound from "../../layouts/ui/NoDataFound";
import Loader from "../../layouts/ui/Loader";
import { useUpdateActiveStatus, useUserDetails } from "../../hooks/admin/useAdmin";
import toast from "react-hot-toast";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useUserDetails(userId);
  const {mutate} = useUpdateActiveStatus()
  let user = data && data[0];
  const handleStatusChange = () => {
    const obj = {
      is_active: user.is_active === 1 ? 0 : 1,
      user_id: user.user_id
    }
    mutate(obj, {
      onError: (err)=> toast.error(err?.message || "Something went wrong."),
      onSuccess: ()=> toast.success("Status Updated.")
    })
  }

  if (isLoading) return <Loader />;
  if (error) return <div>{error.message}</div>;
  if (!user) return <NoDataFound />;
  const isActive = user.is_active === 1;
  console.log("user", user);
  return (
    <div className="container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {/* User Card */}
      <div className="d-flex w-100 justify-content-center">

      <div className=" card shadow-sm border-0 ">
        <div className="card-body p-5 ">
          <div className="d-flex justify-content-center gap-3 mb-5 w-full">
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: "#0d6efd",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              {user.full_name?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <h3 className="mb-1">{user.full_name}</h3>
              <p className="text-muted mb-0">{user.job_role}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="fw-semibold text-muted">Email</label>
              <div>{user.email}</div>
            </div>

            <div className="col-md-6 mb-4">
              <label className="fw-semibold text-muted">Mobile Number</label>
              <div>{user.mobile_number}</div>
            </div>


            <div className="col-md-6 mb-4 align-items-end">
              <label className="col-md-6 fw-semibold text-muted">Status</label>
              <div>
                <span
                  className="badge col-md-4 py-2 gap-3 mt-1"
                  style={{
                    backgroundColor: isActive ? "#198754" : "#dc3545",
                  }}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>


          {/* Status Management */}
          <div className="col-md-6 align-items-end">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Change Status</label>
            </div>
              <div className="d-flex align-items-center gap-3 mt-1">
                <button
                  className={`btn btn-sm ${
                    isActive ? "btn-outline-danger" : "btn-outline-success"
                  }`}
                  onClick={handleStatusChange}
                >
                  {isActive ? "Deactivate User" : "Activate User"}
                </button>
              </div>
            </div>
                  </div>
                  <hr />
          </div>
        </div>
      </div>

      </div>
  );
};

export default UserDetails;
