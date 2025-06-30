import { GameHistoryItem } from "@/types/gameHistory";
import React from "react";

interface GameSessionDetailsProps {
  game: GameHistoryItem;
}

const GameSessionDetails: React.FC<GameSessionDetailsProps> = ({ game }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Game Statistics:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Correct Answers: {game.correctAnswers}</div>
            <div>Incorrect Answers: {game.incorrectAnswers}</div>
            <div>Total Questions: {game.totalQuestions}</div>
            <div>Accuracy: {game.accuracyPercentage.toFixed(1)}%</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Session Info:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Started: {new Date(game.startedAt).toLocaleString()}</div>
            {game.completedAt && (
              <div>
                Completed: {new Date(game.completedAt).toLocaleString()}
              </div>
            )}
            <div>
              Duration: {Math.floor(game.duration / 60)}m {game.duration % 60}s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GameSessionDetails;
