import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://devtinder-server-v33b.onrender.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/profile/view`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || data.data || data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailId, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ emailId, password }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Login failed");
    }
    await refreshUser();
  };

  const signup = async (data) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Signup failed");
    }
    await refreshUser();
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
