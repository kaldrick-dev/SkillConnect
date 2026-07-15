import { useState } from "react";

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Guido Kayigamba",
    email: "guido@example.com",
    university: "African Leadership University",
    course: "Computer Science",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    if (isEditing) {
      console.log("Updated Profile:", profile);
      // TODO: Send updated profile to backend
    }

    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Student Profile
            </h1>

            <p className="text-gray-500">
              Manage your personal information and skills.
            </p>
          </div>

          <button
            onClick={handleEdit}
            className="mt-4 md:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>

        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left Profile Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6">

            <div className="flex flex-col items-center">

              <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600">
                G
              </div>

              <h2 className="text-xl font-bold mt-4">
                {profile.fullName}
              </h2>

              <p className="text-gray-500">
                {profile.course}
              </p>

            </div>

            <div className="mt-8 space-y-4">

              <div className="flex justify-between">
                <span className="text-gray-500">University</span>
                <span className="font-medium">
                  ALU
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Profile Completion
                </span>

                <span className="font-medium">
                  80%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full w-4/5"></div>
              </div>

            </div>

          </div>

          {/* Right Side */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Information */}

            <div className="bg-white rounded-3xl shadow-lg p-6">

              <h3 className="text-lg font-bold mb-6">
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-5">

                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`border rounded-xl px-4 py-3 w-full text-black ${
                    isEditing
                      ? "bg-white border-indigo-500"
                      : "bg-gray-100 border-gray-300"
                  }`}
                />

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`border rounded-xl px-4 py-3 w-full text-black ${
                    isEditing
                      ? "bg-white border-indigo-500"
                      : "bg-gray-100 border-gray-300"
                  }`}
                />

                <input
                  type="text"
                  name="university"
                  value={profile.university}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`border rounded-xl px-4 py-3 w-full text-black ${
                    isEditing
                      ? "bg-white border-indigo-500"
                      : "bg-gray-100 border-gray-300"
                  }`}
                />

                <input
                  type="text"
                  name="course"
                  value={profile.course}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`border rounded-xl px-4 py-3 w-full text-black ${
                    isEditing
                      ? "bg-white border-indigo-500"
                      : "bg-gray-100 border-gray-300"
                  }`}
                />

              </div>

            </div>

            {/* Skills */}

            <div className="bg-white rounded-3xl shadow-lg p-6">

              <h3 className="text-lg font-bold mb-5">
                Skills
              </h3>

              <div className="flex flex-wrap gap-3">

                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full">
                  React
                </span>

                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full">
                  JavaScript
                </span>

                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full">
                  Node.js
                </span>

                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full">
                  Git
                </span>

                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full">
                  SQL
                </span>

              </div>

            </div>

            {/* Applications */}

            <div className="bg-white rounded-3xl shadow-lg p-6">

              <h3 className="text-lg font-bold mb-5">
                Recent Applications
              </h3>

              <div className="space-y-4">

                <div className="flex justify-between border-b pb-3">
                  <span>Google Internship</span>
                  <span className="text-yellow-600 font-semibold">
                    Pending
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span>MTN Rwanda</span>
                  <span className="text-green-600 font-semibold">
                    Accepted
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>BK Tech Program</span>
                  <span className="text-blue-600 font-semibold">
                    Under Review
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}