// // import { GameQuestion, GameSession, SubmitAnswerRequest } from "@/types/game";
// // import React, { useCallback, useEffect, useState } from "react";

// // interface GamePlayProps {
// //   session: GameSession;
// //   onSubmitAnswer: (request: SubmitAnswerRequest) => void;
// //   onGameEnd: () => void;
// //   currentQuestion: GameQuestion | null;
// //   score: {
// //     correct: number;
// //     incorrect: number;
// //   };
// //   lastAnswerResult?: {
// //     isCorrect: boolean;
// //     correctAnswer: string;
// //   } | null;
// //   isLoadingQuestion?: boolean;
// // }

// // const GamePlay: React.FC<GamePlayProps> = ({
// //   session,
// //   onSubmitAnswer,
// //   onGameEnd,
// //   currentQuestion,
// //   score,
// //   lastAnswerResult,
// //   isLoadingQuestion = false,
// // }) => {
// //   const [answer, setAnswer] = useState("");
// //   const [timeRemaining, setTimeRemaining] = useState(() => {
// //     // Duration from backend is already in seconds
// //     console.log("Session duration:", session.duration, "seconds");
// //     return session.duration;
// //   });
// //   const [showResult, setShowResult] = useState(false);
// //   const [gameStarted, setGameStarted] = useState(false);

// //   // Start the game timer only when we have the first question
// //   useEffect(() => {
// //     if (currentQuestion && !gameStarted) {
// //       setGameStarted(true);
// //       console.log("Game started with first question:", currentQuestion.number);
// //     }
// //   }, [currentQuestion, gameStarted]);

// //   // Timer effect - only start when game has actually started
// //   useEffect(() => {
// //     if (!gameStarted) return;

// //     console.log("Starting timer with", timeRemaining, "seconds remaining");

// //     const timer = setInterval(() => {
// //       setTimeRemaining((prev) => {
// //         const newTime = prev - 1;
// //         console.log("Time remaining:", newTime);

// //         if (newTime <= 0) {
// //           console.log("Time's up! Ending game...");
// //           onGameEnd();
// //           return 0;
// //         }
// //         return newTime;
// //       });
// //     }, 1000);

// //     return () => {
// //       console.log("Clearing timer");
// //       clearInterval(timer);
// //     };
// //   }, [gameStarted, onGameEnd]);

// //   // Show answer result briefly
// //   useEffect(() => {
// //     if (lastAnswerResult) {
// //       setShowResult(true);
// //       const timeout = setTimeout(() => {
// //         setShowResult(false);
// //       }, 1500);
// //       return () => clearTimeout(timeout);
// //     }
// //   }, [lastAnswerResult]);

// //   const handleSubmit = useCallback(
// //     (e: React.FormEvent) => {
// //       e.preventDefault();
// //       if (!currentQuestion || !answer.trim()) return;

// //       console.log(
// //         "Submitting answer:",
// //         answer,
// //         "for question:",
// //         currentQuestion.number
// //       );

// //       onSubmitAnswer({
// //         sessionId: session.sessionId,
// //         number: currentQuestion.number,
// //         answer: answer.trim(),
// //       });

// //       setAnswer("");
// //     },
// //     [currentQuestion, answer, session.sessionId, onSubmitAnswer]
// //   );

