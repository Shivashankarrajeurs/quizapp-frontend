import "../Dashboard.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import {
  FaStar,
  FaSignOutAlt,
  FaUserCircle,
  FaCrown,
} from "react-icons/fa";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [quizStreak, setQuizStreak] = useState(0);
  const [startCountdown, setStartCountdown] = useState(0);

  const tips = [
  "📚 Read the question carefully — don’t rush!",
  "🧠 Eliminate clearly wrong answers to improve your odds.",
  "⏰ Manage your time — don’t spend too long on one question.",
  "🔍 Look for keywords in the question that hint at the correct answer.",
  "🤔 Trust your gut — your first instinct is often right.",
  "📴 Avoid distractions — stay focused while playing.",
  "💡 Review your mistakes to improve next time.",
  "🌟 Don’t guess randomly — think logically!",
  "🔥 Keep your streak alive by staying consistent.",
  "🎮 Treat each quiz like a game — have fun and learn!"
  ];
  const [tipIndex, setTipIndex] = useState(0);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    let decoded;
    try {
      decoded = jwtDecode(token);
      setUser(decoded);
      const res = await axios.get(`${BASE_URL}/api/profile/${decoded.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setQuizStreak(res.data.quizStreak);
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchProfile();

    // ✅ Refresh profile after quiz completion
    if (localStorage.getItem("quizCompleted")) {
      fetchProfile();
      localStorage.removeItem("quizCompleted");
    }
  }, []);

  // Refresh profile if user switches back to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchProfile();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Tip rotator
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showLeaderboard) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [showLeaderboard]);

  const fetchLeaderboard = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }
    axios
      .get(`${BASE_URL}/api/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLeaderboardData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Leaderboard fetch error:", err.response?.data || err.message);
        if (err.response?.data?.message === "Invalid token") {
          alert("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
        setLeaderboardData([]);
      });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const openLeaderboard = () => {
    fetchLeaderboard();
    setShowLeaderboard(true);
  };

  const closeLeaderboard = () => {
    setShowLeaderboard(false);
  };

  const profileImage = profile?.imageUrl ? (
    <img
      src={`${BASE_URL}${profile.imageUrl}`}
      alt="Profile"
      className="profile-image"
      draggable={false}
    />
  ) : (
    <FaUserCircle className="profile-placeholder" />
  );

  if (!profile) {
  return (
    <div className="dashboard-loading-screen">
      <h2>⚡ Loading Dashboard...</h2>
      <div className="dot-loader">
        <span></span><span></span><span></span>
      </div>
    </div>
  );
}


  return (
    <div className="dashboard">
      <header className="header">
        <div className="stars gold-glow">
          <FaStar className="star-icon" />
          <span>{profile?.stars ?? 0}</span>
        </div>

        <div className="profile-container">
          <button
            className="profile-button"
            onClick={() => setDropdownOpen((open) => !open)}
            aria-label="User Profile"
          >
            {profileImage}
            <span className="profile-name">
              {profile?.name?.trim() || "Player"}
            </span>
          </button>

          {dropdownOpen && (
            <div className="dropdown" onClick={(e) => e.stopPropagation()}>
              <label htmlFor="profileName">Set Name</label>
              <input
                type="text"
                id="profileName"
                value={profile?.name ?? ""}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Your Name"
              />

              <label htmlFor="profileImage">Upload Profile Image</label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={async (e) => {
                  if (!e.target.files?.length) return;
                  const file = e.target.files[0];
                  const formData = new FormData();
                  formData.append("image", file);
                  try {
                    const token = localStorage.getItem("token");
                    const res = await axios.post(
                      `${process.env.BASE_URL}/api/uploadImage`,
                      formData,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );
                    setProfile((prev) => ({
                      ...prev,
                      imageUrl: res.data.imageUrl,
                    }));
                  } catch {
                    alert("Failed to upload image");
                  }
                }}
              />

              <div className="dropdown-actions">
                <button
                  className="btn-save"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      const nameToSave = profile?.name?.trim()
                        ? profile.name.trim()
                        : "Player";
                      await axios.put(
                        `${BASE_URL}/api/profile`,
                        {
                          name: nameToSave,
                          imageUrl: profile?.imageUrl || "",
                        },
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );
                      setProfile((prev) => ({
                        ...prev,
                        name: nameToSave,
                      }));
                      setDropdownOpen(false);
                    } catch {
                      alert("Failed to save profile");
                    }
                  }}
                >
                  Save
                </button>

                <button className="btn-logout" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        <div>
          <div className="btn-group">
            {startCountdown > 0 ? (
              <button className="btn-start countdown-btn" disabled>
                Starting in {startCountdown}...
              </button>
            ) : (
              <button
                className="btn-start"
                onClick={() => {
                  setStartCountdown(3);
                  const interval = setInterval(() => {
                    setStartCountdown((prev) => {
                      if (prev <= 1) {
                        clearInterval(interval);
                        navigate("/quiz");
                        return 0;
                      }
                      return prev - 1;
                    });
                  }, 1000);
                }}
              >
                <FaCrown className="play-icon" /> Start Quiz
              </button>
            )}

            <button className="btn-start" onClick={() => navigate("/leaderboard")}>
              Leaderboard
            </button>
          </div>

          <div className="dashboard-widgets">
            <div className="stats-card">
              <h3>🔥 Quiz Streak</h3>
              <p>
                {quizStreak > 0
                  ? `You're on a ${quizStreak}-day streak! Keep it up!`
                  : "No streak yet. Start quizzing!"}
              </p>
            </div>

            <div className="stats-card tip-card">
              <h3>💡 Tip</h3>
              <p>{tips[tipIndex]}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="modal-backdrop" onClick={closeLeaderboard}>
          <div
            className="modal leaderboard-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="leaderboardTitle">Leaderboard</h2>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Stars</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.length === 0 ? (
                  <tr>
                    <td colSpan={2}>No players found</td>
                  </tr>
                ) : (
                  leaderboardData.map(({ _id, name, stars }) => (
                    <tr key={_id}>
                      <td>{name?.trim() || "Player"}</td>
                      <td>{stars ?? 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeLeaderboard}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
