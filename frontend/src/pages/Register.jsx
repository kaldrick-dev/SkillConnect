import { useState } from "react";

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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8">

        <h1 className="text-4xl font-bold text-black-700 text-center">
          SkillConnect
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Create your student account
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            name="university"
            placeholder="University"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            name="course"
            placeholder="Course"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Register
          </button>

          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <span className="text-blue-600 cursor-pointer">
              Login
            </span>
          </p>

        </form>

      </div>
    </div>
  );
}