import { useDeleteJobs, useFilteredJobs, useJobs } from "../../hooks/jobs/useJobs";
import {useNavigate} from "react-router-dom"
import NoDataFound from "../../layouts/ui/NoDataFound";
import { useEffect, useState } from "react";
import Loader from "../../layouts/ui/Loader"
import Pagination from "../../layouts/ui/Pagination";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const PublicJobs = () => {

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [jobType, setJobType] = useState('');
  const [page, setPage] = useState(1);

  const {data: jobs, error, isLoading} = useJobs()
  const {mutate} = useFilteredJobs()
  const {mutate: deleteMutate} = useDeleteJobs()
  const [jobsData, setJobsData] = useState(null)
  const {isAuthenticated, user} = useSelector(s=>s.auth)
  console.log("jobs", jobs?.data)
  useEffect(()=>{
    setJobsData(jobs?.data?.jobs || null)
  }, [jobs])

  useEffect(()=>{
    let payload = {}
    if(search) payload.searchQuery = search
    else setJobsData(jobs?.data?.jobs || null)
    if(status) payload.status = status
    if(jobType) payload.job_type = jobType
    if(page) payload.page = page

    if(Object.keys(payload).length > 0){
      if(payload.status || payload.job_type || payload.searchQuery) payload.page = 1
      mutate(payload, {
        onSuccess:(data)=>{
          setJobsData(data?.data?.jobs || null)
        }
      })
    }
  }, [search, status, jobType, page])

  const handleDeleteJob = (id) =>{
    const obj = {
      job_id: id
    }
    deleteMutate(obj, {
      onSuccess: ()=> toast.success("Job deleted success."),
      onError: (err)=> toast.error(err?.message || "Something went wrong.")
    })
  }

  const navigate = useNavigate()
  if(isLoading) return <Loader />
  if(error) return <div>{error}</div>

  if(!jobs) return <NoDataFound />

  return (
   <div className="row g-4">
{
  user?.role === "admin" && (
                    <button className="w-25 btn btn-primary py-2" onClick={(e)=> {
                  e.stopPropagation()
                  navigate(`/admin/jobs/add`)}}>
                    Add Job
                  </button>
  )
}
{/* ── Filters ── */}
            <div className="row g-2 mb-4">
                <div className="col-md-5">
                    <input className="form-control" placeholder="🔍  Search events…" value={search}
                        onChange={e => { setSearch(e.target.value); }} />
                </div>
                <div className="col-md-3">
                    <select className="form-select" value={status} onChange={e => { setStatus(e.target.value);  }}>
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">In Active</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <select className="form-select" value={jobType} onChange={e => { setJobType(e.target.value);  }}>
                        <option value="">All</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Remote">Remote</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>
            </div>
  {jobsData?.map((job) => (
    <div key={job.id} className="col-sm-6 col-lg-4" onClick={()=> navigate(`${job.id}`)}>
      <div
        className="card h-100 shadow-sm"
        style={{
          transition: "transform 0.15s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-3px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0)")
        }
      >
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold mb-2">
            {job.job_title}
          </h5>
 
          <p className="mb-1">
            <strong>Company:</strong> {job.company_name}
          </p>
 
          <p className="mb-1">
            📍 {job.location}
          </p>
 
          <p className="mb-1">
            💼 {job.experience}
          </p>
 
          <p className="mb-1">
            🏢 {job.job_type}
          </p>
 
          <p className="mb-2">
            💰 ₹{Number(job.salary).toLocaleString("en-IN")}
          </p>
 
          <p className="text-muted small flex-grow-1">
            {job.job_desc}
          </p>
 
          <div
            className="d-flex justify-content-between align-items-center mt-auto pt-2"
            style={{ borderTop: "1px solid #e5e7eb" }}
          >
            <span className="small text-muted">
              {new Date(job.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            {job.is_applied === 1 && user?.role === "user" &&  (
              <div
  className="badge bg-success-subtle text-success border border-success px-3 py-2"
  style={{ fontSize: "0.9rem" }}
>
  ✓ Already Applied
</div>
            )}
{job.is_active === 1 && job.is_applied !== 1 && user?.role === "user" && (isAuthenticated ? 
                <button className="btn btn-primary py-2" onClick={(e)=> {
                  e.stopPropagation()
                  navigate(`/user/apply-for-job/${job.id}`)}}>
                    Apply Now
                  </button>
                  : 
                <button className="btn btn-primary py-2" onClick={()=> navigate("/signin")}>
                    Login to Apply Now
                  </button>
                  )}
{ user?.role === "admin" && (
  <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={(e)=> {
                  e.stopPropagation()
                  navigate(`/admin/jobs/edit/${job.id}`)}}>
                    Edit
                  </button>
                  
                <button className="btn btn-danger" onClick={(e)=> {
                  e.stopPropagation()
                  handleDeleteJob(job.id)}}>
                    Delete
                  </button>
                  </div>
                  )}
          </div>
        </div>
      </div>
    </div>
  ))}
  <Pagination totalPages={Math.ceil(jobs?.data?.totalCount / 10)} currentPage={page} onPageChange={setPage}></Pagination>

</div>
 
  );
};
 
export default PublicJobs;     