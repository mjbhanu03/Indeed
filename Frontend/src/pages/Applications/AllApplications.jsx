import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  useAllApplications,
  useUpdateApplicationStatus,
} from "../../hooks/applications/useApplications";
import Loader from "../../layouts/ui/Loader";
import Pagination from "../../layouts/ui/Pagination";

const AllApplications = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useAllApplications({ page });
  const { mutate } = useUpdateApplicationStatus();
  const [status, setStatus] = useState([]);
  let applications = data?.data?.applications || [];
  let totalCount = data?.data?.totalCount || 0;

  useEffect(() => {
    if (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  }, [error]);

  const handleChangeStatus = () =>
    mutate(status, {
      onSuccess: () => toast.success("Status changed successfully."),
      onError: (err) => toast.error(err.message || "Something went wrong."),
    });

  // console.log("ap", data?.data)
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
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Applications</h2>

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
                borderRadius: "12px",
              }}
            >
              <div className="card-body d-flex flex-column p-3">
                {/* Top */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="fw-semibold mb-1">{app.job_title}</h6>

                    <small className="text-muted">{app.company_name}</small>
                  </div>

                  <span
                    className={`badge rounded-pill col-3 h-75 d-flex justify-content-center align-items-center ${
                      app.status === "approved"
                        ? "bg-success"
                        : app.status === "rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                    }`}
                    style={{
                      fontSize: "13px",
                    }}
                  >
                    {app.status}
                  </span>
                </div>

                {/* Applicant */}
                <div className="border rounded p-2 mb-3 bg-light">
                  <div
                    className="fw-medium text-dark"
                    style={{ fontSize: "14px" }}
                  >
                    {app.full_name}
                  </div>

                  <div className="text-muted" style={{ fontSize: "12px" }}>
                    {app.email}
                  </div>

                  <div className="text-muted" style={{ fontSize: "12px" }}>
                    {app.mobile_number}
                  </div>
                </div>

                {/* Applied Date */}
                <div className="text-muted mb-3" style={{ fontSize: "12px" }}>
                  Applied on{" "}
                  {new Date(app.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>

                {/* Status */}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <select
                    className={`form-select form-select-sm ${
                      app.status === "approved"
                        ? "border-success text-success"
                        : app.status === "rejected"
                          ? "border-danger text-danger"
                          : "border-warning text-warning"
                    }`}
                    value={
                      status?.application_id === app.id
                        ? status.status
                        : app.status
                    }
                    onChange={(e) =>
                      setStatus({
                        application_id: app.id,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="applied" disabled>
                      Applied
                    </option>

                    <option
                      value="approved"
                      disabled={app.status === "approved"}
                    >
                      Approved
                    </option>

                    <option
                      value="rejected"
                      disabled={app.status === "rejected"}
                    >
                      Rejected
                    </option>
                  </select>

                  {status?.application_id === app.id &&
                    status?.status !== app.status && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleChangeStatus}
                      >
                        Save
                      </button>
                    )}
                </div>

                {/* Documents */}
                <div className="mt-auto">
                  <div className=" d-flex gap-2">
                    <a
                      href={`${import.meta.env.VITE_API_URL}/${app.resume_file_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary col-3 "
                    >
                      Resume
                    </a>

                    <a
                      href={`${import.meta.env.VITE_API_URL}/${app.cover_letter_file_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-secondary col-4"
                    >
                      Cover Letter
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalCount / 10)}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default AllApplications;
