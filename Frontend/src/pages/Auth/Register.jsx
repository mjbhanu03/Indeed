import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
// import { registerApi } from '../../api/authApi';
import { setCredentials } from '../../redux/slices/authSlice';
import { registerSchema } from '../../validations/authValidation';
import ThemeToggle from '../../components/common/ThemeToggle';
import { signUpApi } from '../../api/auth/apiAuth';


export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { full_name: '', email: '', password: '', confirm_password: '', mobile_number: '', job_role: "" },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const data  = await signUpApi(values);
        console.log("dadad", data)
        dispatch(setCredentials(data));
        toast.success(data?.message || 'Registration successful!');
        navigate('/user/dashboard');
        return
      } catch (err) {
        console.log(err)
        toast.error(err.response?.data?.message || err.message || 'Registration failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className={`form-control ${formik.touched[name] && formik.errors[name] ? 'is-invalid' : ''}`}
        {...formik.getFieldProps(name)}
        placeholder={placeholder}
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="invalid-feedback">{formik.errors[name]}</div>
      )}
    </div>
  );

  return (
    <div className="theme-auth-bg py-4">
      {/* Theme toggle pinned top-right */}
      <div style={{ position: 'fixed', top: 16, right: 16 }}>
        <ThemeToggle />
      </div>

      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: 450 }}>
        <Link to="/events" className="text-decoration-none">
          <h3 className="text-center mb-1 fw-bold text-primary">Indeed</h3>
        </Link>
        <h5 className="text-center mb-4" style={{ color: 'var(--text-primary)' }}>Create Account</h5>

        <form onSubmit={formik.handleSubmit}>
          {field('full_name',            'Full Name',         'text',     'John Doe'    )}
          {field('email',           'Email',             'email',    'you@example.com')}
          {field('job_role', 'Job Role',  'text', 'Full Stack'    )}
          {field('mobile_number',           'Phone (optional)',   'text',     '9876543210'  )}
          {field('password',        'Password',          'password', '••••••••'    )}
          {field('confirm_password', 'Confirm Password',  'password', '••••••••'    )}
          {/* <div>
            <label htmlFor="job_role">Job Role: </label>
            <select name="job_role" id='job_role' {...formik.registerField("job_role")}>
              <option value="Full Stack">Full Stack</option>
              <option value="CEO">CEO</option>
              <option value="IOS Developer">Full Stack</option>
            </select>
          </div> */}
          <button type="submit" className="btn btn-primary w-100" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Registering…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-3 mb-0 small text-muted">
          Already have an account?{' '}
          <Link to="/signin" className="text-primary fw-semibold">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
