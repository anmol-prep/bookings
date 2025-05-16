import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConsentPage from "../pages/ConsentPage";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ConsentPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
