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

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Page Header */}
        <section className="mb-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
                <BriefcaseIcon />
                Career Opportunities
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Find Your Next Opportunity
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Discover jobs that match your skills, experience and career goals.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <SearchIcon />
              </div>

              <div>
                <p className="text-xs text-gray-400">Available</p>
                <p className="text-sm font-bold text-gray-900">
                  {count || 0} Jobs
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <form
          onSubmit={handleSearch}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <FilterIcon />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Search & Filters
                  </h2>

                  <p className="text-xs text-gray-400">
                    Refine your job search
                  </p>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-600">
                  {activeFilterCount} active
                </span>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <FilterInput
                label="Keyword"
                icon={<SearchIcon />}
                type="text"
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Job title or keyword"
              />

              <FilterInput
                label="Location"
                icon={<LocationIcon />}
                type="text"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="City or location"
              />

              <FilterSelect
                label="Job Type"
                name="job_type"
                value={filters.job_type}
                onChange={handleChange}
                options={[
                  ["", "All Job Types"],
                  ["FULL_TIME", "Full Time"],
                  ["PART_TIME", "Part Time"],
                  ["CONTRACT", "Contract"],
                  ["INTERNSHIP", "Internship"],
                  ["FREELANCE", "Freelance"],
                ]}
              />

              <FilterSelect
                label="Work Mode"
                name="work_mode"
                value={filters.work_mode}
                onChange={handleChange}
                options={[
                  ["", "All Work Modes"],
                  ["REMOTE", "Remote"],
                  ["ONSITE", "Onsite"],
                  ["HYBRID", "Hybrid"],
                ]}
              />

              <FilterSelect
                label="Experience"
                name="experience_level"
                value={filters.experience_level}
                onChange={handleChange}
                options={[
                  ["", "All Experience"],
                  ["ENTRY", "Entry Level"],
                  ["JUNIOR", "Junior"],
                  ["MID", "Mid Level"],
                  ["SENIOR", "Senior"],
                  ["LEAD", "Lead"],
                ]}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                <SearchIcon />
                Search Jobs
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                <RefreshIcon />
                Clear Filters
              </button>
            </div>
          </div>
        </form>

        {/* Results Header */}
        <div className="mt-9 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              Available Jobs
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Explore opportunities and find the right fit for your career.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="rounded-lg bg-white px-3 py-2 font-semibold shadow-sm ring-1 ring-gray-200">
              {count} job{count !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

            <p className="mt-4 text-sm font-medium text-gray-500">
              Finding the best opportunities...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertIcon />
              </div>

              <div>
                <h3 className="font-bold text-red-800">
                  Unable to load jobs
                </h3>

                <p className="mt-1 text-sm text-red-600">
                  Please check your connection and try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && jobs.length === 0 && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <SearchIcon />
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              No jobs found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              We couldn't find opportunities matching your current filters.
              Try changing your search criteria.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
            >
              Clear Filters
            </button>
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
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={goToPrevious}
              disabled={!previous}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeftIcon />
              Previous
            </button>

            <button
              onClick={goToNext}
              disabled={!next}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ArrowRightIcon />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function JobCard({ job }) {
  const skills = job.skills || [];

  const companyName = job.company?.name || "Company";
  const companyInitial = companyName.charAt(0).toUpperCase();

  return (
    <article className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/40 sm:p-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row">
        <div className="flex min-w-0 gap-4">
          {/* Company Logo */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-50 to-violet-100 text-xl font-extrabold text-indigo-600 ring-1 ring-indigo-100">
            {companyInitial}
          </div>

          <div className="min-w-0">
            <Link
              to={`/jobs/${job.id}`}
              className="block truncate text-xl font-extrabold text-gray-900 transition hover:text-indigo-600"
            >
              {job.title}
            </Link>

            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-600">
              <BuildingIcon />
              {companyName}
            </p>

            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
              <LocationIcon />
              {job.location || "Location not specified"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-2 lg:max-w-sm lg:justify-end">
          <Badge>{formatLabel(job.job_type)}</Badge>
          <Badge>{formatLabel(job.work_mode)}</Badge>
          <Badge>{formatLabel(job.experience_level)}</Badge>
        </div>
      </div>

      <div className="my-5 border-t border-gray-100" />

      <p className="line-clamp-2 text-sm leading-6 text-gray-600">
        {job.description}
      </p>

      {skills.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Skills
          </p>

          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600"
              >
                Skill #{skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col justify-between gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Salary
          </p>

          {job.salary_min || job.salary_max ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm font-extrabold text-gray-900">
              <DollarIcon />
              {job.salary_currency} {job.salary_min || "—"} -{" "}
              {job.salary_max || "—"}
            </p>
          ) : (
            <p className="mt-1 text-sm font-medium text-gray-500">
              Salary not specified
            </p>
          )}
        </div>

        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-100 transition hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          View Details
          <ArrowRightIcon />
        </Link>
      </div>
    </article>
  );
}

function FilterInput({
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
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
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
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
      </div>
    </div>
  );
}

function FilterSelect({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
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

/* Icons */

function SearchIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" strokeWidth="2" />
      <path d="m20 20-4-4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" />
      <path d="M3 12h18" strokeWidth="2" />
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

function LocationIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
        strokeWidth="2"
      />
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

function FilterIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 6h16M7 12h10M10 18h4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M20 11a8 8 0 1 0 1 4M20 5v6h-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}