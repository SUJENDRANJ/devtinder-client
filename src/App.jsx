import { useState } from "react";
import { Home, Users, Mail, User as UserIcon, LogOut } from "lucide-react";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";

function MainApp() {
  const { user, loading, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState("feed");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return isLogin ? (
      <Login onToggle={() => setIsLogin(false)} />
    ) : (
      <Signup onToggle={() => setIsLogin(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">DevTinder</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1">
        {currentPage === "feed" && <Feed />}
        {currentPage === "connections" && <Connections />}
        {currentPage === "requests" && <Requests />}
        {currentPage === "profile" && <Profile />}
      </main>

      <nav className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-around">
          <button
            onClick={() => setCurrentPage("feed")}
            className={`flex flex-col items-center p-2 ${
              currentPage === "feed" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Feed</span>
          </button>
          <button
            onClick={() => setCurrentPage("connections")}
            className={`flex flex-col items-center p-2 ${
              currentPage === "connections" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">Connections</span>
          </button>
          <button
            onClick={() => setCurrentPage("requests")}
            className={`flex flex-col items-center p-2 ${
              currentPage === "requests" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <Mail className="w-6 h-6" />
            <span className="text-xs mt-1">Requests</span>
          </button>
          <button
            onClick={() => setCurrentPage("profile")}
            className={`flex flex-col items-center p-2 ${
              currentPage === "profile" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <UserIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
