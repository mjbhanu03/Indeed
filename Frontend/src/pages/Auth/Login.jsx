import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { loginApi } from '../../api/auth/apiAuth';
import { setCredentials } from '../../redux/slices/authSlice';
import { loginSchema } from '../../validations/authValidation';
import ThemeToggle from '../../components/common/ThemeToggle';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const data  = await loginApi(values);
        // console.log(data)
        dispatch(setCredentials(data.data));
        // navigate(data.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
        toast.success('Login successful!');
      } catch (err) {
        console.log(err)
        toast.error(err.response?.data?.message || err.message || 'Login failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="theme-auth-bg">
      {/* Theme toggle pinned top-right */}
      <div style={{ position: 'fixed', top: 16, right: 16 }}>
        <ThemeToggle />
      </div>

      <div
        className="card shadow-sm p-4"
        style={{ width: '100%', maxWidth: 420 }}
      >
        <Link to="/events" className="text-decoration-none">
          <h3 className="text-center mb-1 fw-bold text-primary">🎉 Indeed</h3>
        </Link>
        <h5 className="text-center mb-4" style={{ color: 'var(--text-primary)' }}>Sign In</h5>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
              {...formik.getFieldProps('email')}
              placeholder="you@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
              {...formik.getFieldProps('password')}
              placeholder="••••••••"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-3 mb-0 small text-muted">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary fw-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
}
