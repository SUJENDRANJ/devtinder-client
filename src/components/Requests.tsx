import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { ConnectionRequest } from "../types";
import { api } from "../api";

export default function Requests() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await api.getReceivedRequests();
      setRequests(data.data || data);
    } catch (error) {
      console.error("Failed to load requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (
    requestId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      await api.reviewRequest(status, requestId);
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (error) {
      console.error("Failed to review request:", error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Received Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-4">
                {req.fromUserId.photoUrl && (
                  <img
                    src={
                      req.fromUserId.photoUrl ==
                      "https://suje.netlify.app/suje.png"
                        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm0gw1Qon8aQmHbrqQD4Z1-LKICaMGlp1HXA&s"
                        : req.fromUserId.photoUrl
                    }
                    alt={req.fromUserId.firstName}
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold">
                    {req.fromUserId.firstName} {req.fromUserId.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {req.fromUserId.about}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReview(req._id, "rejected")}
                    className="p-2 bg-red-100 rounded-full hover:bg-red-200"
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                  <button
                    onClick={() => handleReview(req._id, "accepted")}
                    className="p-2 bg-green-100 rounded-full hover:bg-green-200"
                  >
                    <Check className="w-5 h-5 text-green-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
