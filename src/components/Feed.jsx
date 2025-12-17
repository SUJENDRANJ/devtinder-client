import { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";
import { api } from "../api";

export default function Feed() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const data = await api.getFeed();
      setUsers(data.message || data);
    } catch (error) {
      console.error("Failed to load feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (userId, interested) => {
    if (interested) {
      try {
        await api.sendInterest(userId);
      } catch (error) {
        console.error("Failed to send interest:", error);
      }
    }
    setUsers((prev) => prev.filter((u) => u._id !== userId));
    if (users.length <= 1) {
      loadFeed();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No more developers to show</p>
      </div>
    );
  }

  const currentUser = users[0];

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden ">
        {currentUser.photoUrl && (
          <img
            src={
              currentUser.photoUrl == "https://suje.netlify.app/suje.png"
                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm0gw1Qon8aQmHbrqQD4Z1-LKICaMGlp1HXA&s"
                : currentUser.photoUrl
            }
            alt={`${currentUser.firstName} ${currentUser.lastName}`}
            className="w-full h-64 object-contain"
          />
        )}

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-1">
            {currentUser.firstName} {currentUser.lastName}
          </h2>

          {(currentUser.age || currentUser.gender) && (
            <p className="text-gray-500 text-sm mb-3">
              {currentUser.age && <span>{currentUser.age} yrs</span>}
              {currentUser.age && currentUser.gender && <span> · </span>}
              {currentUser.gender && (
                <span className="capitalize">{currentUser.gender}</span>
              )}
            </p>
          )}

          {currentUser.about && (
            <p className="text-gray-600 mb-4">{currentUser.about}</p>
          )}

          {Array.isArray(currentUser.skills) &&
            currentUser.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {currentUser.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleSwipe(currentUser._id, false)}
          className="bg-white p-4 rounded-full shadow-lg hover:shadow-xl transition"
        >
          <X className="w-8 h-8 text-red-500" />
        </button>
        <button
          onClick={() => handleSwipe(currentUser._id, true)}
          className="bg-white p-4 rounded-full shadow-lg hover:shadow-xl transition"
        >
          <Heart className="w-8 h-8 text-green-500" />
        </button>
      </div>
    </div>
  );
}
