import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FooterPage from "./FooterPage";
import "../Homepage.css";

function HomePage() {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);

  const handleAboutClick = () => {
    setShowAbout(true);
  };

  const handleClosePopup = () => {
    setShowAbout(false);
  };

  return (
    <>
      {/* Gaming Neon Navbar */}
      <nav className="gaming-navbar">
        <div className="navbar-content">
          <span className="navbar-brand">QUIZZY.IN</span>

          <div className="navbar-links">
            <a href="/" className="active">Home</a>
            <a href="#" onClick={handleAboutClick}>About</a>
          </div>

          <button className="neon-btn" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <motion.div
        className="homepage-container"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="homepage-title">Welcome to Quizzy</h1>
        <p className="homepage-lead">
          "Warning: Taking this quiz may cause sudden bursts of confidence, unexpected fun, and a mysterious craving for one more question!"
        </p>
        <button
          className="neon-btn neon-btn-lg"
          onClick={() => navigate("/dashboard")}
        >
          Start Now
        </button>
      </motion.div>

      {/* About Popup Modal */}
      {showAbout && (
        <div className="about-popup">
          <div className="about-content">
            <button className="close-btn" onClick={handleClosePopup}>✖</button>
            <h2>About Quizzy</h2>
            <p><strong>Quizzy</strong> is a fun and interactive quiz app built with MERN stack, designed to test your knowledge and challenge your friends!</p>
            <h3>Any Feedback:</h3>
            
            <p><a href="mailto:shivashankarrajeurs@gmail.com" class="gmail-link">Contact Me</a></p>
           
          </div>
        </div>
      )}

      {/* Footer */}
      <FooterPage />
    </>
  );
}

export default HomePage;
