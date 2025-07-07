import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "../LeaderboardPage.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true); // ⬅️ Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${BASE_URL}/api/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setLeaderboard(res.data);
        } else {
          setLeaderboard([]);
        }
        setLoading(false); // ⬅️ Done loading
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  return (
    <motion.div
      className="leaderboard-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.5 }}
    >
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <ol className="leaderboard-list">
        {loading ? (
          <div className="leaderboard-loader">
            <h3>Fetching Champions...</h3>
            <div className="dot-loader">
              <span></span><span></span><span></span>
            </div>
          </div>
        ) : leaderboard.length === 0 ? (
          <li className="empty-row">No players found</li>
        ) : (
          leaderboard.map((user, idx) => (
            <motion.li
              key={user._id}
              className="leaderboard-row"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07 }}
            >
              <span className="rank">{idx + 1}.</span>

              <img
                src={
                  user.imageUrl && user.imageUrl.trim() !== ""
                    ? user.imageUrl
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="User"
                className="leaderboard-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                }}
              />

              <span className="player-name">
                {user.name?.trim() || "Player"}{" "}
                {idx === 0 && <span className="crown">👑</span>}
              </span>

              <span className="player-stars">{user.stars ?? 0} ⭐</span>

              {user.quizStreak > 0 && (
                <span className="player-streak">🔥 {user.quizStreak} streak</span>
              )}
            </motion.li>
          ))
        )}
      </ol>
    </motion.div>
  );
}

