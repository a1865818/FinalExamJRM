import GameProgress from "@/components/GameProgress";
import { gameSessionApi } from "@/services/api";
import {
  GameQuestion,
  GameSession,
  GameSessionStats,
  SubmitAnswerRequest,
} from "@/types/game";
import { ArrowRight, Check, Clock, FileText, RefreshCw, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

interface GamePlayProps {
  session: GameSession;
  onSubmitAnswer: (request: SubmitAnswerRequest) => void;
  onGameEnd: (reason?: string) => void;
  currentQuestion: GameQuestion | null;
  score: {
    correct: number;
    incorrect: number;
  };
  lastAnswerResult?: {
    isCorrect: boolean;
    correctAnswer: string;
  } | null;
  isLoadingQuestion?: boolean;
}

const GamePlay: React.FC<GamePlayProps> = ({
  session,
  onSubmitAnswer,
  onGameEnd,
  currentQuestion,
  score,
  lastAnswerResult,
  isLoadingQuestion = false,
}) => {
  const [answer, setAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(() => {
    console.log("Session duration:", session.duration, "seconds");
    return session.duration;
  });
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [sessionStats, setSessionStats] = useState<GameSessionStats | null>(
    null
  );
  const [gameEndMessage, setGameEndMessage] = useState<string | null>(null);

  // Start the game timer only when we have the first question
  useEffect(() => {
    if (currentQuestion && !gameStarted) {
      setGameStarted(true);
      console.log("Game started with first question:", currentQuestion.number);
    }
  }, [currentQuestion, gameStarted]);

  // Update onGameEnd to set game end message
  const originalOnGameEnd = onGameEnd;
  useEffect(() => {
    onGameEnd = (reason?: string) => {
      if (reason) {
        setGameEndMessage(getGameEndMessage(reason));
      }
      originalOnGameEnd(reason);
    };
  }, [originalOnGameEnd]);

  // Load session stats
  useEffect(() => {
    if (gameStarted) {
      loadSessionStats();
    }
  }, [session.sessionId, score, gameStarted]);

  // Timer effect - only start when game has actually started
  useEffect(() => {
    if (!gameStarted) return;

    console.log("Starting timer with", timeRemaining, "seconds remaining");

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        console.log("Time remaining:", newTime);

        if (newTime <= 0) {
          console.log("Time's up! Ending game...");
          onGameEnd("time_expired");
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      console.log("Clearing timer");
      clearInterval(timer);
    };
  }, [gameStarted, onGameEnd]);

  // Show answer result briefly
  useEffect(() => {
    if (lastAnswerResult) {
      setShowResult(true);
      const timeout = setTimeout(() => {
        setShowResult(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [lastAnswerResult]);

  const loadSessionStats = async () => {
    try {
      const stats = await gameSessionApi.getStats(session.sessionId);
      setSessionStats(stats);
    } catch (error) {
      console.error("Failed to load session stats:", error);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentQuestion || !answer.trim()) return;

      console.log(
        "Submitting answer:",
        answer,
        "for question:",
        currentQuestion.number
      );

      try {
        await onSubmitAnswer({
          sessionId: session.sessionId,
          number: currentQuestion.number,
          answer: answer.trim(),
        });
        setAnswer("");
      } catch {
        console.error("Failed to submit answer");
      }
    },
    [currentQuestion, answer, session.sessionId, onSubmitAnswer, onGameEnd]
  );

  const getGameEndMessage = (reason: string): string => {
    switch (reason) {
      case "all_numbers_used":
        return "🎉 Congratulations! You've used all numbers in the range!";
      case "time_expired":
        return "⏰ Time's up! Great effort!";
      case "duplicate_number":
        return "🔄 This number was already used. Game ending...";
      default:
        return "🏁 Game completed!";
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerStyles = (): string => {
    if (timeRemaining <= 10) return "timer-danger text-3xl";
    if (timeRemaining <= 30) return "timer-warning text-2xl";
    return "timer-normal text-2xl";
  };

  // Show game end message if applicable
  if (gameEndMessage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="card-elevated max-w-lg mx-auto text-center space-y-6 animate-scale-in">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">
              Game Complete!
            </h2>
            <p className="text-lg text-slate-600">{gameEndMessage}</p>
            <div className="text-sm text-slate-500">
              Redirecting to results...
            </div>
          </div>
          <div className="flex justify-center">
            <div className="loading-spinner w-8 h-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Game Area */}
          <div className="xl:col-span-3 space-y-8">
            {/* Game Header */}
            <div className="card-elevated">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-slate-800">
                    {session.gameName}
                  </h1>
                  <p className="text-slate-600">
                    Player:{" "}
                    <span className="font-medium">{session.playerName}</span>
                  </p>
                </div>

                {/* Timer */}
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-sm text-slate-600 mb-1">
                      Time Remaining
                    </div>
                    <div className={`font-black ${getTimerStyles()}`}>
                      {formatTime(timeRemaining)}
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-green-500 animate-pulse"></div>
                </div>
              </div>

              {/* Score Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="score-card">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {score.correct}
                    </div>
                    <div className="text-sm text-slate-600">Correct</div>
                  </div>
                </div>
                <div className="score-card">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {score.incorrect}
                    </div>
                    <div className="text-sm text-slate-600">Incorrect</div>
                  </div>
                </div>
                <div className="score-card">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {score.correct + score.incorrect}
                    </div>
                    <div className="text-sm text-slate-600">Total</div>
                  </div>
                </div>
                <div className="score-card">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {score.correct + score.incorrect > 0
                        ? Math.round(
                            (score.correct /
                              (score.correct + score.incorrect)) *
                              100
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-slate-600">Accuracy</div>
                  </div>
                </div>
              </div>

              {/* Game Status */}
              <div className="mt-6 text-center">
                {!gameStarted ? (
                  <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-xl">
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Waiting for first question...
                  </div>
                ) : (
                  <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    Game in progress
                  </div>
                )}
              </div>
            </div>

            {/* Game Rules */}
            <div className="card">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-blue-600" />
                Game Rules
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {session.rules.map((rule, index) => (
                  <div key={index} className="rule-chip text-center">
                    <span className="font-semibold text-slate-800">
                      {rule.divisor}
                    </span>
                    <span className="mx-2 text-slate-400">→</span>
                    <span className="font-medium text-blue-600">
                      &ldquo;{rule.replacement}&rdquo;
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Answer Result Display */}
            {showResult && lastAnswerResult && (
              <div className="animate-scale-in">
                <div
                  className={`text-center space-y-3 ${
                    lastAnswerResult.isCorrect
                      ? "feedback-correct"
                      : "feedback-incorrect"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        lastAnswerResult.isCorrect
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                    >
                      {lastAnswerResult.isCorrect ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <X className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-xl font-bold">
                        {lastAnswerResult.isCorrect ? "Correct!" : "Incorrect"}
                      </div>
                      {!lastAnswerResult.isCorrect && (
                        <div className="text-sm mt-1">
                          Correct answer:{" "}
                          <span className="font-semibold">
                            {lastAnswerResult.correctAnswer}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Current Question */}
            <div className="card-elevated text-center space-y-8">
              {isLoadingQuestion ? (
                <div className="py-20 space-y-6">
                  <div className="loading-spinner w-16 h-16 mx-auto"></div>
                  <p className="text-lg text-slate-600">
                    Loading next question...
                  </p>
                </div>
              ) : currentQuestion ? (
                <>
                  {/* Question Number Display */}
                  <div className="space-y-6">
                    <div className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      What should this number be?
                    </div>
                    <div className="game-number animate-float">
                      {currentQuestion.number}
                    </div>
                  </div>

                  {/* Answer Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 max-w-lg mx-auto"
                  >
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="game-answer-input"
                        placeholder="Enter your answer"
                        autoFocus
                        disabled={timeRemaining <= 0}
                        autoComplete="off"
                      />

                      {/* Input Hint */}
                      <p className="text-sm text-slate-500">
                        Type the number or the replacement word(s)
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={!answer.trim() || timeRemaining <= 0}
                      className="btn-primary btn-lg w-full md:w-auto px-12 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {timeRemaining <= 0 ? "Time's Up!" : "Submit Answer"}
                      {answer.trim() && timeRemaining > 0 && (
                        <ArrowRight className="w-5 h-5 ml-2" />
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-20 space-y-6">
                  <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center animate-pulse">
                    <Clock className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-lg text-slate-600">
                    {gameStarted
                      ? "Preparing next question..."
                      : "Setting up your game..."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <GameProgress stats={sessionStats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
