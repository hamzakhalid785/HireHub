import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import {
  fetchMyApplications,
} from "../features/applications/applicationsSlice";

export default function Applications() {
  const dispatch = useDispatch();

  const {
    applications,
    loading,
    error,
  } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Applications
          </h1>

          <p className="mt-2 text-gray-500">
            Track the jobs you've applied for and monitor their progress.
          </p>
        </div>

        {loading && (
          <div className="py-16 text-center text-gray-500">
            Loading applications...
          </div>
        )}

        {error && !loading && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
            {formatError(error)}
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="mt-8 rounded-2xl border bg-white p-12 text-center">
            <div className="text-5xl">📄</div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No applications yet
            </h2>

            <p className="mt-2 text-gray-500">
              Start applying to jobs that match your skills.
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Find Jobs
            </Link>
          </div>
        )}

        {!loading && applications.length > 0 && (
          <div className="mt-8 space-y-4">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ApplicationCard({ application }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-5 md:flex-row">
        <div>
          <Link
            to={`/jobs/${application.job}`}
            className="text-xl font-bold text-gray-900 hover:text-indigo-600"
          >
            {application.job_title}
          </Link>

          <p className="mt-1 font-medium text-gray-600">
            {application.company_name}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Applied on{" "}
            {formatDate(application.applied_at)}
          </p>
        </div>

        <StatusBadge status={application.status} />
      </div>

      {application.cover_letter && (
        <div className="mt-5 border-t pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Cover Letter
          </p>

          <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-6 text-gray-600">
            {application.cover_letter}
          </p>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    APPLIED: "bg-blue-50 text-blue-600",
    SHORTLISTED: "bg-purple-50 text-purple-600",
    INTERVIEW: "bg-yellow-50 text-yellow-700",
    HIRED: "bg-green-50 text-green-600",
    REJECTED: "bg-red-50 text-red-600",
  };

  const labels = {
    APPLIED: "Applied",
    SHORTLISTED: "Shortlisted",
    INTERVIEW: "Interview",
    HIRED: "Hired",
    REJECTED: "Rejected",
  };

  return (
    <span
      className={`h-fit rounded-full px-4 py-2 text-sm font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "Unknown";

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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