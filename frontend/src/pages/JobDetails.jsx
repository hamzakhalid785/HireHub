import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import { fetchJob } from "../features/jobs/jobsSlice";
import {applyForJob,saveJob,clearApplicationMessage,} from "../features/applications/applicationsSlice";

export default function JobDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedJob, detailLoading, error: jobError } =
    useSelector((state) => state.jobs);

  const {
    submitting,
    saving,
    error: applicationError,
    success,
  } = useSelector((state) => state.applications);

  const { user } = useSelector((state) => state.auth);

  const [coverLetter, setCoverLetter] = useState("");
  const [showApplicationForm, setShowApplicationForm] =
    useState(false);

  useEffect(() => {
    dispatch(fetchJob(id));

    return () => {
      dispatch(clearApplicationMessage());
    };
  }, [dispatch, id]);

  const handleApply = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      applyForJob({
        jobId: selectedJob.id,
        coverLetter,
      })
    );

    if (applyForJob.fulfilled.match(result)) {
      setShowApplicationForm(false);
      setCoverLetter("");
    }
  };

  const handleSave = async () => {
    await dispatch(saveJob(selectedJob.id));
  };

  if (detailLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="py-20 text-center text-gray-500">
          Loading job...
        </div>
      </div>
    );
  }

  if (jobError || !selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Job not found
          </h1>

          <p className="mt-2 text-gray-500">
            The job you're looking for doesn't exist or is unavailable.
          </p>

          <Link
            to="/jobs"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const job = selectedJob;

  const isRecruiter = user?.role === "RECRUITER";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Link
          to="/jobs"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to Jobs
        </Link>

        {/* Header */}
        <section className="mt-5 rounded-2xl border bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div className="flex gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-3xl font-bold text-indigo-600">
                {job.company?.name?.charAt(0)?.toUpperCase() ||
                  "C"}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {job.title}
                </h1>

                <p className="mt-2 text-lg font-medium text-gray-600">
                  {job.company?.name}
                </p>

                <p className="mt-1 text-gray-500">
                  {job.location || "Location not specified"}
                </p>
              </div>
            </div>

            {!isRecruiter && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "♡ Save Job"}
                </button>

                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                >
                  Apply Now
                </button>
              </div>
            )}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Tag>{formatLabel(job.job_type)}</Tag>
            <Tag>{formatLabel(job.work_mode)}</Tag>
            <Tag>
              {formatLabel(job.experience_level)}
            </Tag>
            <Tag>{job.salary_currency}</Tag>
          </div>
        </section>

        {/* Messages */}
        {success && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {applicationError && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {formatError(applicationError)}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            <ContentSection
              title="Job Description"
              content={job.description}
            />

            {job.responsibilities && (
              <ContentSection
                title="Responsibilities"
                content={job.responsibilities}
              />
            )}

            {job.requirements && (
              <ContentSection
                title="Requirements"
                content={job.requirements}
              />
            )}

            {job.skills?.length > 0 && (
              <section className="rounded-2xl border bg-white p-7 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  Required Skills
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600"
                    >
                      Skill #{skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Job Overview
              </h2>

              <div className="mt-5 space-y-4">
                <Info
                  label="Job Type"
                  value={formatLabel(job.job_type)}
                />

                <Info
                  label="Work Mode"
                  value={formatLabel(job.work_mode)}
                />

                <Info
                  label="Experience"
                  value={formatLabel(job.experience_level)}
                />

                <Info
                  label="Location"
                  value={job.location || "Not specified"}
                />

                <Info
                  label="Salary"
                  value={
                    job.salary_min || job.salary_max
                      ? `${job.salary_currency} ${
                          job.salary_min || "—"
                        } - ${job.salary_max || "—"}`
                      : "Not specified"
                  }
                />

                <Info
                  label="Deadline"
                  value={job.deadline || "No deadline"}
                />
              </div>
            </section>

            {job.company && (
              <section className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">
                  About Company
                </h2>

                <h3 className="mt-4 font-semibold text-indigo-600">
                  {job.company.name}
                </h3>

                {job.company.industry && (
                  <p className="mt-2 text-sm text-gray-500">
                    {job.company.industry}
                  </p>
                )}

                {job.company.description && (
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {job.company.description}
                  </p>
                )}

                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
                  >
                    Visit Website →
                  </a>
                )}
              </section>
            )}
          </aside>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Apply for {job.title}
              </h2>

              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleApply} className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Cover Letter
              </label>

              <textarea
                value={coverLetter}
                onChange={(e) =>
                  setCoverLetter(e.target.value)
                }
                rows={7}
                placeholder="Tell the recruiter why you're a good fit..."
                className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowApplicationForm(false)
                  }
                  className="rounded-lg border px-5 py-2.5 font-medium text-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ContentSection({ title, content }) {
  return (
    <section className="rounded-2xl border bg-white p-7 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">
        {title}
      </h2>

      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
        {content}
      </p>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="border-b pb-3 last:border-b-0 last:pb-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
      {children}
    </span>
  );
}

function formatLabel(value) {
  if (!value) return "";

  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatError(error) {
  if (typeof error === "string") return error;

  if (typeof error === "object") {
    return Object.entries(error)
      .map(([key, value]) => {
        const message = Array.isArray(value)
          ? value.join(", ")
          : value;

        return `${key}: ${message}`;
      })
      .join(" ");
  }

  return "Something went wrong.";
}