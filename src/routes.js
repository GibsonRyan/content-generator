import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Lessons from "./components/Lessons";
import CreatePostDialog from "./components/CreatePostDialog";
import React, { useEffect, useState, useContext } from "react";
import AuthContext from "./AuthContext";
import Chatbot from "./components/Chatbot";
import LinkAccount from "./components/LinkAccount";
import Layout from "./components/Layout";
import Translator from "./components/LiveTranslator";

const MainRoutes = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/live-translate" element={<Translator />} />
              <Route path="/link-account" element={<LinkAccount />} />
              <Route path="/create-post" element={<CreatePostDialog />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoutes;
