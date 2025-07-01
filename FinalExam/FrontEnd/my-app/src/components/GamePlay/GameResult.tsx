import type { GameResult as GameResultType } from "@/types/game";
import React from "react";

interface GameResultProps {
  result: GameResultType;
  onPlayAgain: () => void;
  onNewGame: () => void;
  onViewHistory?: () => void;
}

const GameResult: React.FC<GameResultProps> = ({
  result,
  onPlayAgain,
  onNewGame,
  onViewHistory,
}) => {
  const getPerformanceMessage = (
    accuracy: number
  ): { message: string; color: string } => {
    if (accuracy >= 90)
      return { message: "Outstanding! 🎉", color: "text-green-600" };
    if (accuracy >= 75)
      return { message: "Great job! 👍", color: "text-blue-600" };
    if (accuracy >= 60)
      return { message: "Good effort! 😊", color: "text-yellow-600" };
    if (accuracy >= 40)
      return { message: "Keep practicing! 💪", color: "text-orange-600" };
    return { message: "Don't give up! 🤗", color: "text-red-600" };
  };

  const performance = getPerformanceMessage(result.accuracyPercentage);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center mt-6 lg:mt-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Game Complete!</h1>
      <p className={`text-xl ${performance.color} mb-8`}>
        {performance.message}
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {result.gameName}
        </h2>
        <p className="text-gray-600 mb-4">Player: {result.playerName}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-primary-600">
              {result.totalQuestions}
            </div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-success-600">
              {result.correctAnswers}
            </div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-error-600">
              {result.incorrectAnswers}
            </div>
            <div className="text-sm text-gray-600">Incorrect</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">
              {result.accuracyPercentage}%
            </div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Game Duration: {Math.floor(result.duration / 60)}:
          {(result.duration % 60).toString().padStart(2, "0")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onPlayAgain}
          className="bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Play Again
        </button>
        <button
          onClick={onNewGame}
          className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Choose New Game
        </button>
        {onViewHistory && (
          <button
            onClick={onViewHistory}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View History
          </button>
        )}
      </div>
    </div>
  );
};

export default GameResult;
