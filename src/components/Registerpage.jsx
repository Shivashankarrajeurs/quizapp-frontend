import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FooterPage from "./FooterPage";
import HeaderPage from "./HeaderPage";
import "../App.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setError("");
    setMessage("");

    if (!form.email || !form.password || !form.confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/auth/send-otp`, {
        email: form.email,
        type: "verifyEmail",
      });
      setOtpSent(true);
      setMessage("OTP sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setMessage("");

    if (!otp) {
      setError("Enter OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        email: form.email,
        otp,
        type: "verifyEmail",
      });
      setMessage("Email verified successfully!");
      setIsVerified(true);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async () => {
    setError("");
    setMessage("");

    if (!isVerified) {
      setError("Please verify your email before registering.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setMessage("Registered successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderPage />
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: "400px" }}
      >
        <h2 className="mb-4 text-center">Register</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          disabled={otpSent}
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          disabled={otpSent}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="form-control mb-3"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          disabled={otpSent}
        />

        {!otpSent ? (
          <button className="btn btn-primary w-100 mb-3" onClick={handleSendOtp} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {!isVerified && (
              <button className="btn btn-success w-100 mb-3" onClick={handleVerifyOtp} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            )}
            {isVerified && (
              <button className="btn btn-primary w-100 mb-3" onClick={registerUser} disabled={loading}>
                {loading ? "Registering..." : "Sign Up"}
              </button>
            )}
          </>
        )}

        <p className="text-center">
          Already have an account?{" "}
          <button className="btn btn-link p-0 align-baseline" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </p>
      </motion.div>
      <FooterPage />
    </>
  );
}

export default RegisterPage;