// //   const formatTime = (seconds: number): string => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   const getTimerColor = (): string => {
// //     if (timeRemaining <= 10) return "text-red-600";
// //     if (timeRemaining <= 30) return "text-yellow-600";
// //     return "text-green-600";
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto">
// //       {/* Game Header */}
// //       <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
// //         <div className="flex justify-between items-center mb-4">
// //           <h1 className="text-2xl font-bold text-gray-800">
// //             {session.gameName}
// //           </h1>
// //           <div className={`text-2xl font-bold ${getTimerColor()}`}>
// //             {formatTime(timeRemaining)}
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
// //           <div className="bg-gray-50 rounded-lg p-3">
// //             <div className="text-sm text-gray-600">Player</div>
// //             <div className="text-lg font-semibold text-gray-800">
// //               {session.playerName}
// //             </div>
// //           </div>
// //           <div className="bg-success-50 rounded-lg p-3">
// //             <div className="text-sm text-gray-600">Correct</div>
// //             <div className="text-lg font-semibold text-success-600">
// //               {score.correct}
// //             </div>
// //           </div>
// //           <div className="bg-error-50 rounded-lg p-3">
// //             <div className="text-sm text-gray-600">Incorrect</div>
// //             <div className="text-lg font-semibold text-error-600">
// //               {score.incorrect}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Game Status */}
// //         <div className="mt-4 text-center">
// //           {!gameStarted && (
// //             <div className="text-yellow-600 font-semibold">
// //               Waiting for first question to start timer...
// //             </div>
// //           )}
// //           {gameStarted && (
// //             <div className="text-green-600 font-semibold">Game in progress</div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Game Rules */}
// //       <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
// //         <h3 className="text-lg font-semibold text-gray-800 mb-3">Rules:</h3>
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
// //           {session.rules.map((rule, index) => (
// //             <div key={index} className="bg-gray-50 rounded-lg p-2 text-sm">
// //               <span className="font-semibold">{rule.divisor}</span> →{" "}
// //               <span className="text-primary-600">
// //                 &ldquo;{rule.replacement}&rdquo;
// //               </span>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Answer Result Display */}
// //       {showResult && lastAnswerResult && (
// //         <div
// //           className={`mb-6 p-4 rounded-lg text-center ${
// //             lastAnswerResult.isCorrect
// //               ? "bg-success-50 text-success-800"
// //               : "bg-error-50 text-error-800"
// //           }`}
// //         >
// //           <div className="text-lg font-semibold">
// //             {lastAnswerResult.isCorrect ? "✅ Correct!" : "❌ Incorrect"}
// //           </div>
// //           {!lastAnswerResult.isCorrect && (
// //             <div className="text-sm">
// //               Correct answer: <strong>{lastAnswerResult.correctAnswer}</strong>
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {/* Current Question */}
// //       <div className="bg-white rounded-lg shadow-lg p-8 text-center">
// //         {isLoadingQuestion ? (
// //           <div className="text-gray-500">Loading next question...</div>
// //         ) : currentQuestion ? (
// //           <>
// //             <div className="text-6xl font-bold text-primary-600 mb-8">
// //               {currentQuestion.number}
// //             </div>

// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               <input
// //                 type="text"
// //                 value={answer}
// //                 onChange={(e) => setAnswer(e.target.value)}
// //                 className="w-full max-w-md mx-auto px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
// //                 placeholder="Enter your answer"
// //                 autoFocus
// //                 disabled={timeRemaining <= 0}
// //               />

// //               <button
// //                 type="submit"
// //                 disabled={!answer.trim() || timeRemaining <= 0}
// //                 className="px-8 py-3 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// //               >
// //                 Submit Answer
// //               </button>
// //             </form>
// //           </>
// //         ) : (
// //           <div className="text-gray-500">
// //             {gameStarted ? "Waiting for next question..." : "Preparing game..."}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default GamePlay;

// import GameProgress from "@/components/GameProgress";
// import { gameSessionApi } from "@/services/api";
// import {
//   GameQuestion,
//   GameSession,
//   GameSessionStats,
//   SubmitAnswerRequest,
// } from "@/types/game";
// import React, { useCallback, useEffect, useState } from "react";

// interface GamePlayProps {
//   session: GameSession;
//   onSubmitAnswer: (request: SubmitAnswerRequest) => void;
//   onGameEnd: (reason?: string) => void;
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
//     console.log("Session duration:", session.duration, "seconds");
//     return session.duration;
//   });
//   const [showResult, setShowResult] = useState(false);
//   const [gameStarted, setGameStarted] = useState(false);
//   const [sessionStats, setSessionStats] = useState<GameSessionStats | null>(
//     null
//   );
//   const [gameEndMessage, setGameEndMessage] = useState<string | null>(null);

//   // Start the game timer only when we have the first question
//   useEffect(() => {
//     if (currentQuestion && !gameStarted) {
//       setGameStarted(true);
//       console.log("Game started with first question:", currentQuestion.number);
//     }
//   }, [currentQuestion, gameStarted]);

//   // Update onGameEnd to set game end message
//   const originalOnGameEnd = onGameEnd;
//   useEffect(() => {
//     onGameEnd = (reason?: string) => {
//       if (reason) {
//         setGameEndMessage(getGameEndMessage(reason));
//       }
//       originalOnGameEnd(reason);
//     };
//   }, [originalOnGameEnd]);

//   // Load session stats
//   useEffect(() => {
//     if (gameStarted) {
//       loadSessionStats();
//     }
//   }, [session.sessionId, score, gameStarted]);

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
//           onGameEnd("time_expired");
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

//   const loadSessionStats = async () => {
//     try {
//       const stats = await gameSessionApi.getStats(session.sessionId);
//       setSessionStats(stats);
//     } catch (error) {
//       console.error("Failed to load session stats:", error);
//     }
//   };

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();
//       if (!currentQuestion || !answer.trim()) return;

//       console.log(
//         "Submitting answer:",
//         answer,
//         "for question:",
//         currentQuestion.number
//       );

//       try {
//         await onSubmitAnswer({
//           sessionId: session.sessionId,
//           number: currentQuestion.number,
//           answer: answer.trim(),
//         });
//         setAnswer("");
//       } catch {
//         console.error("Failed to submit answer");
//       }
//     },
//     [currentQuestion, answer, session.sessionId, onSubmitAnswer, onGameEnd]
//   );

