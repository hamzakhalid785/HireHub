import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  clearAuthError,
} from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    role: "JOB_SEEKER",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    dispatch(clearAuthError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(registerUser(form));

    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  const renderError = () => {
    if (!error) return null;

    if (typeof error === "string") {
      return error;
    }

    return Object.entries(error)
      .map(([key, value]) => {
        const message = Array.isArray(value)
          ? value.join(", ")
          : value;

        return `${key}: ${message}`;
      })
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Join HireHub today
        </p>

        {error && (
          <div className="mt-5 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {renderError()}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              placeholder="First name"
              value={form.first_name}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="text"
              name="last_name"
              placeholder="Last name"
              value={form.last_name}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (minimum 8 characters)"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            name="password_confirm"
            placeholder="Confirm password"
            value={form.password_confirm}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="JOB_SEEKER">Job Seeker</option>
              <option value="RECRUITER">Recruiter</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}