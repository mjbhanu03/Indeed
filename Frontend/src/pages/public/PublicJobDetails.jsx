import { useNavigate, useParams } from "react-router-dom";
import { useJobsDetails } from "../../hooks/jobs/useJobs";
import NoDataFound from "../../layouts/ui/NoDataFound";
import { useSelector } from "react-redux";

const PublicJobDetails = () => {
  const { id } = useParams();
  const { data: job, error, isLoading } = useJobsDetails(id);
  
  const {isAuthenticated} = useSelector(s=>s.auth)
  // console.log("from here", job.data)
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }
  
  if (!job) return <NoDataFound />;
  if (error) return <div>{error}</div>;


  return (
    <div className="container py-5">
      <div className="cursor-pointer" onClick={()=>navigate(-1)}> Back </div>
      <div
        className="card border-0 shadow-lg overflow-hidden"
        style={{ borderRadius: "20px" }}
      >
        <div
          className="p-4 p-md-5 text-white"
          style={{
            background: "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)",
          }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
            <div>
              <h1 className="fw-bold mb-2">{job.data[0]?.job_title}</h1>

              <h5 className="mb-3 opacity-75">{job.data[0]?.company_name}</h5>

              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-light text-dark px-3 py-2">
                  📍 {job.data[0]?.location}
                </span>

                <span className="badge bg-light text-dark px-3 py-2">
                  💼 {job.data[0]?.experience}
                </span>

                <span className="badge bg-light text-dark px-3 py-2">
                  🏢 {job.data[0]?.job_type}
                </span>
              </div>
            </div>

            <div className="text-md-end mt-4 mt-md-0">
              <h2 className="fw-bold mb-1">
                ₹{Number(job.data[0]?.salary).toLocaleString("en-IN")}
              </h2>
              <small className="opacity-75">Annual Package</small>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="card-body p-4 p-md-5">
          <div className="row g-4">
            {/* Left Content */}
            <div className="col-lg-8">
              <h4 className="fw-bold mb-3">Job Description</h4>

              <p
                className="text-secondary"
                style={{
                  whiteSpace: "pre-line",
                  lineHeight: "1.8",
                }}
              >
                {job.data[0]?.job_desc}
              </p>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div
                className="card border-0 bg-light"
                style={{ borderRadius: "15px" }}
              >
                <div className="card-body">
                  <h5 className="fw-bold mb-4">Job Overview</h5>

                  <div className="mb-3">
                    <small className="text-muted d-block">Company</small>
                    <strong>{job.data[0]?.company_name}</strong>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">Location</small>
                    <strong>{job.data[0]?.location}</strong>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">Experience</small>
                    <strong>{job.data[0]?.experience}</strong>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">
                      Employment Type
                    </small>
                    <strong>{job.data[0]?.job_type}</strong>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">Salary</small>
                    <strong className="text-success">
                      ₹{Number(job.data[0]?.salary).toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div className="mt-3 mb-4">
                    <h4 className="fw-bold mb-3">Skills Required</h4>

                    <div className="d-flex flex-wrap gap-2">
                      {job.data[0]?.skills?.split(",").map((skill, index) => (
                        <span
                          key={index}
                          className="badge rounded-pill px-3 py-2"
                          style={{
                            backgroundColor: "#eef4ff",
                            color: "#0d6efd",
                            border: "1px solid #cfe2ff",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                          }}
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
            {job.data[0]?.is_applied === 1 && (
              <div
  className="badge bg-success-subtle text-success border border-success px-3 py-2 w-100"
  style={{ fontSize: "0.9rem" }}
>
  ✓ Already Applied
</div>
            )}
{job.data[0]?.is_active === 1 && job.data[0]?.is_applied === 0 && (isAuthenticated ? 
                  <div className="d-flex gap-3">
                <button className="btn btn-primary py-2 w-100" onClick={(e)=> {
                  e.stopPropagation()
                  navigate(`/user/apply-for-job/${id}`)}}>
                    Apply Now
                  </button>
                <button className="text-white btn py-2 ai-btn w-100" onClick={(e)=> {
                  e.stopPropagation()
                  navigate(`/user/apply-for-job/${job.id}`)}}>
                    Ask AI
                  </button>
                    </div>
                  : 
                <button className="btn btn-primary w-100 py-2" onClick={()=> navigate("/signin")}>
                    Login to Apply Now
                  </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <hr className="my-4" />

          <div className="d-flex justify-content-between flex-wrap">
            <span className="text-muted">
              Posted on{" "}
              {new Date(job.data[0]?.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>

            <span
              className={`badge ${
                job.data[0]?.is_active ? "bg-success" : "bg-danger"
              }`}
            >
              {job.data[0]?.is_active ? "Active" : "Closed"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicJobDetails;
