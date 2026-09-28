import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../../components/Navbar";

import {
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  clearRecruiterMessage,
} from "../../features/recruiter/recruiterSlice";

const emptyForm = {
  name: "",
  website: "",
  description: "",
  industry: "",
  location: "",
  size: "",
};

export default function CompanyManagement() {
  const dispatch = useDispatch();

  const {
    companies,
    loadingCompanies,
    savingCompany,
    error,
    success,
  } = useSelector((state) => state.recruiter);

  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchCompanies());

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

  const myCompanies = companies.filter((company) =>
    company.recruiters?.includes(user?.id)
  );

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingId) {
      dispatch(
        updateCompany({
          id: editingId,
          data: form,
        })
      );
    } else {
      dispatch(createCompany(form));
    }

    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (company) => {
    setEditingId(company.id);

    setForm({
      name: company.name || "",
      website: company.website || "",
      description: company.description || "",
      industry: company.industry || "",
      location: company.location || "",
      size: company.size || "",
    });
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Company Management
            </h1>

            <p className="mt-1 text-gray-500">
              Manage the company profile used for your job
              postings.
            </p>
          </div>

          {success && (
            <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {typeof error === "string"
                ? error
                : JSON.stringify(error)}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Form */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId
                  ? "Edit Company"
                  : "Create Company"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="mt-5 space-y-4"
              >
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                />

                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                />

                <input
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  placeholder="Industry"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                />

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                />

                <select
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="">Company Size</option>
                  <option value="STARTUP">Startup</option>
                  <option value="SMALL">Small</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LARGE">Large</option>
                  <option value="ENTERPRISE">
                    Enterprise
                  </option>
                </select>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Company description..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={savingCompany}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {savingCompany
                      ? "Saving..."
                      : editingId
                      ? "Update Company"
                      : "Create Company"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-lg border px-4 py-3"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Companies */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  Your Companies
                </h2>

                {loadingCompanies ? (
                  <p className="mt-6 text-gray-500">
                    Loading companies...
                  </p>
                ) : myCompanies.length === 0 ? (
                  <div className="mt-6 rounded-xl border border-dashed p-10 text-center">
                    <p className="text-gray-500">
                      You haven't created a company yet.
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Create one using the form.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    {myCompanies.map((company) => (
                      <div
                        key={company.id}
                        className="rounded-xl border p-5"
                      >
                        <div className="flex flex-col justify-between gap-4 sm:flex-row">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {company.name}
                            </h3>

                            <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
                              {company.industry && (
                                <span>
                                  {company.industry}
                                </span>
                              )}

                              {company.location && (
                                <span>
                                  • {company.location}
                                </span>
                              )}

                              {company.size && (
                                <span>
                                  • {company.size}
                                </span>
                              )}
                            </div>

                            {company.website && (
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-block text-sm text-indigo-600 hover:underline"
                              >
                                Visit Website
                              </a>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleEdit(company)
                              }
                              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Delete this company?"
                                  )
                                ) {
                                  dispatch(
                                    deleteCompany(company.id)
                                  );
                                }
                              }}
                              className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {company.description && (
                          <p className="mt-4 text-sm leading-6 text-gray-600">
                            {company.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}