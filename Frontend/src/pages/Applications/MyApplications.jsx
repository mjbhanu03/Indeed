import { useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { useApplications } from "../../hooks/applications/useApplications";
import Loader from "../../layouts/ui/Loader";

const MyApplications = () => {

  const user_id = useSelector(
    (state) => state.auth.user.user_id
  );

  const {
    data: applications,
    error,
    isLoading,
  } = useApplications(user_id);

  useEffect(() => {
    if (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    }
  }, [error]);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h4>💀 Something went wrong</h4>
      </div>
    );
  }

  if (!applications?.length) {
    return (
      <div className="container py-5 text-center">
        <h3>No Applications Yet</h3>
        <p className="text-muted">
          Start applying for jobs and track them here.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">My Applications</h2>

        <span className="badge bg-primary fs-6">
          {applications.length} Applications
        </span>
      </div>

      <div className="row g-4">
        {applications.map((app) => (
          <div className="col-md-6 col-lg-4" key={app.id}>
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                transition: "0.2s ease",
              }}
            >
              <div className="card-body d-flex flex-column">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="fw-bold mb-1">
                      {app.job_title}
                    </h5>

                    <p className="text-muted mb-0">
                      🏢 {app.company_name}
                    </p>
                  </div>

                  <span
                    className={`badge ${
                      app.status === "approved"
                        ? "bg-success"
                        : app.status === "rejected"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <hr />

                {/* Details */}
                <div className="small text-muted">
                  <p className="mb-2">
                    👤 {app.full_name}
                  </p>

                  <p className="mb-2">
                    📧 {app.email}
                  </p>

                  <p className="mb-2">
                    📱 {app.mobile_number}
                  </p>

                  <p className="mb-0">
                    📅 Applied on{" "}
                    {new Date(
                      app.created_at
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Buttons */}
                <div className="mt-auto pt-3">

                  <div className="d-flex gap-2">
                    <a
                      href={`http://localhost:5000/${app.resume_file_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm flex-fill"
                    >
                      Resume
                    </a>

                    <a
                      href={`http://localhost:5000/${app.cover_letter_file_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-secondary btn-sm flex-fill"
                    >
                      Cover Letter
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;