import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import FooterPage from "./FooterPage";
import HeaderPage from "./HeaderPage";
import ForgotPasswordFlow from "./ForgotPasswordFlow";
import "../App.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [guestLoginError, setGuestLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const loginUser = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError("");
    }

    setLoginError("");
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token } = res.data;
      if (!token) {
        setLoginError("Login failed: No token received");
        return;
      }
      localStorage.setItem("token", token);
      navigate("/welcome");
    } catch (error) {
      setLoginError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const guestLogin = async () => {
    setGuestLoginError("");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/guest`);
      const { token } = res.data;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/welcome");
      } else {
        setGuestLoginError("Guest login failed: No token received.");
      }
    } catch (error) {
      setGuestLoginError("Server error during guest login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HeaderPage />
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p style={{ color: "red", marginTop: "5px" }}>{emailError}</p>}
        <br />

        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingRight: "40px" }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "gray",
              fontSize: "14px"
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        <br />

        <button onClick={loginUser} disabled={!email || !password || loading}>
          <i className="bi bi-lock-fill"></i> {loading ? "Logging in..." : "Login"}
        </button>
        {loginError && (
          <p style={{ color: "red", marginTop: "8px" }}>{loginError}</p>
        )}

        <button
          className="btn-google"
          onClick={() =>
            (window.location.href = `${BASE_URL}/api/auth/google`)
          }
          disabled={loading}
        >
          <i className="bi bi-google"></i> SignIn with Google
        </button>

        <button onClick={guestLogin} disabled={loading}>
          <i className="bi bi-person-circle"></i> Continue as Guest
        </button>
        {guestLoginError && (
          <p style={{ color: "red", marginTop: "8px" }}>{guestLoginError}</p>
        )}
        <br />

        <p
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => setShowForgot(true)}
        >
          Forgot Password?
        </p>

        <p>
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")}>Sign Up</button>
        </p>
      </motion.div>

      {showForgot && <ForgotPasswordFlow onClose={() => setShowForgot(false)} />}
      <FooterPage />
    </div>
  );
}

export default LoginPage;

