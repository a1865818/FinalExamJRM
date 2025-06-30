import ErrorMessage from "@/components/ErrorMessage";
import GameSetup from "@/components/GameSetup";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  gameSessionApi,
  gameTemplateApi,
  handleApiError,
} from "@/services/api";
import { GameTemplate, StartGameRequest } from "@/types/game";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const GameSetupPage: React.FC = () => {
  const [template, setTemplate] = useState<GameTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { gameId } = router.query;

  useEffect(() => {
    if (gameId) {
      loadGameTemplate(parseInt(gameId as string));
    }
  }, [gameId]);

  const loadGameTemplate = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const templateData = await gameTemplateApi.getById(id);
      setTemplate(templateData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async (request: StartGameRequest) => {
    try {
      setStarting(true);
      const session = await gameSessionApi.start(request);
      router.push(`/game-play?sessionId=${session.sessionId}`);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setStarting(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  const renderContent = () => {
    if (loading) return <LoadingSpinner message="Loading game..." />;
    if (error)
      return (
        <ErrorMessage
          message={error}
          onRetry={() => gameId && loadGameTemplate(parseInt(gameId as string))}
        />
      );
    if (!template) return <ErrorMessage message="Game not found" />;

    return (
      <GameSetup
        selectedTemplate={template}
        onStartGame={handleStartGame}
        onBack={handleBack}
        isStarting={starting}
      />
    );
  };

  return (
    <>
      <Head>
        <title>Game Setup - FizzBuzz Game</title>
        <meta name="description" content="Set up your FizzBuzz game session" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <Link href="/">
                <h1 className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-primary-600 transition-colors">
                  FizzBuzz Game
                </h1>
              </Link>
              <Link
                href="/"
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                ← Back to Games
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default GameSetupPage;
