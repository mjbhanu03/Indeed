import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useUploadMedia } from "../../hooks/applications/useApplications";
import {applicationCreateSchema} from "../../validations/applicationsSchema"
import { createApplication } from "../../api/applications/apiApplications";

const CreateApplications = () => {
  const navigate = useNavigate();
  const {mutateAsync: uploadMedia} = useUploadMedia()
  const {jobId} = useParams()
  const formik = useFormik({
    initialValues: {
      job_id: jobId,
      full_name: "",
      email: "",
      mobile_number: "",
      resume: "",
      cover_letter: "",
    },
    validationSchema: applicationCreateSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("FINAL PAYLOAD:", values);

        await createApplication(values);

        toast.success("Application submitted!");
        navigate("/user/applications");
      } catch (err) {
        toast.error(err.message || "Failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // file upload handler
  const handleFileUpload = async (e, fieldName) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_type", fieldName);

      const res = await uploadMedia(formData);

      formik.setFieldValue(fieldName, res.filePath);
      
      toast.success("Uploaded successfully!");
    } catch (err) {
      console.log(err)
      toast.error("Upload failed");
    }
  };
const field = (name, label, type = "text") => (
  <div className="mb-3">
    <label className="form-label">{label}</label>

    <input
      type={type}
      className={`form-control ${
        formik.touched[name] && formik.errors[name]
          ? "is-invalid"
          : ""
      }`}
      {...formik.getFieldProps(name)}
    />

    {formik.touched[name] && formik.errors[name] && (
      <div className="invalid-feedback">
        {formik.errors[name]}
      </div>
    )}
  </div>
);

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: 600 }}>
        <h3 className="text-center mb-4 fw-bold">
          Apply for Job
        </h3>

        <form onSubmit={formik.handleSubmit}>
          {field("full_name", "Full Name")}
          {field("email", "Email")}
          {field("mobile_number", "Mobile Number")}

          {/* Resume Upload */}
          <div className="mb-3">
            <label className="form-label">Resume</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) =>
                handleFileUpload(e, "resume")
              }
            />
          </div>

          {/* Cover Letter Upload */}
          <div className="mb-3">
            <label className="form-label">
              Cover Letter
            </label>
            <input
              type="file"
              className="form-control"
              onChange={(e) =>
                handleFileUpload(
                  e,
                  "cover_letter"
                )
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting
              ? "Submitting..."
              : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateApplications;