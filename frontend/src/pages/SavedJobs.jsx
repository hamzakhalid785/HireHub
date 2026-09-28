import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import {
  fetchSavedJobs,
  deleteSavedJob,
} from "../features/applications/applicationsSlice";

export default function SavedJobs() {
  const dispatch = useDispatch();

  const {
    savedJobs,
    savedLoading,
    error,
  } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchSavedJobs());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(deleteSavedJob(id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Saved Jobs
        </h1>

        <p className="mt-2 text-gray-500">
          Jobs you've saved for later.
        </p>

        {savedLoading && (
          <div className="py-16 text-center text-gray-500">
            Loading saved jobs...
          </div>
        )}

        {error && !savedLoading && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
            {formatError(error)}
          </div>
        )}

        {!savedLoading && !error && savedJobs.length === 0 && (
          <div className="mt-8 rounded-2xl border bg-white p-12 text-center">
            <div className="text-5xl">♡</div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No saved jobs
            </h2>

            <p className="mt-2 text-gray-500">
              Save interesting jobs and come back to them later.
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        {!savedLoading && savedJobs.length > 0 && (
          <div className="mt-8 space-y-4">
            {savedJobs.map((savedJob) => (
              <div
                key={savedJob.id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div>
                    <Link
                      to={`/jobs/${savedJob.job}`}
                      className="text-xl font-bold text-gray-900 hover:text-indigo-600"
                    >
                      {savedJob.job_title}
                    </Link>

                    <p className="mt-1 text-gray-600">
                      {savedJob.company_name}
                    </p>

                    <p className="mt-2 text-sm text-gray-400">
                      Saved on{" "}
                      {formatDate(savedJob.created_at)}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/jobs/${savedJob.job}`}
                      className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      View Job
                    </Link>

                    <button
                      onClick={() =>
                        handleRemove(savedJob.id)
                      }
                      className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
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