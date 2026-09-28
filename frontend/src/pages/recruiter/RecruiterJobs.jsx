import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../../components/Navbar";

import {
  fetchRecruiterJobs,
  deleteJob,
  updateJob,
  clearRecruiterMessage,
} from "../../features/recruiter/recruiterSlice";

const statusStyles = {
  DRAFT: "bg-gray-100 text-gray-700",
  PUBLISHED: "bg-green-100 text-green-700",
  CLOSED: "bg-red-100 text-red-700",
};

export default function RecruiterJobs() {
  const dispatch = useDispatch();

  const {
    jobs,
    loadingJobs,
    error,
    success,
  } = useSelector((state) => state.recruiter);

  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    dispatch(fetchRecruiterJobs());

    return () => {
      dispatch(clearRecruiterMessage());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!success && !error) return;

    const timer = setTimeout(() => {
      dispatch(clearRecruiterMessage());
    }, 3000);

    return () => clearTimeout(timer);
  }, [success, error, dispatch]);

  const filteredJobs =
    filter === "ALL"
      ? jobs
      : jobs.filter((job) => job.status === filter);

  const toggleStatus = (job) => {
    const nextStatus =
      job.status === "PUBLISHED"
        ? "CLOSED"
        : "PUBLISHED";

    dispatch(
      updateJob({
        id: job.id,
        data: {
          status: nextStatus,
        },
      })
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Jobs
              </h1>

              <p className="mt-1 text-gray-500">
                Create and manage your job postings.
              </p>
            </div>

            <Link
              to="/recruiter/jobs/create"
              className="rounded-lg bg-indigo-600 px-5 py-3 text-center font-medium text-white hover:bg-indigo-700"
            >
              + Post New Job
            </Link>
          </div>

          {success && (
            <div className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {typeof error === "string"
                ? error
                : JSON.stringify(error)}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {["ALL", "DRAFT", "PUBLISHED", "CLOSED"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    filter === item
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 shadow-sm hover:bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          {loadingJobs ? (
            <div className="mt-8 rounded-2xl bg-white p-10 text-center text-gray-500">
              Loading jobs...
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-white p-12 text-center shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                No jobs found
              </h2>

              <p className="mt-2 text-gray-500">
                Start by creating your first job posting.
              </p>

              <Link
                to="/recruiter/jobs/create"
                className="mt-5 inline-block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
              >
                Create Job
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900">
                          {job.title}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            statusStyles[job.status]
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>

                      <p className="mt-2 text-gray-600">
                        {job.company?.name}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-500">
                        <span>{job.job_type}</span>
                        <span>• {job.work_mode}</span>
                        <span>
                          • {job.experience_level}
                        </span>

                        {job.location && (
                          <span>
                            • {job.location}
                          </span>
                        )}
                      </div>

                      {job.salary_min || job.salary_max ? (
                        <p className="mt-3 text-sm font-medium text-gray-700">
                          {job.salary_currency}{" "}
                          {job.salary_min || "—"} -{" "}
                          {job.salary_max || "—"}
                        </p>
                      ) : null}

                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-start gap-2 lg:max-w-xs lg:justify-end">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                      >
                        View
                      </Link>

                      <Link
                        to={`/recruiter/jobs/${job.id}/edit`}
                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                      >
                        Edit
                      </Link>

                      {job.status !== "DRAFT" && (
                        <button
                          onClick={() => toggleStatus(job)}
                          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                          {job.status === "PUBLISHED"
                            ? "Close"
                            : "Publish"}
                        </button>
                      )}

                      {job.status === "DRAFT" && (
                        <button
                          onClick={() =>
                            dispatch(
                              updateJob({
                                id: job.id,
                                data: {
                                  status: "PUBLISHED",
                                },
                              })
                            )
                          }
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                          Publish
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Delete this job?"
                            )
                          ) {
                            dispatch(deleteJob(job.id));
                          }
                        }}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}