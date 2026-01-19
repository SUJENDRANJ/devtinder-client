import { useState } from "react";
import { useAuth } from "../AuthContext";

const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://devtinder-server-v33b.onrender.com";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    about: user?.about || "",
    photoUrl: user?.photoUrl || "",
    gender: user?.gender || "",
    age: user?.age || 18,
    skills: user?.skills?.join(", ") || "",
  });

  const handleSave = async () => {
    try {
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch(`${API_BASE}/profile/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          skills: skillsArray,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      await refreshUser();
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  min={18}
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About
              </label>
              <textarea
                value={formData.about}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (separated by commas)
              </label>
              <input
                type="text"
                placeholder="e.g. JavaScript, React, Node.js"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo URL
              </label>
              <input
                type="text"
                value={formData.photoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, photoUrl: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              {user.photoUrl && (
                <img
                  src={
                    user.photoUrl == "https://suje.netlify.app/suje.png"
                      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm0gw1Qon8aQmHbrqQD4Z1-LKICaMGlp1HXA&s"
                      : user.photoUrl
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                />
              )}
              <h3 className="mt-4 text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-gray-500">{user.emailId}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  About Me
                </p>
                <p className="mt-1 text-gray-700">
                  {user.about || "No description provided yet."}
                </p>
              </div>
              <div className="flex gap-10">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Age
                  </p>
                  <p className="mt-1 text-gray-700 font-medium">
                    {user.age || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Gender
                  </p>
                  <p className="mt-1 text-gray-700 font-medium capitalize">
                    {user.gender || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {user.skills && user.skills.length > 0 && (
              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Skills & Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
