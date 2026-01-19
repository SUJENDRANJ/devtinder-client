import { useState } from "react";
import { Home, Users, Mail, User as UserIcon, LogOut } from "lucide-react";
import { AuthProvider, useAuth } from "./AuthContext";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";

const Layout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { id: "feed", label: "Feed", icon: Home, path: "/" },
    {
      id: "connections",
      label: "Connections",
      icon: Users,
      path: "/connections",
    },
    { id: "requests", label: "Requests", icon: Mail, path: "/requests" },
    { id: "profile", label: "Profile", icon: UserIcon, path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            DevTinder
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 pb-20 sm:pb-0">
        <div className="max-w-7xl mx-auto py-6">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t sm:relative sm:border-t-0">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-around">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center p-2 transition-colors ${
                location.pathname === item.path
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-400"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Feed /> },
      { path: "connections", element: <Connections /> },
      { path: "requests", element: <Requests /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
