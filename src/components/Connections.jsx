import { useState, useEffect } from "react";
import { api } from "../api";

export default function Connections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const data = await api.getConnections();
      setConnections(data.data || data);
    } catch (error) {
      console.error("Failed to load connections:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Connections</h2>
      {connections.length === 0 ? (
        <p className="text-gray-500">No connections yet</p>
      ) : (
        <div className="space-y-4">
          {connections.map((conn) => (
            <div
              key={conn._id}
              className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
            >
              {conn.photoUrl && (
                <img
                  src={
                    conn.photoUrl == "https://suje.netlify.app/suje.png"
                      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm0gw1Qon8aQmHbrqQD4Z1-LKICaMGlp1HXA&s"
                      : conn.photoUrl
                  }
                  alt={conn.firstName}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h3 className="font-bold">
                  {conn.firstName} {conn.lastName}
                </h3>
                <p className="text-sm text-gray-600">{conn.about}</p>
                {conn.skills && conn.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {conn.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
