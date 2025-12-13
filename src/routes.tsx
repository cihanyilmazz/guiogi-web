// routes.tsx - güncelleyin
import React from "react";
import Home from "./pages/Home"; 
import Contact from "./pages/Contact"; 
import About from "./pages/About"; 
import Tours from "./pages/Tours"; 
import TourDetail from "./pages/TourDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import TourManagement from "./pages/admin/TourManagement";
import BookingManagement from "./pages/admin/BookingManagement";
import AboutManagement from "./pages/admin/AboutManagement";
import ContactManagement from "./pages/admin/ContactManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import AgentLayout from "./pages/agent/AgentLayout";
import AgentTourManagement from "./pages/agent/AgentTourManagement";
import AgentBookings from "./pages/agent/AgentBookings";
import ProtectedRoute from "./components/ProtectedRoute";

interface RouteType {
  path: string;
  element: React.ReactElement;
  children?: RouteType[];
}

const routes: RouteType[] = [
  { path: "/", element: <Home /> }, 
  { path: "/iletisim", element: <Contact /> }, 
  { path: "/hakkimizda", element: <About /> }, 
  { path: "/turlar", element: <Tours /> }, 
  { path: "/tour/:id", element: <TourDetail /> },
  { path: "/blog", element: <Blog /> },
  { path: "/blog/:slug", element: <BlogDetail /> },
  { path: "/giris", element: <Login /> },
  { path: "/kayit", element: <Register /> },
  { 
    path: "/profil", 
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  { path: "/rezervasyon", element: <Booking /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "users", element: <UserManagement /> },
      { path: "tours", element: <TourManagement /> },
      { path: "bookings", element: <BookingManagement /> },
      { path: "about", element: <AboutManagement /> },
      { path: "contact", element: <ContactManagement /> },
      { path: "blogs", element: <BlogManagement /> },
    ],
  },
  {
    path: "/agent",
    element: (
      <ProtectedRoute requiredRole="agent">
        <AgentLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "tours", element: <AgentTourManagement /> },
      { path: "bookings", element: <AgentBookings /> },
    ],
  },
];

export default routes;