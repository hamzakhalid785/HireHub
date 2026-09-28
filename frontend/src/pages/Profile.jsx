import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/Navbar";

import {
  fetchProfile,
  updateProfile,
  fetchSkills,
  fetchEducation,
  addEducation,
  updateEducation,
  deleteEducation,
  fetchExperience,
  addExperience,
  updateExperience,
  deleteExperience,
  clearProfileMessage,
} from "../features/profile/profileSlice";

const API_BASE = "http://127.0.0.1:8000";

const emptyEducation = {
  institution: "",
  degree: "",
  field_of_study: "",
  start_date: "",
  end_date: "",
  description: "",
};

const emptyExperience = {
  company_name: "",
  job_title: "",
  location: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
};

function formatDate(date) {
  if (!date) return "Present";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function Profile() {
  const dispatch = useDispatch();

  const {
    profile,
    skills,
    education,
    experience,
    loading,
    saving,
    error,
    success,
  } = useSelector((state) => state.profile);

  const { user } = useSelector((state) => state.auth);

  const [profileForm, setProfileForm] = useState({
    headline: "",
    bio: "",
    location: "",
    experience_years: 0,
    skill_ids: [],
    resume: null,
  });

  const [educationForm, setEducationForm] =
    useState(emptyEducation);

  const [experienceForm, setExperienceForm] =
    useState(emptyExperience);

  const [editingEducation, setEditingEducation] =
    useState(null);

  const [editingExperience, setEditingExperience] =
    useState(null);

  const [showEducationForm, setShowEducationForm] =
    useState(false);

  const [showExperienceForm, setShowExperienceForm] =
    useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchSkills());
    dispatch(fetchEducation());
    dispatch(fetchExperience());

    return () => {
      dispatch(clearProfileMessage());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!profile) return;

    setProfileForm({
      headline: profile.headline || "",
      bio: profile.bio || "",
      location: profile.location || "",
      experience_years: profile.experience_years || 0,
      skill_ids: profile.skills?.map((skill) => skill.id) || [],
      resume: null,
    });
  }, [profile]);

  useEffect(() => {
    if (!success && !error) return;

    const timer = setTimeout(() => {
      dispatch(clearProfileMessage());
    }, 3000);

    return () => clearTimeout(timer);
  }, [success, error, dispatch]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillToggle = (skillId) => {
    setProfileForm((prev) => ({
      ...prev,
      skill_ids: prev.skill_ids.includes(skillId)
        ? prev.skill_ids.filter((id) => id !== skillId)
        : [...prev.skill_ids, skillId],
    }));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("headline", profileForm.headline);
    formData.append("bio", profileForm.bio);
    formData.append("location", profileForm.location);
    formData.append(
      "experience_years",
      profileForm.experience_years
    );

    profileForm.skill_ids.forEach((id) => {
      formData.append("skill_ids", id);
    });

    if (profileForm.resume) {
      formData.append("resume", profileForm.resume);
    }

    dispatch(updateProfile(formData));
  };

  const handleEducationSubmit = (event) => {
    event.preventDefault();

    if (editingEducation) {
      dispatch(
        updateEducation({
          id: editingEducation,
          data: educationForm,
        })
      );
    } else {
      dispatch(addEducation(educationForm));
    }

    setEducationForm(emptyEducation);
    setEditingEducation(null);
    setShowEducationForm(false);
  };

  const handleExperienceSubmit = (event) => {
    event.preventDefault();

    if (editingExperience) {
      dispatch(
        updateExperience({
          id: editingExperience,
          data: experienceForm,
        })
      );
    } else {
      dispatch(addExperience(experienceForm));
    }

    setExperienceForm(emptyExperience);
    setEditingExperience(null);
    setShowExperienceForm(false);
  };

  const startEditEducation = (item) => {
    setEducationForm({
      institution: item.institution || "",
      degree: item.degree || "",
      field_of_study: item.field_of_study || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      description: item.description || "",
    });

    setEditingEducation(item.id);
    setShowEducationForm(true);
  };

  const startEditExperience = (item) => {
    setExperienceForm({
      company_name: item.company_name || "",
      job_title: item.job_title || "",
      location: item.location || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      is_current: item.is_current || false,
      description: item.description || "",
    });

    setEditingExperience(item.id);
    setShowExperienceForm(true);
  };

  const profileInitial =
    user?.first_name?.charAt(0) ||
    user?.username?.charAt(0) ||
    "U";

  if (loading && !profile) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-gray-500">
            Loading profile...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              My Profile
            </h1>

            <p className="mt-1 text-gray-500">
              Build your professional profile and stand out to
              recruiters.
            </p>
          </div>

          {success && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {typeof error === "string"
                ? error
                : JSON.stringify(error)}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600">
                  {profileInitial.toUpperCase()}
                </div>

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {user?.first_name || user?.last_name
                    ? `${user?.first_name || ""} ${
                        user?.last_name || ""
                      }`.trim()
                    : user?.username}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {profile?.headline ||
                    "Add a professional headline"}
                </p>

                {profile?.location && (
                  <p className="mt-2 text-sm text-gray-500">
                    📍 {profile.location}
                  </p>
                )}

                {profile?.resume && (
                  <a
                    href={`${API_BASE}${profile.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 w-full rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                  >
                    View Resume
                  </a>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900">
                Professional Information
              </h2>

              <form
                onSubmit={handleProfileSubmit}
                className="mt-5 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Professional Headline
                  </label>

                  <input
                    type="text"
                    name="headline"
                    value={profileForm.headline}
                    onChange={handleProfileChange}
                    placeholder="Full Stack Developer"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Location
                    </label>

                    <input
                      type="text"
                      name="location"
                      value={profileForm.location}
                      onChange={handleProfileChange}
                      placeholder="Gujrat, Pakistan"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Experience Years
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="experience_years"
                      value={profileForm.experience_years}
                      onChange={handleProfileChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    About Me
                  </label>

                  <textarea
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    rows="5"
                    placeholder="Tell recruiters about yourself..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Skills
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => {
                      const selected =
                        profileForm.skill_ids.includes(skill.id);

                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() =>
                            handleSkillToggle(skill.id)
                          }
                          className={`rounded-full border px-4 py-2 text-sm transition ${
                            selected
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-indigo-400"
                          }`}
                        >
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>

                  {skills.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No skills have been added by the administrator
                      yet.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Resume / CV
                  </label>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(event) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        resume:
                          event.target.files?.[0] || null,
                      }))
                    }
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Upload PDF or Word document.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </form>
            </div>
          </div>

          {/* Education */}
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Education
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add your academic background.
                </p>
              </div>

              <button
                onClick={() => {
                  setEducationForm(emptyEducation);
                  setEditingEducation(null);
                  setShowEducationForm(true);
                }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                + Add Education
              </button>
            </div>

            {showEducationForm && (
              <form
                onSubmit={handleEducationSubmit}
                className="mt-6 rounded-xl border bg-gray-50 p-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    placeholder="Institution"
                    value={educationForm.institution}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        institution: e.target.value,
                      })
                    }
                    className="rounded-lg border px-4 py-3"
                  />

                  <input
                    required
                    placeholder="Degree"
                    value={educationForm.degree}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        degree: e.target.value,
                      })
                    }
                    className="rounded-lg border px-4 py-3"
                  />

                  <input
                    placeholder="Field of Study"
                    value={educationForm.field_of_study}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        field_of_study: e.target.value,
                      })
                    }
                    className="rounded-lg border px-4 py-3"
                  />

                  <input
                    type="date"
                    required
                    value={educationForm.start_date}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        start_date: e.target.value,
                      })
                    }
                    className="rounded-lg border px-4 py-3"
                  />

                  <input
                    type="date"
                    value={educationForm.end_date}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        end_date: e.target.value,
                      })
                    }
                    className="rounded-lg border px-4 py-3"
                  />
                </div>

                <textarea
                  placeholder="Description"
                  value={educationForm.description}
                  onChange={(e) =>
                    setEducationForm({
                      ...educationForm,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="mt-4 w-full rounded-lg border px-4 py-3"
                />

                <div className="mt-4 flex gap-3">
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white"
                  >
                    {editingEducation
                      ? "Update Education"
                      : "Add Education"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowEducationForm(false);
                      setEditingEducation(null);
                    }}
                    className="rounded-lg border px-5 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 space-y-4">
              {education.length === 0 && (
                <p className="text-sm text-gray-500">
                  No education added yet.
                </p>
              )}

              {education.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border p-5"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.degree}
                      </h3>

                      <p className="text-indigo-600">
                        {item.institution}
                      </p>

                      {item.field_of_study && (
                        <p className="text-sm text-gray-500">
                          {item.field_of_study}
                        </p>
                      )}

                      <p className="mt-2 text-sm text-gray-500">
                        {formatDate(item.start_date)} —{" "}
                        {formatDate(item.end_date)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          startEditEducation(item)
                        }
                        className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          dispatch(deleteEducation(item.id))
                        }
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {item.description && (
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Experience
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add your professional experience.
                </p>
              </div>

              <button
                onClick={() => {
                  setExperienceForm(emptyExperience);
                  setEditingExperience(null);
                  setShowExperienceForm(true);
                }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                + Add Experience
              </button>
            </div>

            {showExperienceForm && (
              <form
                onSubmit={handleExperienceSubmit}
                className="mt-6 rounded-xl border bg-gray-50 p-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    placeholder="Company Name"
                    value={experienceForm.company_name}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        company_name: e.target.value,
                      })
                    }
                    className="rounded-lg border px-4 py-3"
                  />

                  <input
                    required
                    placeholder="Job Title"
                    value={experienceForm.job_title}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        job_title: e.target.value,
                      })
                    }
                    className="rounded-lg border px-4 py-3"
                  />

                  <input
                    placeholder="Location"
                    value={experienceForm.location}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        location: e.target.value,
                      })
                    }
                    className="rounded-lg border px-4 py-3"
                  />

                  <input
                    type="date"
                    required
                    value={experienceForm.start_date}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        start_date: e.target.value,
                      })
                    }
                    className="rounded-lg border px-4 py-3"
                  />

                  {!experienceForm.is_current && (
                    <input
                      type="date"
                      value={experienceForm.end_date}
                      onChange={(e) =>
                        setExperienceForm({
                          ...experienceForm,
                          end_date: e.target.value,
                        })
                      }
                      className="rounded-lg border px-4 py-3"
                    />
                  )}
                </div>

                <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={experienceForm.is_current}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        is_current: e.target.checked,
                        end_date: e.target.checked
                          ? ""
                          : experienceForm.end_date,
                      })
                    }
                  />
                  I currently work here
                </label>

                <textarea
                  placeholder="Description"
                  value={experienceForm.description}
                  onChange={(e) =>
                    setExperienceForm({
                      ...experienceForm,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                  className="mt-4 w-full rounded-lg border px-4 py-3"
                />

                <div className="mt-4 flex gap-3">
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white"
                  >
                    {editingExperience
                      ? "Update Experience"
                      : "Add Experience"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowExperienceForm(false);
                      setEditingExperience(null);
                    }}
                    className="rounded-lg border px-5 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 space-y-4">
              {experience.length === 0 && (
                <p className="text-sm text-gray-500">
                  No experience added yet.
                </p>
              )}

              {experience.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border p-5"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.job_title}
                      </h3>

                      <p className="text-indigo-600">
                        {item.company_name}
                      </p>

                      {item.location && (
                        <p className="text-sm text-gray-500">
                          {item.location}
                        </p>
                      )}

                      <p className="mt-2 text-sm text-gray-500">
                        {formatDate(item.start_date)} —{" "}
                        {item.is_current
                          ? "Present"
                          : formatDate(item.end_date)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          startEditExperience(item)
                        }
                        className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          dispatch(deleteExperience(item.id))
                        }
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {item.description && (
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}