import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";

import {
  fetchRecruiterApplications,
  updateApplicationStatus,
  clearApplicationMessage,
} from "../../features/recruiter/recruiterApplicationsSlice";

const STATUS_OPTIONS = [
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEW",
  "HIRED",
  "REJECTED",
];

const statusStyles = {
  APPLIED: "bg-blue-100 text-blue-700",
  SHORTLISTED: "bg-yellow-100 text-yellow-700",
  INTERVIEW: "bg-purple-100 text-purple-700",
  HIRED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function RecruiterApplications() {
  const dispatch = useDispatch();

  const {
    applications,
    loading,
    updating,
    error,
    success,
  } = useSelector((state) => state.recruiterApplications);

  const [filter, setFilter] = useState("ALL");
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    dispatch(fetchRecruiterApplications());

    return () => {
      dispatch(clearApplicationMessage());
    };
  }, [dispatch]);

  const filteredApplications = useMemo(() => {
    if (filter === "ALL") {
      return applications;
    }

    return applications.filter(
      (application) => application.status === filter
    );
  }, [applications, filter]);

  const handleStatusChange = (applicationId, status) => {
    dispatch(
      updateApplicationStatus({
        applicationId,
        status,
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Candidate Applications
          </h1>

          <p className="mt-2 text-gray-600">
            Review applicants and manage their recruitment status.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === "ALL"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 shadow-sm hover:bg-gray-100"
            }`}
          >
            All
          </button>

          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === status
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 shadow-sm hover:bg-gray-100"
              }`}
            >
              {formatStatus(status)}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">Loading applications...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredApplications.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              📄
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              No applications found
            </h2>

            <p className="mt-2 text-gray-500">
              Applications for your jobs will appear here.
            </p>
          </div>
        )}

        {/* Applications */}
        {!loading && filteredApplications.length > 0 && (
          <div className="space-y-5">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* Candidate info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        {application.applicant_name ||
                          application.applicant?.username ||
                          application.applicant?.email ||
                          "Candidate"}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[application.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {formatStatus(application.status)}
                      </span>
                    </div>

                    <p className="mt-2 text-gray-600">
                      Applied for{" "}
                      <span className="font-semibold text-gray-900">
                        {application.job_title || application.job?.title}
                      </span>
                    </p>

                    {(application.company_name ||
                      application.job?.company?.name) && (
                      <p className="mt-1 text-sm text-gray-500">
                        {application.company_name ||
                          application.job?.company?.name}
                      </p>
                    )}

                    {application.applied_at && (
                      <p className="mt-2 text-sm text-gray-400">
                        Applied{" "}
                        {new Date(
                          application.applied_at
                        ).toLocaleDateString()}
                      </p>
                    )}

                    {/* Cover letter */}
                    {application.cover_letter && (
                      <div className="mt-5">
                        <h3 className="mb-2 text-sm font-semibold text-gray-900">
                          Cover Letter
                        </h3>

                        <p className="whitespace-pre-line rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                          {application.cover_letter}
                        </p>
                      </div>
                    )}

                    {/* Resume */}
                    {application.resume && (
                      <div className="mt-4">
                        <a
                          href={
                            application.resume.startsWith("http")
                              ? application.resume
                              : `http://127.0.0.1:8000${application.resume}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="w-full lg:w-64">
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      Update Status
                    </label>

                    <select
                      value={application.status}
                      disabled={updating}
                      onChange={(e) =>
                        handleStatusChange(
                          application.id,
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {formatStatus(status)}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() =>
                        setSelectedApplication(application)
                      }
                      className="mt-3 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                      View Details
                    </button>

                    <Link
                      to={`/jobs/${application.job}`}
                      className="mt-3 block w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Candidate Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Application #{selectedApplication.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedApplication(null)}
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm text-gray-500">Candidate</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selectedApplication.applicant_name ||
                    selectedApplication.applicant?.username ||
                    selectedApplication.applicant?.email ||
                    "Candidate"}
                </p>
              </div>

              {selectedApplication.applicant_email && (
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {selectedApplication.applicant_email}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selectedApplication.job_title ||
                    selectedApplication.job?.title ||
                    "Job"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Current Status</p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyles[selectedApplication.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {formatStatus(selectedApplication.status)}
                </span>
              </div>

              {selectedApplication.cover_letter && (
                <div>
                  <p className="text-sm text-gray-500">Cover Letter</p>

                  <p className="mt-2 whitespace-pre-line rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                    {selectedApplication.cover_letter}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedApplication(null)}
              className="mt-7 w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}