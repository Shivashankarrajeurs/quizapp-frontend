import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { jwtDecode } from "jwt-decode";

const robotMessages = [
  "Welcome",
  "to",
  "Quizzy",
  "Loading your dashboard..."
];

const Welcome = () => {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [name, setName] = useState("there");
  const [isGuest, setIsGuest] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.isGuest) {
          setIsGuest(true);
          setName("Guest");
        } else {
          setIsGuest(false);
          setName(decoded?.name || "User");
        }
      } catch (error) {
        setName("User");
      }
    }
    // Animate words one after another
    if (currentWord < robotMessages.length - 1) {
      const timer = setTimeout(() => setCurrentWord(currentWord + 1), 900);
      return () => clearTimeout(timer);
    } else {
      // After last message, redirect
      const timer = setTimeout(() => navigate("/dashboard"), 1600);
      return () => clearTimeout(timer);
    }
  }, [currentWord, navigate]);

  return (
    <div className="welcome-bg">
      <Confetti width={width} height={height} numberOfPieces={180} recycle={false} />
      <div className="robot-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
          className="robot-card"
        >
          <div className="robot-face">
            <div className="robot-eyes">
              <span className="eye" />
              <span className="eye" />
            </div>
            <div className="robot-mouth" />
          </div>
          <div className="robot-typewriter">
            {robotMessages.slice(0, currentWord + 1).map((msg, idx) => (
              <span key={idx} className="robot-word">
                {msg}
                {idx === 0 && <span>, {name}!</span>}
                <span className="robot-cursor" />
                <br />
              </span>
            ))}
          </div>
          <div className="robot-subtext">
            {isGuest
              ? "Enjoy your guest preview experience!"
              : "Getting your dashboard ready..."}
          </div>
        </motion.div>
      </div>
      {/* Orbitron font and robot CSS */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
        .welcome-bg {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #181c2f 0%, #23284a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Orbitron', 'Inter', Arial, sans-serif;
        }
        .robot-center {
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .robot-card {
          background: rgba(35, 40, 74, 0.92);
          border-radius: 22px;
          box-shadow: 0 0 32px #00ffe722, 0 2px 24px #6e50ff22;
          padding: 2.5rem 2rem 2rem 2rem;
          text-align: center;
          border: 2.5px solid #6e50ff;
          max-width: 420px;
          width: 95vw;
          position: relative;
        }
        .robot-face {
          margin: 0 auto 1.5rem auto;
          width: 70px;
          height: 70px;
          background: #23284a;
          border-radius: 18px 18px 16px 16px/ 22px 22px 18px 18px;
          border: 3px solid #ffd700;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px #ffd70033;
        }
        .robot-eyes {
          display: flex;
          justify-content: space-between;
          width: 38px;
          margin: 18px 0 0 0;
        }
        .eye {
          display: inline-block;
          width: 10px;
          height: 10px;
          background: #00ffe7;
          border-radius: 50%;
          margin: 0 2px;
          box-shadow: 0 0 8px #00ffe7cc;
        }
        .robot-mouth {
          width: 22px;
          height: 6px;
          background: #ffd700;
          border-radius: 0 0 8px 8px;
          margin: 10px auto 0 auto;
        }
        .robot-typewriter {
          font-size: 1.5rem;
          font-family: 'Orbitron', 'Inter', Arial, sans-serif;
          color: #ffd700;
          min-height: 4.5em;
          margin-bottom: 1.2rem;
          letter-spacing: 1.2px;
          text-shadow: 0 2px 12px #ffd70033;
        }
        .robot-word {
          display: inline-block;
          animation: fadeInWord 0.7s;
        }
        @keyframes fadeInWord {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .robot-cursor {
          display: inline-block;
          width: 1ch;
          height: 1.2em;
          background: none;
          border-right: 2px solid #00ffe7;
          margin-left: 2px;
          animation: blink 1s steps(1) infinite;
          vertical-align: middle;
        }
        @keyframes blink {
          0%, 100% { border-color: #00ffe7; }
          50% { border-color: transparent; }
        }
        .robot-subtext {
          font-size: 1.05rem;
          color: #bdbdbd;
          margin-top: 0.7rem;
          font-family: 'Orbitron', 'Inter', Arial, sans-serif;
          letter-spacing: 0.7px;
        }
        @media (max-width: 500px) {
          .robot-card {
            padding: 1.2rem 0.5rem;
            max-width: 98vw;
          }
          .robot-typewriter {
            font-size: 1.1rem;
            min-height: 3.2em;
          }
        }
        `}
      </style>
    </div>
  );
};

export default Welcome;