// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/Homepage";
import LoginPage from "./components/Loginpage";
import RegisterPage from "./components/Registerpage";
import Dashboard from "./components/Dashboard";
//import ProtectedRoute from "./components/ProtectedRoute"; // new import
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import OAuthRedirect from "./components/OAuthRedirect";
import Welcome from "./components/Welcome";
import LeaderboardPage from "./components/LeaderboardPage";
import QuizGame from "./components/quiz"; // adjust path if needed


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
         <Route path="/oauth-redirect" element={<OAuthRedirect />} />
         <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
  path="/quiz"
  element={
    <PrivateRoute>
      <QuizGame />
    </PrivateRoute>
  }
/>
    

            <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    }
  /> 
  
  <Route path="/leaderboard" element={<LeaderboardPage />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;

