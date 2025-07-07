// src/pages/QuizGame.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "../quiz.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const QuizGame = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showResults, setShowResults] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  const starsRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!token) navigate("/login");
    else fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length === 0 || showResults) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleNextQuestion();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentQuestionIndex, questions, showResults]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const promises = Array.from({ length: 15 }, () =>
        axios.get(`${BASE_URL}/quiz/question`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      const responses = await Promise.all(promises);
      setQuestions(responses.map((res) => res.data.question));
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return;

    const correct = questions[currentQuestionIndex]?.correct;
    const isCorrect = answer === correct;

    setSelectedAnswer(answer);
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      starsRef.current += 2;
    }

    clearInterval(timerRef.current);

    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);

    if (currentQuestionIndex + 1 >= questions.length) {
      setShowResults(true);
      submitScore();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(30);
    }
  };

  const submitScore = async () => {
    try {
      await axios.post(
        `${BASE_URL}/quiz/completed`,
        { starsEarned: starsRef.current },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to submit score:", error);
    }
  };

  useEffect(() => {
    let countdownTimer;
    if (countdown !== null && countdown > 0) {
      countdownTimer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      window.location.reload();
    }
    return () => clearTimeout(countdownTimer);
  }, [countdown]);

  // 🟡 Show dot loader while questions load
  if (loading) {
    return (
      <div className="quiz-loading-screen">
        <h2>🧠 Preparing Your Quiz...</h2>
        <div className="dot-loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="quiz-page">
        <div className="quiz-question-card">
          <h1 className="quiz-complete"> Quiz Completed!</h1>
          <p className="quiz-complete">Your Score: {starsRef.current} ⭐</p>

          {countdown !== null ? (
            <div className="quiz-complete" style={{ marginTop: "1.5rem" }}>
              Restarting in {countdown}...
            </div>
          ) : (
            <div className="result-actions">
              <button onClick={() => setCountdown(3)}>Play Again</button>
              <button onClick={() => navigate("/dashboard", { state: { refresh: true } })}>
                Exit
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const current = questions[currentQuestionIndex];

  return (
    <div className="quiz-page">
      <motion.div
        key={currentQuestionIndex}
        className="quiz-question-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="timer">Time Left: {timeLeft}s</div>
        <h2>Q{currentQuestionIndex + 1}: {current?.question || "Loading..."}</h2>

        <div className="quiz-answer-btns">
          {current?.answers?.map((ans, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(ans)}
              className={`quiz-answer-btn ${
                selectedAnswer
                  ? ans === current.correct
                    ? "option-correct"
                    : ans === selectedAnswer
                    ? "option-wrong"
                    : ""
                  : ""
              }`}
              disabled={selectedAnswer !== null}
            >
              {ans}
            </button>
          ))}
        </div>

        <button
          className="exit-btn"
          onClick={() => navigate("/dashboard", { state: { refresh: true } })}
        >
          Exit Game
        </button>
      </motion.div>
    </div>
  );
};

export default QuizGame;

