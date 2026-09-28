import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Applications from "./pages/Applications";
import SavedJobs from "./pages/SavedJobs";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

import ProtectedRoute from "./components/ProtectedRoute";

import CompanyManagement from "./pages/recruiter/CompanyManagement";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import CreateJob from "./pages/recruiter/CreateJob";
import RecruiterApplications from "./pages/recruiter/RecruiterApplications";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Recruiter Routes */}
        <Route
          path="/recruiter/company"
          element={<CompanyManagement />}
        />

        <Route
          path="/recruiter/jobs"
          element={<RecruiterJobs />}
        />

        <Route
          path="/recruiter/jobs/create"
          element={<CreateJob />}
        />

        <Route
          path="/recruiter/jobs/:id/edit"
          element={<CreateJob />}
        />

        <Route
          path="/recruiter/applications"
          element={<RecruiterApplications />}
        />
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Unknown URL */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;