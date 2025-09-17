import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import EditingQueue from "./pages/EditingQueue";
import EditorialSuite from "./pages/EditorialSuite";
import Projects from "./pages/Projects";
import Editors from "./pages/Editors";
import Analytics from "./pages/Analytics";
import AdminSettings from "./pages/AdminSettings";
import AssignProject from "./pages/AssignProject";
import CoverGenerator from "./pages/CoverGenerator";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          } />
          <Route path="/editing-queue" element={
            <AdminLayout>
              <EditingQueue />
            </AdminLayout>
          } />
          <Route path="/editorial-suite" element={
            <AdminLayout>
              <EditorialSuite />
            </AdminLayout>
          } />
          <Route path="/projects" element={
            <AdminLayout>
              <Projects />
            </AdminLayout>
          } />
          <Route path="/editors" element={
            <AdminLayout>
              <Editors />
            </AdminLayout>
          } />
          <Route path="/analytics" element={
            <AdminLayout>
              <Analytics />
            </AdminLayout>
          } />
          <Route path="/settings" element={
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          } />
          <Route path="/assign-project" element={
            <AdminLayout>
              <AssignProject />
            </AdminLayout>
          } />
          <Route path="/cover-generator" element={
            <AdminLayout>
              <CoverGenerator />
            </AdminLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
