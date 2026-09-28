import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import { fetchJobs } from "../features/jobs/jobsSlice";

export default function Jobs() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { jobs, count, next, previous, loading, error } = useSelector(
    (state) => state.jobs
  );

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    job_type: searchParams.get("job_type") || "",
    work_mode: searchParams.get("work_mode") || "",
    experience_level: searchParams.get("experience_level") || "",
  });

  useEffect(() => {
    dispatch(
      fetchJobs({
        ...Object.fromEntries(searchParams.entries()),
      })
    );
  }, [dispatch, searchParams]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    params.set("page", "1");

    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      job_type: "",
      work_mode: "",
      experience_level: "",
    });

    setSearchParams({});
  };

  const goToNext = () => {
    if (!next) return;

    const url = new URL(next);

    setSearchParams(url.searchParams);
  };

  const goToPrevious = () => {
    if (!previous) return;

    const url = new URL(previous);

    setSearchParams(url.searchParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Find Your Next Opportunity
          </h1>

          <p className="mt-2 text-gray-500">
            Discover jobs that match your skills and career goals.
          </p>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleSearch}
          className="rounded-2xl border bg-white p-5 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Job title or keyword"
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Location"
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              name="job_type"
              value={filters.job_type}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Job Type</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="FREELANCE">Freelance</option>
            </select>

            <select
              name="work_mode"
              value={filters.work_mode}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Work Mode</option>
              <option value="REMOTE">Remote</option>
              <option value="ONSITE">Onsite</option>
              <option value="HYBRID">Hybrid</option>
            </select>

            <select
              name="experience_level"
              value={filters.experience_level}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Experience</option>
              <option value="ENTRY">Entry Level</option>
              <option value="JUNIOR">Junior</option>
              <option value="MID">Mid Level</option>
              <option value="SENIOR">Senior</option>
              <option value="LEAD">Lead</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Search Jobs
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Results Header */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Available Jobs
          </h2>

          <span className="text-sm text-gray-500">
            {count} job{count !== 1 ? "s" : ""} found
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center text-gray-500">
            Loading jobs...
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
            Failed to load jobs.
          </div>
        )}

        {/* Empty */}
        {!loading && !error && jobs.length === 0 && (
          <div className="mt-6 rounded-2xl border bg-white p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              No jobs found
            </h3>

            <p className="mt-2 text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* Job Cards */}
        {!loading && jobs.length > 0 && (
          <div className="mt-6 grid gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {(next || previous) && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={goToPrevious}
              disabled={!previous}
              className="rounded-lg border px-5 py-2.5 font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            <button
              onClick={goToNext}
              disabled={!next}
              className="rounded-lg border px-5 py-2.5 font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function JobCard({ job }) {
  const skills = job.skills || [];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col justify-between gap-5 md:flex-row">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-600">
            {job.company?.name?.charAt(0)?.toUpperCase() || "C"}
          </div>

          <div>
            <Link
              to={`/jobs/${job.id}`}
              className="text-xl font-bold text-gray-900 hover:text-indigo-600"
            >
              {job.title}
            </Link>

            <p className="mt-1 font-medium text-gray-600">
              {job.company?.name}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {job.location || "Location not specified"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:max-w-sm md:justify-end">
          <Badge>{formatLabel(job.job_type)}</Badge>
          <Badge>{formatLabel(job.work_mode)}</Badge>
          <Badge>{formatLabel(job.experience_level)}</Badge>
        </div>
      </div>

      <p className="mt-5 line-clamp-2 text-sm leading-6 text-gray-600">
        {job.description}
      </p>

      {skills.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {skills.slice(0, 6).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            >
              Skill #{skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border-t pt-5">
        <div>
          {job.salary_min || job.salary_max ? (
            <span className="font-semibold text-gray-900">
              {job.salary_currency}{" "}
              {job.salary_min || "—"} - {job.salary_max || "—"}
            </span>
          ) : (
            <span className="text-sm text-gray-500">
              Salary not specified
            </span>
          )}
        </div>

        <Link
          to={`/jobs/${job.id}`}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
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