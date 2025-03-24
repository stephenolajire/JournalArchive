import { useState } from "react";
import Navigation from "./components/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import LandingPage from "./pages/LandingPage";
import Login from "./user/Login";
import Signup from "./user/SignUp";
import Dashboard from "./pages/Dashboard";
import SavedJournals from "./pages/SavedJournal";
import SubmitJournal from "./pages/SubmitJournal";
import { GlobalProvider } from "./constant/GlobalContext";
import ProtectedRoute from "./constant/ProtectedRoute";

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="browse" element={<Dashboard />} />
            <Route
              path="saved"
              element={
                <ProtectedRoute>
                  <SavedJournals />
                </ProtectedRoute>
              }
            />
            <Route
              path="submit"
              element={
                <ProtectedRoute>
                  <SubmitJournal />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
