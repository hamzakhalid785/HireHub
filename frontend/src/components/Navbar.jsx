import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setMobileOpen(false);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getInitials = () => {
    const first = user?.first_name?.charAt(0) || "";
    const last = user?.last_name?.charAt(0) || "";

    if (first || last) {
      return `${first}${last}`.toUpperCase();
    }

    return user?.username?.charAt(0)?.toUpperCase() || "U";
  };

  const navLinkClass = (path) =>
    `group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive(path)
        ? "bg-indigo-50 text-indigo-600"
        : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/dashboard"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 text-lg font-black text-white shadow-md shadow-indigo-200">
            H
          </div>

          <div className="hidden sm:block">
            <p className="text-lg font-extrabold tracking-tight text-gray-900">
              Hire<span className="text-indigo-600">Hub</span>
            </p>

            <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
              Career Platform
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {user?.role === "JOB_SEEKER" && (
            <>
              <NavLink
                to="/jobs"
                label="Find Jobs"
                icon={<SearchIcon />}
                className={navLinkClass("/jobs")}
              />

              <NavLink
                to="/applications"
                label="Applications"
                icon={<BriefcaseIcon />}
                className={navLinkClass("/applications")}
              />

              <NavLink
                to="/saved-jobs"
                label="Saved Jobs"
                icon={<BookmarkIcon />}
                className={navLinkClass("/saved-jobs")}
              />

              <NavLink
                to="/profile"
                label="Profile"
                icon={<UserIcon />}
                className={navLinkClass("/profile")}
              />
            </>
          )}

          {user?.role === "RECRUITER" && (
            <>
              <NavLink
                to="/recruiter/jobs"
                label="My Jobs"
                icon={<BriefcaseIcon />}
                className={navLinkClass("/recruiter/jobs")}
              />

              <NavLink
                to="/recruiter/applications"
                label="Applications"
                icon={<UsersIcon />}
                className={navLinkClass("/recruiter/applications")}
              />

              <NavLink
                to="/recruiter/company"
                label="Company"
                icon={<BuildingIcon />}
                className={navLinkClass("/recruiter/company")}
              />
            </>
          )}

          <NavLink
            to="/notifications"
            label="Notifications"
            icon={<BellIcon />}
            className={navLinkClass("/notifications")}
          />
        </div>

        {/* Desktop User Area */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {getInitials()}
            </div>

            <div className="max-w-32">
              <p className="truncate text-sm font-semibold text-gray-800">
                {user?.first_name || user?.username}
              </p>

              <p className="truncate text-xs text-gray-400">
                {user?.role === "RECRUITER" ? "Recruiter" : "Job Seeker"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-50 md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-4 shadow-lg md:hidden">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              {getInitials()}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                {user?.first_name || user?.username}
              </p>

              <p className="text-xs text-gray-400">
                {user?.role === "RECRUITER" ? "Recruiter" : "Job Seeker"}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {user?.role === "JOB_SEEKER" && (
              <>
                <MobileLink
                  to="/jobs"
                  label="Find Jobs"
                  icon={<SearchIcon />}
                  active={isActive("/jobs")}
                  onClick={() => setMobileOpen(false)}
                />

                <MobileLink
                  to="/applications"
                  label="Applications"
                  icon={<BriefcaseIcon />}
                  active={isActive("/applications")}
                  onClick={() => setMobileOpen(false)}
                />

                <MobileLink
                  to="/saved-jobs"
                  label="Saved Jobs"
                  icon={<BookmarkIcon />}
                  active={isActive("/saved-jobs")}
                  onClick={() => setMobileOpen(false)}
                />

                <MobileLink
                  to="/profile"
                  label="Profile"
                  icon={<UserIcon />}
                  active={isActive("/profile")}
                  onClick={() => setMobileOpen(false)}
                />
              </>
            )}

            {user?.role === "RECRUITER" && (
              <>
                <MobileLink
                  to="/recruiter/jobs"
                  label="My Jobs"
                  icon={<BriefcaseIcon />}
                  active={isActive("/recruiter/jobs")}
                  onClick={() => setMobileOpen(false)}
                />

                <MobileLink
                  to="/recruiter/applications"
                  label="Applications"
                  icon={<UsersIcon />}
                  active={isActive("/recruiter/applications")}
                  onClick={() => setMobileOpen(false)}
                />

                <MobileLink
                  to="/recruiter/company"
                  label="Company"
                  icon={<BuildingIcon />}
                  active={isActive("/recruiter/company")}
                  onClick={() => setMobileOpen(false)}
                />
              </>
            )}

            <MobileLink
              to="/notifications"
              label="Notifications"
              icon={<BellIcon />}
              active={isActive("/notifications")}
              onClick={() => setMobileOpen(false)}
            />
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, label, icon, className }) {
  return (
    <Link to={to} className={className}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileLink({ to, label, icon, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-indigo-50 text-indigo-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

/* Icons */

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="7" strokeWidth="2" />
      <path d="m20 20-4-4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" />
      <path d="M3 12h18" strokeWidth="2" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-3-6 3V4Z"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
      <path d="M4 21a8 8 0 0 1 16 0" strokeWidth="2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="9" cy="8" r="3" strokeWidth="2" />
      <path d="M3 20a6 6 0 0 1 12 0" strokeWidth="2" />
      <path d="M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 6" strokeWidth="2" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M4 21V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v17" strokeWidth="2" />
      <path d="M2 21h20M8 6h2M12 6h2M8 10h2M12 10h2M8 14h2M12 14h2" strokeWidth="2" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M10 17l5-5-5-5M15 12H3" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" strokeWidth="2" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}