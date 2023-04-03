import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import App from "./App";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Analytics from "./components/Analytics";
import CreatePostDialog from "./components/CreatePostDialog";
import { Auth, Hub } from "aws-amplify";
import React, { useEffect, useState, useContext } from "react";
import AuthContext from "./AuthContext";
import LinkedAccounts from "./components/LinkedAccounts";
import LinkAccount from "./components/LinkAccount";

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/linked-accounts" element={<LinkedAccounts />} />
            <Route path="/link-account" element={<LinkAccount />} />
            <Route path="/create-post" element={<CreatePostDialog />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
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
