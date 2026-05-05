import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../Layout";

import LandingPage from "../pages/LandingPage";
import DashboardPage from "../pages/DashboardPage";
import NewProjectPage from "../pages/NewProjectPage";
import ProcessingPage from "../pages/ProcessingPage";
import DesignResultsPage from "../pages/DesignResultsPage";
import DesignComparisonPage from "../pages/DesignComparisonPage";
import DesignDetailsPage from "../pages/DesignDetailsPage";
import ProjectsPage from "../pages/ProjectsPage";

import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import UploadPage from "../pages/UploadPage";
import ExportPage from "../pages/ExportPage";
import PricingPage from "../pages/PricingPage";
import BillingPage from "../pages/BillingPage";
import ProfileSettingsPage from "../pages/ProfileSettingsPage";
import InspirationGalleryPage from "../pages/InspirationGalleryPage";
import HelpCenterPage from "../pages/HelpCenterPage";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Root redirects to the demo entry point for Part 4 for now */}
      <Route path="/" element={<Navigate to="/results/demo-project" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Independent Part 4 Routes */}
      <Route path="/results/:projectId" element={<Layout currentPage="results" setPage={() => {}}><DesignResultsPage setPage={() => {}} /></Layout>} />
      <Route path="/compare" element={<Layout currentPage="compare" setPage={() => {}}><DesignComparisonPage setPage={() => {}} /></Layout>} />
      <Route path="/design/:designId" element={<Layout currentPage="design" setPage={() => {}}><DesignDetailsPage setPage={() => {}} /></Layout>} />

      {/* Main app protected routes */}
      <Route
        path="/*"
        element={
          <Layout currentPage="dashboard" setPage={() => {}}>
            <Routes>
              <Route path="/dashboard" element={<DashboardPage setPage={() => {}} />} />
              <Route path="/projects" element={<ProjectsPage setPage={() => {}} />} />
              <Route path="/projects/new" element={<NewProjectPage setPage={() => {}} />} />
              <Route path="/projects/:id/upload" element={<UploadPage />} />
              <Route path="/projects/:id/processing" element={<ProcessingPage setPage={() => {}} />} />
              <Route path="/projects/:id/export" element={<ExportPage />} />
              <Route path="/settings" element={<ProfileSettingsPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
};

export default AppRouter;
