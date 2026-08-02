import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateJob, useEditJob, useJobsDetails } from "../../hooks/jobs/useJobs";
import Loader from "../../layouts/ui/Loader";
import NoDataFound from "../../layouts/ui/NoDataFound";
import { useSkills } from "../../hooks/admin/useAdmin";

const jobSchema = Yup.object({
  job_title: Yup.string().required("Job title is required"),
  company_name: Yup.string().required("Company name is required"),
  location: Yup.string().required("Location is required"),
  job_type: Yup.string().required("Job type is required"),
  experience: Yup.string().required("Experience is required"),
  salary: Yup.number().required("Salary is required"),
  description: Yup.string().required("Job description is required"),
  skills: Yup.array().min(1, "Select at least one skill"),
});

const AddOrEditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading: jobLoading,
    error: jobError,
  } = useJobsDetails(id);

  const {
    data: skills,
    isLoading: skillsLoading,
    error: skillsError,
  } = useSkills();

  const { mutate: createJob } = useCreateJob();
  const { mutate: editJob } = useEditJob();

  const isEdit = !!id;
  const job = data?.[0];
console.log("job skills", job?.skills);
  if (jobLoading || skillsLoading) return <Loader />;
  if (jobError) return <div>{jobError.message}</div>;
  if (skillsError) return <div>{skillsError.message}</div>;
  if (isEdit && !job) return <NoDataFound />;

  const initialValues = {
    job_title: job?.job_title || "",
    company_name: job?.company_name || "",
    location: job?.location || "",
    job_type: job?.job_type || "",
    experience: job?.experience || "",
    salary: job?.salary || "",
    description: job?.description || "",
    skills:  [],
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">
        {isEdit ? "Edit Job" : "Add Job"}
      </h3>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={jobSchema}
        onSubmit={(values) => {
          if (isEdit) {
            editJob({
              ...values,
              job_id: id,
            }, {
              onSuccess: () => navigate("/jobs"),
            });
          } else {
            createJob(values, {
              onSuccess: () => navigate("/jobs"),
            });
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="row g-3">
              <div className="col-md-6">
                <label>Job Title</label>
                <Field
                  name="job_title"
                  className="form-control"
                />
                <ErrorMessage
                  name="job_title"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="col-md-6">
                <label>Company Name</label>
                <Field
                  name="company_name"
                  className="form-control"
                />
                <ErrorMessage
                  name="company_name"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="col-md-6">
                <label>Location</label>
                <Field
                  name="location"
                  className="form-control"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="col-md-6">
                <label>Job Type</label>
                <Field
                  as="select"
                  name="job_type"
                  className="form-select"
                >
                  <option value="">Select</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </Field>

                <ErrorMessage
                  name="job_type"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="col-md-6">
                <label>Experience</label>
                <Field
                  name="experience"
                  className="form-control"
                />
                <ErrorMessage
                  name="experience"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="col-md-6">
                <label>Salary</label>
                <Field
                  type="number"
                  name="salary"
                  className="form-control"
                />
                <ErrorMessage
                  name="salary"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="col-12">
                <label>Description</label>
                <Field
                  as="textarea"
                  rows="4"
                  name="description"
                  className="form-control"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="col-12">
                <label className="fw-semibold mb-2">
                  Skills
                </label>

                <div className="row">
                  {skills?.map((skill) => (
                    <div
                      className="col-md-3 col-sm-4 col-6 mb-2"
                      key={skill.id}
                    >
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`skill-${skill.id}`}
                          checked={values.skills.includes(
                            skill.id
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFieldValue("skills", [
                                ...values.skills,
                                skill.id,
                              ]);
                            } else {
                              setFieldValue(
                                "skills",
                                values.skills.filter(
                                  (item) =>
                                    item !== skill.id
                                )
                              );
                            }
                          }}
                        />

                        <label
                          className="form-check-label"
                          htmlFor={`skill-${skill.id}`}
                        >
                          {skill.skill_name}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <ErrorMessage
                  name="skills"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {isEdit
                    ? "Update Job"
                    : "Create Job"}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddOrEditJob;