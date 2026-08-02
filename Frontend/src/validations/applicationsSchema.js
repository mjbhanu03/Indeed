import * as Yup from 'yup';


export const applicationCreateSchema = Yup.object({
  job_id: Yup.number().required("Job is required"),
  full_name: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  mobile_number: Yup.string()
    .min(10, "Min 10 digits")
    .max(15, "Max 15 digits")
    .required("Mobile number is required"),
  cover_letter: Yup.string().required("Cover letter is required"),
  resume: Yup.string().required("Resume is required"),
});
