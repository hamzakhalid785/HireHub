import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  const isJobSeeker = user?.role === "JOB_SEEKER";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}
        <section className="rounded-3xl bg-gray-900 px-8 py-10 text-white md:px-12">
          <p className="text-sm font-medium text-indigo-300">
            {isJobSeeker ? "Job Seeker Dashboard" : "Recruiter Dashboard"}
          </p>

          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            Welcome back,{" "}
            {user?.first_name || user?.username} 👋
          </h1>

          <p className="mt-3 max-w-2xl text-gray-300">
            {isJobSeeker
              ? "Discover opportunities, manage your applications, and build your professional profile."
              : "Manage your company, publish jobs, and track candidates from one place."}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {isJobSeeker ? (
              <>
                <Link
                  to="/jobs"
                  className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500"
                >
                  Find Jobs
                </Link>

                <Link
                  to="/profile"
                  className="rounded-lg bg-white/10 px-5 py-3 font-semibold hover:bg-white/20"
                >
                  Complete Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/recruiter/jobs/create"
                  className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500"
                >
                  Post a Job
                </Link>

                <Link
                  to="/recruiter/jobs"
                  className="rounded-lg bg-white/10 px-5 py-3 font-semibold hover:bg-white/20"
                >
                  Manage Jobs
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {isJobSeeker ? (
            <>
              <DashboardCard
                title="Find Jobs"
                description="Search jobs by title, location, type, work mode and experience."
                link="/jobs"
                button="Browse Jobs"
              />

              <DashboardCard
                title="Applications"
                description="View the jobs you've applied to and track their status."
                link="/applications"
                button="View Applications"
              />

              <DashboardCard
                title="Your Profile"
                description="Add your skills, education, experience and resume."
                link="/profile"
                button="Manage Profile"
              />
            </>
          ) : (
            <>
              <DashboardCard
                title="My Jobs"
                description="Create, update and manage your published job listings."
                link="/recruiter/jobs"
                button="Manage Jobs"
              />

              <DashboardCard
                title="Candidates"
                description="Review applications and update candidate statuses."
                link="/recruiter/applications"
                button="View Candidates"
              />

              <DashboardCard
                title="Company"
                description="Manage your company information and recruiters."
                link="/recruiter/company"
                button="Manage Company"
              />
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  link,
  button,
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">
        {title}
      </h2>

      <p className="mt-3 min-h-12 text-sm leading-6 text-gray-500">
        {description}
      </p>

      <Link
        to={link}
        className="mt-5 inline-block rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        {button}
      </Link>
    </div>
  );
}