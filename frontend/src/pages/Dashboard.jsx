import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  const isJobSeeker = user?.role === "JOB_SEEKER";

  const firstName =
    user?.first_name || user?.username || "there";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-indigo-950 to-indigo-900 px-6 py-9 text-white shadow-xl shadow-indigo-100 sm:px-8 md:px-12 md:py-12">
          {/* Decorative background */}
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-200 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {isJobSeeker
                ? "Job Seeker Dashboard"
                : "Recruiter Dashboard"}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Welcome back,{" "}
              <span className="text-indigo-300">{firstName}</span>
              <span className="ml-2">👋</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {isJobSeeker
                ? "Discover opportunities, manage your applications, and build a professional profile that gets noticed."
                : "Manage your company, publish opportunities, and keep track of candidates from one powerful workspace."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {isJobSeeker ? (
                <>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
                  >
                    <SearchIcon />
                    Find Jobs
                    <ArrowIcon />
                  </Link>

                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    <UserIcon />
                    Complete Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/recruiter/jobs/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
                  >
                    <PlusIcon />
                    Post a Job
                    <ArrowIcon />
                  </Link>

                  <Link
                    to="/recruiter/jobs"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    <BriefcaseIcon />
                    Manage Jobs
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Section heading */}
        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Quick Access
            </p>

            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">
              Your workspace
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Everything you need, right where you need it.
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <section className="mt-6 grid gap-5 md:grid-cols-3">
          {isJobSeeker ? (
            <>
              <DashboardCard
                icon={<SearchIcon />}
                iconBg="bg-indigo-50"
                iconColor="text-indigo-600"
                title="Find Jobs"
                description="Search opportunities by title, location, job type, work mode and experience level."
                link="/jobs"
                button="Browse Jobs"
              />

              <DashboardCard
                icon={<BriefcaseIcon />}
                iconBg="bg-violet-50"
                iconColor="text-violet-600"
                title="Applications"
                description="Review the jobs you've applied to and keep track of your application progress."
                link="/applications"
                button="View Applications"
              />

              <DashboardCard
                icon={<UserIcon />}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                title="Your Profile"
                description="Keep your skills, education, experience and resume up to date."
                link="/profile"
                button="Manage Profile"
              />
            </>
          ) : (
            <>
              <DashboardCard
                icon={<BriefcaseIcon />}
                iconBg="bg-indigo-50"
                iconColor="text-indigo-600"
                title="My Jobs"
                description="Create, update and manage your company's published job opportunities."
                link="/recruiter/jobs"
                button="Manage Jobs"
              />

              <DashboardCard
                icon={<UsersIcon />}
                iconBg="bg-violet-50"
                iconColor="text-violet-600"
                title="Candidates"
                description="Review applications and manage candidates throughout the hiring process."
                link="/recruiter/applications"
                button="View Candidates"
              />

              <DashboardCard
                icon={<BuildingIcon />}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                title="Company"
                description="Maintain your company information and keep your recruiting profile professional."
                link="/recruiter/company"
                button="Manage Company"
              />
            </>
          )}
        </section>

        {/* Bottom info */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <SparkleIcon />
              </div>

              <div>
                <h3 className="font-bold text-gray-900">
                  {isJobSeeker
                    ? "Make your profile stand out"
                    : "Build a stronger hiring presence"}
                </h3>

                <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
                  {isJobSeeker
                    ? "A complete profile helps recruiters understand your skills and experience."
                    : "Keep your company and job listings updated to attract the right candidates."}
                </p>
              </div>
            </div>

            <Link
              to={isJobSeeker ? "/profile" : "/recruiter/company"}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            >
              Get Started
              <ArrowIcon />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function DashboardCard({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  link,
  button,
}) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <div className="rounded-full bg-gray-50 p-2 text-gray-300 transition group-hover:bg-indigo-50 group-hover:text-indigo-500">
          <ArrowUpRightIcon />
        </div>
      </div>

      <h3 className="mt-6 text-lg font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 min-h-14 text-sm leading-6 text-gray-500">
        {description}
      </p>

      <Link
        to={link}
        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 transition hover:text-indigo-700"
      >
        {button}
        <ArrowIcon />
      </Link>
    </div>
  );
}

/* Icons */

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

function UserIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
      <path d="M4 21a8 8 0 0 1 16 0" strokeWidth="2" />
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

function BuildingIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 21V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v17" strokeWidth="2" />
      <path d="M2 21h20M8 6h2M12 6h2M8 10h2M12 10h2M8 14h2M12 14h2" strokeWidth="2" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" strokeWidth="1.8" />
      <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" strokeWidth="1.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M7 17 17 7M9 7h8v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}