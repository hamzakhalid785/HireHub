import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/dashboard"
          className="text-2xl font-bold text-indigo-600"
        >
          HireHub
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {user?.role === "JOB_SEEKER" && (
            <>
              <Link
                to="/jobs"
                className="text-gray-600 hover:text-indigo-600"
              >
                Find Jobs
              </Link>

              <Link
                to="/applications"
                className="text-gray-600 hover:text-indigo-600"
              >
                Applications
              </Link>

              <Link
                to="/saved-jobs"
                className="text-gray-600 hover:text-indigo-600"
              >
                Saved Jobs
              </Link>

              <Link
                to="/profile"
                className="text-gray-600 hover:text-indigo-600"
              >
                Profile
              </Link>
            </>
          )}

          {user?.role === "RECRUITER" && (
            <>
              <Link
                to="/recruiter/jobs"
                className="text-gray-600 hover:text-indigo-600"
              >
                My Jobs
              </Link>

              <Link
                to="/recruiter/applications"
                className="text-gray-600 hover:text-indigo-600"
              >
                Applications
              </Link>

              <Link
                to="/recruiter/company"
                className="text-gray-600 hover:text-indigo-600"
              >
                Company
              </Link>
            </>
          )}

          <Link
            to="/notifications"
            className="text-gray-600 hover:text-indigo-600"
          >
            Notifications
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Logout
          </button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <span className="text-sm font-medium text-gray-700">
            {user?.username}
          </span>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}