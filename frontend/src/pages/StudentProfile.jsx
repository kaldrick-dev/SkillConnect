import { useState } from "react";
import { Link } from "react-router-dom";

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Guido Kayigamba",
    email: "g.kayigamba@alustudent.com",
    university: "African Leadership University",
    course: "Computer Science",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Profile</h1>
            <p className="text-gray-500">Manage your personal information and skills.</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg"
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600">
                G
              </div>
              <h2 className="text-xl font-bold mt-4">{profile.fullName}</h2>
              <p className="text-gray-500">{profile.course}</p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">University</span>
                <span className="font-medium text-right">{profile.university}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Profile Completion</span>
                <span className="font-medium">80%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full w-4/5"></div>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-bold text-center mb-5">📈 Progress Tracker</h3>

              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span className="font-semibold text-blue-600">75%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-5">
                <div className="bg-blue-600 h-3 rounded-full" style={{width:"75%"}}></div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center mb-5">
                <div><h4 className="font-bold text-green-600">15</h4><p className="text-xs">Done</p></div>
                <div><h4 className="font-bold text-yellow-500">5</h4><p className="text-xs">Pending</p></div>
                <div><h4 className="font-bold text-red-500">21</h4><p className="text-xs">Days Left</p></div>
              </div>

              <Link to="/progress" className="block text-center bg-blue-600 text-white py-3 rounded-xl">
                View Progress
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-6">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-5">
                {["fullName","email","university","course"].map((field)=>(
                  <input key={field} name={field} value={profile[field]} onChange={handleChange}
                  readOnly={!isEditing}
                  className={`border rounded-xl px-4 py-3 w-full text-black ${isEditing?"bg-white border-indigo-500":"bg-gray-100 border-gray-300"}`}/>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-5">Skills</h3>
              <div className="flex flex-wrap gap-3">
                {["React","JavaScript","Node.js","Git","SQL"].map(s=>(
                  <span key={s} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full">{s}</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-5">Recent Applications</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-3"><span>Google Internship</span><span className="text-yellow-600 font-semibold">Pending</span></div>
                <div className="flex justify-between border-b pb-3"><span>MTN Rwanda</span><span className="text-green-600 font-semibold">Accepted</span></div>
                <div className="flex justify-between"><span>BK Tech Program</span><span className="text-blue-600 font-semibold">Under Review</span></div>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/messages" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md">
                Open Chat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
