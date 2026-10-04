import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import { fetchJob } from "../features/jobs/jobsSlice";
import {
  applyForJob,
  saveJob,
  clearApplicationMessage,
} from "../features/applications/applicationsSlice";

export default function JobDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

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
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  if (jobError || !selectedJob) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertIcon />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-gray-900">
            Job not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            The job you're looking for doesn't exist or is no longer available.
          </p>

          <Link
            to="/jobs"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700"
          >
            <ArrowLeftIcon />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const job = selectedJob;
  const isRecruiter = user?.role === "RECRUITER";
  const companyName = job.company?.name || "Company";
  const companyInitial = companyName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-7 sm:px-6 lg:px-8 lg:py-9">
        {/* Back */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-indigo-600"
        >
          <ArrowLeftIcon />
          Back to Jobs
        </Link>

        {/* Header */}
        <section className="relative mt-5 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="h-2 bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-500" />

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-start">
              <div className="flex min-w-0 gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-50 to-violet-100 text-3xl font-extrabold text-indigo-600 ring-1 ring-indigo-100 sm:h-24 sm:w-24">
                  {companyInitial}
                </div>

                <div className="min-w-0">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Open Position
                  </div>

                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                    {job.title}
                  </h1>

                  <p className="mt-2 text-base font-bold text-gray-600">
                    {companyName}
                  </p>

                  <p className="mt-1.5 flex items-center gap-2 text-sm text-gray-500">
                    <LocationIcon />
                    {job.location || "Location not specified"}
                  </p>
                </div>
              </div>

              {!isRecruiter && (
                <div className="flex shrink-0 flex-wrap gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <BookmarkIcon />
                    {saving ? "Saving..." : "Save Job"}
                  </button>

                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                  >
                    <SendIcon />
                    Apply Now
                  </button>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2.5 border-t border-gray-100 pt-7">
              <Tag icon={<BriefcaseIcon />}>
                {formatLabel(job.job_type)}
              </Tag>

              <Tag icon={<LaptopIcon />}>
                {formatLabel(job.work_mode)}
              </Tag>

              <Tag icon={<ChartIcon />}>
                {formatLabel(job.experience_level)}
              </Tag>

              {job.salary_currency && (
                <Tag icon={<DollarIcon />}>
                  {job.salary_currency}
                </Tag>
              )}
            </div>
          </div>
        </section>

        {/* Messages */}
        {success && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            <SuccessIcon />

            <div>
              <p className="font-bold">Application submitted</p>
              <p className="mt-0.5 text-sm">{success}</p>
            </div>
          </div>
        )}

        {applicationError && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertIcon />

            <div>
              <p className="font-bold">Something went wrong</p>
              <p className="mt-0.5 text-sm">
                {formatError(applicationError)}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <ContentSection
              icon={<DocumentIcon />}
              title="Job Description"
              content={job.description}
            />

            {job.responsibilities && (
              <ContentSection
                icon={<CheckListIcon />}
                title="Responsibilities"
                content={job.responsibilities}
              />
            )}

            {job.requirements && (
              <ContentSection
                icon={<ShieldIcon />}
                title="Requirements"
                content={job.requirements}
              />
            )}

            {job.skills?.length > 0 && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
                <SectionHeading
                  icon={<SparkleIcon />}
                  title="Required Skills"
                  subtitle="Skills and technologies relevant to this role"
                />

                <div className="mt-5 flex flex-wrap gap-2.5">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600"
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
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <SectionHeading
                icon={<BriefcaseIcon />}
                title="Job Overview"
                subtitle="Key details about this position"
              />

              <div className="mt-6 space-y-5">
                <Info
                  icon={<BriefcaseIcon />}
                  label="Job Type"
                  value={formatLabel(job.job_type)}
                />

                <Info
                  icon={<LaptopIcon />}
                  label="Work Mode"
                  value={formatLabel(job.work_mode)}
                />

                <Info
                  icon={<ChartIcon />}
                  label="Experience"
                  value={formatLabel(job.experience_level)}
                />

                <Info
                  icon={<LocationIcon />}
                  label="Location"
                  value={job.location || "Not specified"}
                />

                <Info
                  icon={<DollarIcon />}
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
                  icon={<CalendarIcon />}
                  label="Deadline"
                  value={job.deadline || "No deadline"}
                />
              </div>
            </section>

            {job.company && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <SectionHeading
                  icon={<BuildingIcon />}
                  title="About Company"
                  subtitle="Learn more about the employer"
                />

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600">
                    {companyInitial}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      {job.company.name}
                    </h3>

                    {job.company.industry && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        {job.company.industry}
                      </p>
                    )}
                  </div>
                </div>

                {job.company.description && (
                  <p className="mt-5 text-sm leading-6 text-gray-600">
                    {job.company.description}
                  </p>
                )}

                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 transition hover:text-indigo-700"
                  >
                    Visit Company Website
                    <ExternalLinkIcon />
                  </a>
                )}
              </section>
            )}
          </aside>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-gray-100 bg-gray-50/80 px-6 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                    <SendIcon />
                    Application
                  </div>

                  <h2 className="text-xl font-extrabold text-gray-900">
                    Apply for {job.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Submit your application to {companyName}.
                  </p>
                </div>

                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <form onSubmit={handleApply} className="p-6 sm:p-7">
              <label className="block text-sm font-bold text-gray-800">
                Cover Letter
              </label>

              <p className="mt-1 text-xs text-gray-400">
                Explain why your skills and experience make you a good fit.
              </p>

              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={8}
                placeholder="Write your cover letter here..."
                className="mt-4 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />

              <div className="mt-2 flex justify-end text-xs text-gray-400">
                {coverLetter.length} characters
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SendIcon />
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ContentSection({ icon, title, content }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
      <SectionHeading icon={icon} title={title} />

      <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600">
        {content}
      </p>
    </section>
  );
}

