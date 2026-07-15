import { useState } from "react";

export default function CreateInternship() {
  const [internship, setInternship] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    duration: "",
    stipend: "",
    deadline: "",
    category: "",
    skills: "",
    description: "",
    requirements: "",
  });

  const handleChange = (e) => {
    setInternship({
      ...internship,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(internship);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Create Internship
          </h1>

          <p className="text-gray-500">
            Fill in the details below to publish a new internship opportunity.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-lg p-8"
        >

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-medium">
                Internship Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Frontend Developer Intern"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Company Name
              </label>

              <input
                type="text"
                name="company"
                placeholder="SkillConnect Ltd"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Location
              </label>

              <input
                type="text"
                name="location"
                placeholder="Kigali, Rwanda"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Internship Type
              </label>

              <select
                name="type"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Duration
              </label>

              <input
                type="text"
                name="duration"
                placeholder="3 Months"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Monthly Wage (Rwf)
              </label>

              <input
                type="number"
                name="stipend"
                placeholder="100000"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Application Deadline
              </label>

              <input
                type="date"
                name="deadline"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Category
              </label>

              <select
                name="category"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option>Software Engineering</option>
                <option>Data Science</option>
                <option>Cyber Security</option>
                <option>UI/UX Design</option>
                <option>Marketing</option>
                <option>Finance</option>
              </select>
            </div>

          </div>

          <div className="mt-6">

            <label className="block mb-2 font-medium">
              Required Skills
            </label>

            <input
              type="text"
              name="skills"
              placeholder="React, Node.js, Git"
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />

          </div>

          <div className="mt-6">

            <label className="block mb-2 font-medium">
              Internship Description
            </label>

            <textarea
              rows="5"
              name="description"
              placeholder="Describe the internship..."
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            ></textarea>

          </div>

          <div className="mt-6">

            <label className="block mb-2 font-medium">
              Requirements
            </label>

            <textarea
              rows="5"
              name="requirements"
              placeholder="List internship requirements..."
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            ></textarea>

          </div>

          <div className="mt-8 flex justify-end">

            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-3 rounded-xl shadow-lg hover:scale-105 transition"
            >
              Publish Internship
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}