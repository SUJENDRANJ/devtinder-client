import io from "socket.io-client";

export const createSocketConnection = () => {
  const API_BASE =
    location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://devtinder-server-v33b.onrender.com";

  return io(API_BASE);
};
