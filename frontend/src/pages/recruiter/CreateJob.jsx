import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../../components/Navbar";

import {
  fetchCompanies,
  fetchRecruiterJobs,
  createJob,
  updateJob,
  clearRecruiterMessage,
} from "../../features/recruiter/recruiterSlice";

import { fetchSkills } from "../../features/profile/profileSlice";

const emptyForm = {
  company_id: "",
  title: "",
  description: "",
  responsibilities: "",
  requirements: "",
  salary_min: "",
  salary_max: "",
  salary_currency: "PKR",
  location: "",
  job_type: "FULL_TIME",
  work_mode: "ONSITE",
  experience_level: "ENTRY",
  skills: [],
  status: "DRAFT",
  deadline: "",
};

export default function CreateJob() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const editing = Boolean(id);

  const {
    companies,
    jobs,
    savingJob,
    error,
    success,
  } = useSelector((state) => state.recruiter);

  const { skills } = useSelector(
    (state) => state.profile
  );

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchSkills());

    if (editing) {
      dispatch(fetchRecruiterJobs());
    }

    return () => {
      dispatch(clearRecruiterMessage());
    };
  }, [dispatch, editing]);

  useEffect(() => {
    if (!editing || !id || jobs.length === 0) return;

    const job = jobs.find(
      (item) => item.id === Number(id)
    );

    if (!job) return;

    setForm({
      company_id: job.company?.id || "",
      title: job.title || "",
      description: job.description || "",
      responsibilities: job.responsibilities || "",
      requirements: job.requirements || "",
      salary_min: job.salary_min || "",
      salary_max: job.salary_max || "",
      salary_currency: job.salary_currency || "PKR",
      location: job.location || "",
      job_type: job.job_type || "FULL_TIME",
      work_mode: job.work_mode || "ONSITE",
      experience_level:
        job.experience_level || "ENTRY",
      skills: job.skills || [],
      status: job.status || "DRAFT",
      deadline: job.deadline || "",
    });
  }, [editing, id, jobs]);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      navigate("/recruiter/jobs");
    }, 700);

    return () => clearTimeout(timer);
  }, [success, navigate]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const toggleSkill = (skillId) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((id) => id !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      ...form,
      company_id: Number(form.company_id),
      salary_min: form.salary_min || null,
      salary_max: form.salary_max || null,
      deadline: form.deadline || null,
      skills: form.skills,
    };

    if (editing) {
      dispatch(
        updateJob({
          id: Number(id),
          data,
        })
      );
    } else {
      dispatch(createJob(data));
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Link
              to="/recruiter/jobs"
              className="text-sm text-indigo-600 hover:underline"
            >
              ← Back to My Jobs
            </Link>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              {editing ? "Edit Job" : "Post New Job"}
            </h1>

            <p className="mt-1 text-gray-500">
              {editing
                ? "Update your job posting."
                : "Create a professional job posting for candidates."}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {typeof error === "string"
                ? error
                : JSON.stringify(error)}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Basic */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Basic Information
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Company
                  </label>

                  <select
                    required
                    name="company_id"
                    value={form.company_id}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  >
                    <option value="">
                      Select Company
                    </option>

                    {companies.map((company) => (
                      <option
                        key={company.id}
                        value={company.id}
                      >
                        {company.name}
                      </option>
                    ))}
                  </select>

                  {companies.length === 0 && (
                    <p className="mt-2 text-sm text-red-500">
                      Create a company before posting a job.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Job Title
                  </label>

                  <input
                    required
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Senior Full Stack Developer"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Job Description
                  </label>

                  <textarea
                    required
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="7"
                    placeholder="Describe the role..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3"
                  />
                </div>
              </div>
            </section>

            {/* Details */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Job Details
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <select
                  name="job_type"
                  value={form.job_type}
                  onChange={handleChange}
                  className="rounded-lg border px-4 py-3"
                >
                  <option value="FULL_TIME">
                    Full Time
                  </option>
                  <option value="PART_TIME">
                    Part Time
                  </option>
                  <option value="CONTRACT">
                    Contract
                  </option>
                  <option value="INTERNSHIP">
                    Internship
                  </option>
                  <option value="FREELANCE">
                    Freelance
                  </option>
                </select>

                <select
                  name="work_mode"
                  value={form.work_mode}
                  onChange={handleChange}
                  className="rounded-lg border px-4 py-3"
                >
                  <option value="ONSITE">Onsite</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>

                <select
                  name="experience_level"
                  value={form.experience_level}
                  onChange={handleChange}
                  className="rounded-lg border px-4 py-3"
                >
                  <option value="ENTRY">Entry Level</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="MID">Mid Level</option>
                  <option value="SENIOR">Senior</option>
                  <option value="LEAD">Lead</option>
                </select>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Lahore, Pakistan"
                  className="rounded-lg border px-4 py-3"
                />

                <input
                  type="number"
                  min="0"
                  name="salary_min"
                  value={form.salary_min}
                  onChange={handleChange}
                  placeholder="Minimum Salary"
                  className="rounded-lg border px-4 py-3"
                />

                <input
                  type="number"
                  min="0"
                  name="salary_max"
                  value={form.salary_max}
                  onChange={handleChange}
                  placeholder="Maximum Salary"
                  className="rounded-lg border px-4 py-3"
                />

                <select
                  name="salary_currency"
                  value={form.salary_currency}
                  onChange={handleChange}
                  className="rounded-lg border px-4 py-3"
                >
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>

                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="rounded-lg border px-4 py-3"
                />
              </div>
            </section>

            {/* Responsibilities */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Responsibilities & Requirements
              </h2>

              <div className="mt-5 space-y-4">
                <textarea
                  name="responsibilities"
                  value={form.responsibilities}
                  onChange={handleChange}
                  rows="6"
                  placeholder="• Build scalable applications&#10;• Work with the development team&#10;• Review code"
                  className="w-full resize-none rounded-lg border px-4 py-3"
                />

                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  rows="6"
                  placeholder="• 2+ years experience&#10;• React knowledge&#10;• Django/REST API experience"
                  className="w-full resize-none rounded-lg border px-4 py-3"
                />
              </div>
            </section>

            {/* Skills */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Required Skills
              </h2>

              <div className="mt-5 flex flex-wrap gap-2">
                {skills.map((skill) => {
                  const selected =
                    form.skills.includes(skill.id);

                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() =>
                        toggleSkill(skill.id)
                      }
                      className={`rounded-full border px-4 py-2 text-sm ${
                        selected
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-gray-300 hover:border-indigo-400"
                      }`}
                    >
                      {skill.name}
                    </button>
                  );
                })}
              </div>

              {skills.length === 0 && (
                <p className="text-sm text-gray-500">
                  No skills available.
                </p>
              )}
            </section>

            {/* Publish */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Publishing
              </h2>

              <div className="mt-4">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                >
                  <option value="DRAFT">
                    Save as Draft
                  </option>
                  <option value="PUBLISHED">
                    Publish Job
                  </option>
                </select>
              </div>
            </section>

            <div className="flex justify-end gap-3">
              <Link
                to="/recruiter/jobs"
                className="rounded-lg border bg-white px-6 py-3 font-medium"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={savingJob}
                className="rounded-lg bg-indigo-600 px-7 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {savingJob
                  ? "Saving..."
                  : editing
                  ? "Update Job"
                  : "Create Job"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}