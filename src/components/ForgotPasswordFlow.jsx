import React, { useState, useEffect } from "react";
import axios from "axios";
import "../forgetpassword.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function ForgotPasswordFlow({ onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // info, success, error
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === 2) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const sendOtp = async () => {
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/send-otp`, {
        email,
        type: "resetPassword"
      });
      if (res.data.success) {
        setStep(2);
        setMessage("OTP sent to your email");
        setMessageType("success");
      } else {
        setMessage(res.data.message || "Failed to send OTP");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        email,
        otp,
        type: "resetPassword"
      });
      if (res.data.success) {
        setStep(3);
        setMessage("OTP verified successfully");
        setMessageType("success");
      } else {
        setMessage(res.data.message || "Invalid or expired OTP");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid or expired OTP");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setMessage("");

    if (password !== confirm) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    const passwordValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
    if (!passwordValid) {
      setMessage("Password must be at least 6 characters and include both letters and numbers");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/reset-password`, {
        email,
        password
      });

      if (res.data.success) {
        setMessage("Password reset successful");
        setMessageType("success");
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setMessage(res.data.message || "Failed to reset password");
        setMessageType("error");
      }
    } catch {
      setMessage("Error resetting password");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = () => {
    if (!message) return null;
    return (
      <div
        style={{
          marginBottom: "10px",
          color: messageType === "error" ? "red" : messageType === "success" ? "green" : "black",
        }}
      >
        {message}
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">Forgot Password</h2>
        {renderMessage()}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="modal-input"
            />
            <button onClick={sendOtp} className="modal-button" disabled={loading || !email}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="timer">OTP Expires in: {minutes}:{seconds}</div>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="modal-input"
            />
            <button onClick={verifyOtp} className="modal-button" disabled={loading || !otp}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modal-input"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="modal-input"
            />
            <button onClick={resetPassword} className="modal-button" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <button onClick={onClose} className="modal-close">Cancel</button>
      </div>
    </div>
  );
}

