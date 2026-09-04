import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import PublicLayout  from '../layouts/PublicLayout';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

import UserLayout    from '../layouts/user/UserLayout';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import MyApplications from '../pages/Applications/AllApplications';
import CreateApplications from '../pages/Applications/CreateApplications';
import UserProfile from '../pages/User/UserProfile';
import AdminLayout from '../layouts/admin/AdminLayout';
import UsersList from '../pages/Admin/UsersList';
import UserDetails from '../pages/Admin/UserDetails';
import AddOrEditJob from '../pages/public/AddOrEditJob';
import AllApplications from '../pages/Applications/AllApplications';
import ChangePasssword from '../pages/Auth/ChangePasssword';
import ChatWithAi from '../pages/Ai/ChatWithAi';

// Public (no login required)
const PublicJobs     = lazy(() => import('../pages/public/PublicJob'));
const PublicJobDetails = lazy(() => import('../pages/public/PublicJobDetails'));



// Redirects logged-in users from /events to their dashboard
function JobsGate({ isAuthenticated, role }) {
  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/user/jobs'} replace />;
  }
  return <PublicJobs />;
}

// Redirects logged-in users from /events/:id to their correct detail page
function JobsDetailGate({ isAuthenticated, role }) {
  const { id } = useParams();
  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin/jobs' : `/user/jobs/${id}`} replace />;
  }
  return <PublicJobDetails />;
}


const Loader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
    <div className="spinner-border text-primary" />
  </div>
);

export default function AppRoutes() {
  const { isAuthenticated, role } = useSelector(s => s.auth);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>

      {/* By Default */}
      <Route path='/' element={<Navigate to="/jobs" replace/>}/>

      <Route element={<PublicLayout />}>
          <Route path="/jobs" element={<JobsGate isAuthenticated={isAuthenticated} role={role} />} />
          <Route path="/jobs/:id" element={<JobsDetailGate isAuthenticated={isAuthenticated} role={role} />} />
      </Route>

      <Route path='/signin' element={!isAuthenticated ? <Login /> : <Navigate to="/jobs" replace/>} />
      <Route path='/signup' element={!isAuthenticated ? <Register /> : <Navigate to="/jobs" replace/>} />

        <Route path="/user" element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="jobs"       element={<PublicJobs />} />
          <Route path="jobs/:id"   element={<JobsDetailGate />} />
          <Route path="applications"   element={<MyApplications />} />
          <Route path="apply-for-job/:jobId"   element={<CreateApplications />} />
          <Route path="profile"   element={<UserProfile />} />
          <Route path="changePassword"   element={<ChangePasssword />} />
          <Route path="ai-chat"   element={<ChatWithAi />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<AdminDashboard />} />
          <Route path="users" element={<UsersList />} />
          <Route path="users/:userId" element={<UserDetails />} />
          <Route path="jobs"       element={<PublicJobs />} />
          <Route path="jobs/add"       element={<AddOrEditJob />} />
          <Route path="jobs/edit/:id"       element={<AddOrEditJob />} />
          <Route path="applications"       element={<AllApplications />} />
          <Route path="changePassword"   element={<ChangePasssword />} />

        </Route>

      </Routes>
    </Suspense>
  );
}
