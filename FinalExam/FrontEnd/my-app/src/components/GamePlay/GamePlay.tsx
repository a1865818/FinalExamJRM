// import { GameQuestion, GameSession, SubmitAnswerRequest } from "@/types/game";
// import React, { useCallback, useEffect, useState } from "react";

// interface GamePlayProps {
//   session: GameSession;
//   onSubmitAnswer: (request: SubmitAnswerRequest) => void;
//   onGameEnd: () => void;
//   currentQuestion: GameQuestion | null;
//   score: {
//     correct: number;
//     incorrect: number;
//   };
//   lastAnswerResult?: {
//     isCorrect: boolean;
//     correctAnswer: string;
//   } | null;
//   isLoadingQuestion?: boolean;
// }

// const GamePlay: React.FC<GamePlayProps> = ({
//   session,
//   onSubmitAnswer,
//   onGameEnd,
//   currentQuestion,
//   score,
//   lastAnswerResult,
//   isLoadingQuestion = false,
// }) => {
//   const [answer, setAnswer] = useState("");
//   const [timeRemaining, setTimeRemaining] = useState(() => {
//     // Duration from backend is already in seconds
//     console.log("Session duration:", session.duration, "seconds");
//     return session.duration;
//   });
//   const [showResult, setShowResult] = useState(false);
//   const [gameStarted, setGameStarted] = useState(false);

//   // Start the game timer only when we have the first question
//   useEffect(() => {
//     if (currentQuestion && !gameStarted) {
//       setGameStarted(true);
//       console.log("Game started with first question:", currentQuestion.number);
//     }
//   }, [currentQuestion, gameStarted]);

//   // Timer effect - only start when game has actually started
//   useEffect(() => {
//     if (!gameStarted) return;

//     console.log("Starting timer with", timeRemaining, "seconds remaining");

//     const timer = setInterval(() => {
//       setTimeRemaining((prev) => {
//         const newTime = prev - 1;
//         console.log("Time remaining:", newTime);

//         if (newTime <= 0) {
//           console.log("Time's up! Ending game...");
//           onGameEnd();
//           return 0;
//         }
//         return newTime;
//       });
//     }, 1000);

//     return () => {
//       console.log("Clearing timer");
//       clearInterval(timer);
//     };
//   }, [gameStarted, onGameEnd]);

//   // Show answer result briefly
//   useEffect(() => {
//     if (lastAnswerResult) {
//       setShowResult(true);
//       const timeout = setTimeout(() => {
//         setShowResult(false);
//       }, 1500);
//       return () => clearTimeout(timeout);
//     }
//   }, [lastAnswerResult]);

//   const handleSubmit = useCallback(
//     (e: React.FormEvent) => {
//       e.preventDefault();
//       if (!currentQuestion || !answer.trim()) return;

//       console.log(
//         "Submitting answer:",
//         answer,
//         "for question:",
//         currentQuestion.number
//       );

//       onSubmitAnswer({
//         sessionId: session.sessionId,
//         number: currentQuestion.number,
//         answer: answer.trim(),
//       });

//       setAnswer("");
//     },
//     [currentQuestion, answer, session.sessionId, onSubmitAnswer]
//   );

//   const formatTime = (seconds: number): string => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const getTimerColor = (): string => {
//     if (timeRemaining <= 10) return "text-red-600";
//     if (timeRemaining <= 30) return "text-yellow-600";
//     return "text-green-600";
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Game Header */}
//       <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-bold text-gray-800">
//             {session.gameName}
//           </h1>
//           <div className={`text-2xl font-bold ${getTimerColor()}`}>
//             {formatTime(timeRemaining)}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//           <div className="bg-gray-50 rounded-lg p-3">
//             <div className="text-sm text-gray-600">Player</div>
//             <div className="text-lg font-semibold text-gray-800">
//               {session.playerName}
//             </div>
//           </div>
//           <div className="bg-success-50 rounded-lg p-3">
//             <div className="text-sm text-gray-600">Correct</div>
//             <div className="text-lg font-semibold text-success-600">
//               {score.correct}
//             </div>
//           </div>
//           <div className="bg-error-50 rounded-lg p-3">
//             <div className="text-sm text-gray-600">Incorrect</div>
//             <div className="text-lg font-semibold text-error-600">
//               {score.incorrect}
//             </div>
//           </div>
//         </div>

//         {/* Game Status */}
//         <div className="mt-4 text-center">
//           {!gameStarted && (
//             <div className="text-yellow-600 font-semibold">
//               Waiting for first question to start timer...
//             </div>
//           )}
//           {gameStarted && (
//             <div className="text-green-600 font-semibold">Game in progress</div>
//           )}
//         </div>
//       </div>