function SectionHeading({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <div>
        <h2 className="text-lg font-extrabold text-gray-900">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-0.5 text-xs text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          {label}
        </p>

        <p className="mt-1 wrap-break-word text-sm font-semibold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function Tag({ children, icon }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm font-semibold text-gray-700">
      <span className="text-gray-400">{icon}</span>
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

  if (typeof error === "object" && error !== null) {
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

/* Icons */

function BriefcaseIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" />
      <path d="M3 12h18" strokeWidth="2" />
    </svg>
  );
}

function LaptopIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="13" rx="2" strokeWidth="2" />
      <path d="M2 20h20" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" strokeWidth="2" />
      <circle cx="12" cy="10" r="2.5" strokeWidth="2" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 2v20M17 6.5C16.2 5.5 14.8 5 12.8 5 10.1 5 8 6.3 8 8.4c0 2.3 2.2 3.1 4.7 3.8 2.5.7 4.7 1.5 4.7 3.8 0 2.2-2.2 3.5-5 3.5-2.3 0-4-.7-5.2-2" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 19V5M4 19h16" strokeWidth="2" strokeLinecap="round" />
      <path d="m7 15 4-4 3 2 5-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="16" rx="2" strokeWidth="2" />
      <path d="M16 3v4M8 3v4M3 10h18" strokeWidth="2" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 21V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v17" strokeWidth="2" />
      <path d="M2 21h20M8 6h2M12 6h2M8 10h2M12 10h2" strokeWidth="2" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-3-6 3V4Z" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="m22 2-7 20-4-9-9-4 20-7Z" strokeWidth="2" strokeLinejoin="round" />
      <path d="M22 2 11 13" strokeWidth="2" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" strokeWidth="2" />
      <path d="M14 3v5h5M8 13h8M8 17h6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckListIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="m5 12 2 2 4-4M5 20h14M5 4h14M5 8h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" strokeWidth="2" />
      <path d="m8.5 12 2.2 2.2 4.8-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" strokeWidth="1.8" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M14 5h5v5M19 5l-8 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" strokeWidth="2" />
      <path d="m8 12 2.5 2.5L16 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function ArrowLeftIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M19 12H5M11 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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