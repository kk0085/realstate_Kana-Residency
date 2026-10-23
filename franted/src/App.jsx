import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./admin/Dashboard";
import AdminProperties from "./admin/Properties";
import AdminProjects from "./admin/Projects";
import AdminLeads from "./admin/Leads";
import AdminVisits from "./admin/Visits";
import Settings from "./admin/Settings";

function ProtectedAdminRoute() {
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />

      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />

      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/properties" element={<AdminProperties />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/leads" element={<AdminLeads />} />
        <Route path="/admin/visits" element={<AdminVisits />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}