//       {/* Game Rules */}
//       <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//         <h3 className="text-lg font-semibold text-gray-800 mb-3">Rules:</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//           {session.rules.map((rule, index) => (
//             <div key={index} className="bg-gray-50 rounded-lg p-2 text-sm">
//               <span className="font-semibold">{rule.divisor}</span> →{" "}
//               <span className="text-primary-600">
//                 &ldquo;{rule.replacement}&rdquo;
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Answer Result Display */}
//       {showResult && lastAnswerResult && (
//         <div
//           className={`mb-6 p-4 rounded-lg text-center ${
//             lastAnswerResult.isCorrect
//               ? "bg-success-50 text-success-800"
//               : "bg-error-50 text-error-800"
//           }`}
//         >
//           <div className="text-lg font-semibold">
//             {lastAnswerResult.isCorrect ? "✅ Correct!" : "❌ Incorrect"}
//           </div>
//           {!lastAnswerResult.isCorrect && (
//             <div className="text-sm">
//               Correct answer: <strong>{lastAnswerResult.correctAnswer}</strong>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Current Question */}
//       <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//         {isLoadingQuestion ? (
//           <div className="text-gray-500">Loading next question...</div>
//         ) : currentQuestion ? (
//           <>
//             <div className="text-6xl font-bold text-primary-600 mb-8">
//               {currentQuestion.number}
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <input
//                 type="text"
//                 value={answer}
//                 onChange={(e) => setAnswer(e.target.value)}
//                 className="w-full max-w-md mx-auto px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                 placeholder="Enter your answer"
//                 autoFocus
//                 disabled={timeRemaining <= 0}
//               />

//               <button
//                 type="submit"
//                 disabled={!answer.trim() || timeRemaining <= 0}
//                 className="px-8 py-3 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 Submit Answer
//               </button>
//             </form>
//           </>
//         ) : (
//           <div className="text-gray-500">
//             {gameStarted ? "Waiting for next question..." : "Preparing game..."}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GamePlay;

import GameProgress from "@/components/GameProgress";
import { gameSessionApi } from "@/services/api";
import {
  GameQuestion,
  GameSession,
  GameSessionStats,
  SubmitAnswerRequest,
} from "@/types/game";
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

  const getTimerColor = (): string => {
    if (timeRemaining <= 10) return "text-red-600";
    if (timeRemaining <= 30) return "text-yellow-600";
    return "text-green-600";
  };

  // Show game end message if applicable
  if (gameEndMessage) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-4xl mb-4">{gameEndMessage}</div>
          <div className="text-gray-600">Redirecting to results...</div>
          <div className="animate-pulse mt-4">
            <div className="inline-block w-6 h-6 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Game Area */}
        <div className="lg:col-span-3">
          {/* Game Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                {session.gameName}
              </h1>
              <div className={`text-2xl font-bold ${getTimerColor()}`}>
                {formatTime(timeRemaining)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Player</div>
                <div className="text-lg font-semibold text-gray-800">
                  {session.playerName}
                </div>
              </div>
              <div className="bg-success-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Correct</div>
                <div className="text-lg font-semibold text-success-600">
                  {score.correct}
                </div>
              </div>
              <div className="bg-error-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Incorrect</div>
                <div className="text-lg font-semibold text-error-600">
                  {score.incorrect}
                </div>
              </div>
            </div>

            {/* Game Status */}
            <div className="mt-4 text-center">
              {!gameStarted && (
                <div className="text-yellow-600 font-semibold">
                  Waiting for first question to start timer...
                </div>
              )}
              {gameStarted && (
                <div className="text-green-600 font-semibold">
                  Game in progress
                </div>
              )}
            </div>
          </div>

          {/* Game Rules */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Rules:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {session.rules.map((rule, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-2 text-sm">
                  <span className="font-semibold">{rule.divisor}</span> →{" "}
                  <span className="text-primary-600">
                    &ldquo;{rule.replacement}&rdquo;
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Answer Result Display */}
          {showResult && lastAnswerResult && (
            <div
              className={`mb-6 p-4 rounded-lg text-center ${
                lastAnswerResult.isCorrect
                  ? "bg-success-50 text-success-800"
                  : "bg-error-50 text-error-800"
              }`}
            >
              <div className="text-lg font-semibold">
                {lastAnswerResult.isCorrect ? "✅ Correct!" : "❌ Incorrect"}
              </div>
              {!lastAnswerResult.isCorrect && (
                <div className="text-sm">
                  Correct answer:{" "}
                  <strong>{lastAnswerResult.correctAnswer}</strong>
                </div>
              )}
            </div>
          )}

          {/* Current Question */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {isLoadingQuestion ? (
              <div className="text-gray-500">Loading next question...</div>
            ) : currentQuestion ? (
              <>
                <div className="text-6xl font-bold text-primary-600 mb-8">
                  {currentQuestion.number}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full max-w-md mx-auto px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your answer"
                    autoFocus
                    disabled={timeRemaining <= 0}
                  />

                  <button
                    type="submit"
                    disabled={!answer.trim() || timeRemaining <= 0}
                    className="px-8 py-3 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Submit Answer
                  </button>
                </form>
              </>
            ) : (
              <div className="text-gray-500">
                {gameStarted
                  ? "Waiting for next question..."
                  : "Preparing game..."}
              </div>
            )}
          </div>
        </div>

        {/* Progress Sidebar */}
        <div className="lg:col-span-1">
          <GameProgress stats={sessionStats} className="sticky top-4" />
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