//   const getGameEndMessage = (reason: string): string => {
//     switch (reason) {
//       case "all_numbers_used":
//         return "🎉 Congratulations! You've used all numbers in the range!";
//       case "time_expired":
//         return "⏰ Time's up! Great effort!";
//       case "duplicate_number":
//         return "🔄 This number was already used. Game ending...";
//       default:
//         return "🏁 Game completed!";
//     }
//   };

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

//   // Show game end message if applicable
//   if (gameEndMessage) {
//     return (
//       <div className="max-w-4xl mx-auto text-center">
//         <div className="bg-white rounded-lg shadow-lg p-8">
//           <div className="text-4xl mb-4">{gameEndMessage}</div>
//           <div className="text-gray-600">Redirecting to results...</div>
//           <div className="animate-pulse mt-4">
//             <div className="inline-block w-6 h-6 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Main Game Area */}
//         <div className="lg:col-span-3">
//           {/* Game Header */}
//           <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h1 className="text-2xl font-bold text-gray-800">
//                 {session.gameName}
//               </h1>
//               <div className={`text-2xl font-bold ${getTimerColor()}`}>
//                 {formatTime(timeRemaining)}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//               <div className="bg-gray-50 rounded-lg p-3">
//                 <div className="text-sm text-gray-600">Player</div>
//                 <div className="text-lg font-semibold text-gray-800">
//                   {session.playerName}
//                 </div>
//               </div>
//               <div className="bg-success-50 rounded-lg p-3">
//                 <div className="text-sm text-gray-600">Correct</div>
//                 <div className="text-lg font-semibold text-success-600">
//                   {score.correct}
//                 </div>
//               </div>
//               <div className="bg-error-50 rounded-lg p-3">
//                 <div className="text-sm text-gray-600">Incorrect</div>
//                 <div className="text-lg font-semibold text-error-600">
//                   {score.incorrect}
//                 </div>
//               </div>
//             </div>

//             {/* Game Status */}
//             <div className="mt-4 text-center">
//               {!gameStarted && (
//                 <div className="text-yellow-600 font-semibold">
//                   Waiting for first question to start timer...
//                 </div>
//               )}
//               {gameStarted && (
//                 <div className="text-green-600 font-semibold">
//                   Game in progress
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Game Rules */}
//           <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Rules:</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//               {session.rules.map((rule, index) => (
//                 <div key={index} className="bg-gray-50 rounded-lg p-2 text-sm">
//                   <span className="font-semibold">{rule.divisor}</span> →{" "}
//                   <span className="text-primary-600">
//                     &ldquo;{rule.replacement}&rdquo;
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Answer Result Display */}
//           {showResult && lastAnswerResult && (
//             <div
//               className={`mb-6 p-4 rounded-lg text-center ${
//                 lastAnswerResult.isCorrect
//                   ? "bg-success-50 text-success-800"
//                   : "bg-error-50 text-error-800"
//               }`}
//             >
//               <div className="text-lg font-semibold">
//                 {lastAnswerResult.isCorrect ? "✅ Correct!" : "❌ Incorrect"}
//               </div>
//               {!lastAnswerResult.isCorrect && (
//                 <div className="text-sm">
//                   Correct answer:{" "}
//                   <strong>{lastAnswerResult.correctAnswer}</strong>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Current Question */}
//           <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//             {isLoadingQuestion ? (
//               <div className="text-gray-500">Loading next question...</div>
//             ) : currentQuestion ? (
//               <>
//                 <div className="text-6xl font-bold text-primary-600 mb-8">
//                   {currentQuestion.number}
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <input
//                     type="text"
//                     value={answer}
//                     onChange={(e) => setAnswer(e.target.value)}
//                     className="w-full max-w-md mx-auto px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                     placeholder="Enter your answer"
//                     autoFocus
//                     disabled={timeRemaining <= 0}
//                   />

//                   <button
//                     type="submit"
//                     disabled={!answer.trim() || timeRemaining <= 0}
//                     className="px-8 py-3 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     Submit Answer
//                   </button>
//                 </form>
//               </>
//             ) : (
//               <div className="text-gray-500">
//                 {gameStarted
//                   ? "Waiting for next question..."
//                   : "Preparing game..."}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Progress Sidebar */}
//         <div className="lg:col-span-1">
//           <GameProgress stats={sessionStats} className="sticky top-4" />
//         </div>
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
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
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
                    <svg
                      className="w-5 h-5 mr-2 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
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
                <svg
                  className="w-6 h-6 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
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
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
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
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-20 space-y-6">
                  <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center animate-pulse">
                    <svg
                      className="w-8 h-8 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
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
