import { GameTemplate, StartGameRequest } from "@/types/game";
import React, { useState } from "react";

interface GameSetupProps {
  selectedTemplate: GameTemplate;
  onStartGame: (request: StartGameRequest) => void;
  onBack: () => void;
  isStarting?: boolean;
}

const GameSetup: React.FC<GameSetupProps> = ({
  selectedTemplate,
  onStartGame,
  onBack,
  isStarting = false,
}) => {
  const [playerName, setPlayerName] = useState("");
  const [duration, setDuration] = useState(60);

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame({
      gameTemplateId: selectedTemplate.id,
      playerName,
      duration,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Game Setup</h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {selectedTemplate.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          By {selectedTemplate.author}
        </p>
        <p className="text-sm text-gray-600 mb-3">
          Number Range: {selectedTemplate.minRange} -{" "}
          {selectedTemplate.maxRange}
        </p>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Game Rules:</p>
          <ul className="space-y-1">
            {selectedTemplate.rules.map((rule, index) => (
              <li key={index} className="text-sm text-gray-600">
                Replace numbers divisible by <strong>{rule.divisor}</strong>{" "}
                with <strong>&ldquo;{rule.replacement}&rdquo;</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form onSubmit={handleStartGame} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            required
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Game Duration (seconds)
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={300}>5 minutes</option>
          </select>
        </div>

        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={isStarting}
            className="flex-1 bg-success-600 text-white py-3 px-6 rounded-md hover:bg-success-700 disabled:opacity-50 transition-colors"
          >
            {isStarting ? "Starting..." : "Start Game"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 transition-colors"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameSetup;
