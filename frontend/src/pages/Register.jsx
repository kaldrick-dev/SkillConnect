import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    university: "",
    course: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">
        
        {/* Left Section */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4">
            SkillConnect
          </h1>

          <p className="text-indigo-100 text-lg">
            Connect with internships, mentors, and opportunities
            that help you build real-world experience.
          </p>

          <div className="mt-10 space-y-4">
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-semibold">Internships</h3>
              <p className="text-sm text-indigo-100">
                Discover opportunities from top employers.
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-semibold">Mentorship</h3>
              <p className="text-sm text-indigo-100">
                Learn from experienced professionals.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-10">
          <h2 className="text-3xl font-bold text-black-800 mb-2">
            Create Account
          </h2>

          <p className="text-black-500 mb-8">
            Enter your details to get started.
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3 text-black placeholder:text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3 text-black placeholder:text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />

            <input
              type="text"
              name="university"
              placeholder="University"
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3 text-black placeholder:text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />

            <input
              type="text"
              name="course"
              placeholder="Course"
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3 text-black placeholder:text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3 text-black placeholder:text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3 text-black placeholder:text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />

            <button
              type="submit"
              className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              Register
            </button>

            <p className="md:col-span-2 text-center text-gray-500">
              Already have an account?{" "}
               <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:text-indigo-800 transition">
              Login
            </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}