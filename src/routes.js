import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import App from "./App";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Analytics from "./components/Analytics";
import CreatePostDialog from "./components/CreatePostDialog";

const isLoggedIn = () => {
  // Replace this with your actual authentication logic
  return true;
};

const MainRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/create-post" element={<CreatePostDialog />} />
      <Route path="*" element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);


export default MainRoutes;
