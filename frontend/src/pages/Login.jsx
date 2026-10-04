import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    dispatch(clearAuthError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* Left Branding Panel */}
        <div className="relative hidden overflow-hidden bg-linear-to-br from-slate-950 via-indigo-950 to-indigo-900 lg:flex lg:w-1/2">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <Link to="/login" className="flex w-fit items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-black text-indigo-700 shadow-lg">
                H
              </div>

              <div>
                <p className="text-xl font-extrabold tracking-tight text-white">
                  Hire<span className="text-indigo-300">Hub</span>
                </p>

                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-indigo-300">
                  Career Platform
                </p>
              </div>
            </Link>

            {/* Main Content */}
            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-indigo-200 backdrop-blur">
                <SparkleIcon />
                Your next opportunity starts here
              </div>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
                Connect talent with{" "}
                <span className="text-indigo-300">opportunity.</span>
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 xl:text-base">
                HireHub brings job seekers and recruiters together through a
                modern platform designed to make hiring simpler and careers
                easier to build.
              </p>

              <div className="mt-9 space-y-4">
                <Feature
                  icon={<SearchIcon />}
                  title="Discover opportunities"
                  description="Find roles that match your skills and career goals."
                />

                <Feature
                  icon={<BriefcaseIcon />}
                  title="Manage your career"
                  description="Keep applications, saved jobs and your profile organized."
                />

                <Feature
                  icon={<UsersIcon />}
                  title="Build connections"
                  description="Create meaningful opportunities between talent and employers."
                />
              </div>
            </div>

            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} HireHub. Built for modern careers.
            </p>
          </div>
        </div>

        {/* Right Login Area */}
        <div className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 flex justify-center lg:hidden">
              <Link to="/login" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 text-lg font-black text-white shadow-md shadow-indigo-100">
                  H
                </div>

                <p className="text-xl font-extrabold tracking-tight text-gray-900">
                  Hire<span className="text-indigo-600">Hub</span>
                </p>
              </Link>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-xl shadow-gray-200/50 sm:p-9">
              {/* Heading */}
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <LockIcon />
                </div>

                <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  Welcome Back
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Sign in to continue to your HireHub account.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertIcon />

                  <div className="leading-5">
                    {typeof error === "object"
                      ? Object.entries(error)
                          .map(([key, value]) => {
                            const message = Array.isArray(value)
                              ? value.join(", ")
                              : value;

                            return `${key}: ${message}`;
                          })
                          .join(" ")
                      : error}
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <FormField
                  label="Username"
                  icon={<UserIcon />}
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                />

                <FormField
                  label="Password"
                  icon={<LockIcon />}
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-100 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRightIcon />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs font-medium text-gray-400">
                  NEW TO HIREHUB?
                </span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              {/* Register */}
              <Link
                to="/register"
                className="flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              >
                Create an Account
              </Link>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-gray-400">
              By continuing, you agree to use HireHub responsibly and maintain
              accurate account information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  icon,
  type,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
        />
      </div>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-indigo-300">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

/* Icons */

function UserIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
      <path d="M4 21a8 8 0 0 1 16 0" strokeWidth="2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="5" y="10" width="14" height="10" rx="2" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeWidth="2" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" strokeWidth="2" />
      <path d="m20 20-4-4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" />
      <path d="M3 12h18" strokeWidth="2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="3" strokeWidth="2" />
      <path d="M3 20a6 6 0 0 1 12 0" strokeWidth="2" />
      <path d="M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 6" strokeWidth="2" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" strokeWidth="1.8" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 8v4M12 16h.01" strokeWidth="2" strokeLinecap="round" />
      <path d="M10.3 3.5 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.5a2 2 0 0 0-3.4 0Z" strokeWidth="2" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
  );
}