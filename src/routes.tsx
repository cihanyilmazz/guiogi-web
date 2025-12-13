// routes.tsx - güncelleyin
import React from "react";
import Home from "./pages/Home"; 
import Contact from "./pages/Contact"; 
import About from "./pages/About"; 
import Tours from "./pages/Tours"; 
import TourDetail from "./pages/TourDetail";
import Login from "./pages/Login"; // EKLEYİN
import Register from "./pages/Register"; // EKLEYİN
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";

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
  { path: "/giris", element: <Login /> }, // EKLEYİN
  { path: "/kayit", element: <Register /> }, // EKLEYİN
  { path: "/profil", element: <Profile /> }, // BU SATIRI EKLEYİN
  { path: "/rezervasyon", element: <Booking /> },
];

export default routes;