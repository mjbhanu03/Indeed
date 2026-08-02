import { useUserProfile } from "../../hooks/user/userUser";
import { FaEnvelope, FaPhoneAlt, FaBriefcase } from "react-icons/fa";

import Loader from "../../layouts/ui/Loader";
import "./UserProfile.module.css";

const UserProfile = () => {
  const { data: userProfileData, error, isLoading } = useUserProfile();

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger shadow-sm">
          Failed to load profile
        </div>
      </div>
    );
  }

  const user = userProfileData;

  return (
    <div
      className="container py-5"
      style={{ minHeight: "100vh", background: "#f8fafc" }}
    >
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">

          <div
            className="card border-0 shadow-lg overflow-hidden"
            style={{ borderRadius: "20px" }}
          >
            {/* Profile Header */}
            <div
              className="text-center text-white py-5"
              style={{
                background:
                  "linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)",
              }}
            >
              <div
                className="mx-auto bg-white text-primary d-flex align-items-center justify-content-center shadow"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  fontSize: "36px",
                  fontWeight: "700",
                }}
              >
                {user?.full_name?.charAt(0)?.toUpperCase()}
              </div>

              <h3 className="mt-3 fw-bold mb-1">
                {user?.full_name}
              </h3>

              <span className="badge bg-light text-dark px-3 py-2">
                {user?.job_role}
              </span>
            </div>

            {/* Details */}
            <div className="card-body p-4">

              <h5 className="fw-bold mb-4">
                Profile Information
              </h5>

              <div className="list-group list-group-flush">

                <div className="list-group-item py-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <FaEnvelope className="text-primary me-3" />
                    <div>
                      <small className="text-muted d-block">
                        Email Address
                      </small>
                      <span className="fw-semibold">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="list-group-item py-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <FaPhoneAlt className="text-success me-3" />
                    <div>
                      <small className="text-muted d-block">
                        Mobile Number
                      </small>
                      <span className="fw-semibold">
                        {user?.mobile_number}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="list-group-item py-3">
                  <div className="d-flex align-items-center">
                    <FaBriefcase className="text-warning me-3" />
                    <div>
                      <small className="text-muted d-block">
                        Job Role
                      </small>
                      <span className="fw-semibold">
                        {user?.job_role}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;