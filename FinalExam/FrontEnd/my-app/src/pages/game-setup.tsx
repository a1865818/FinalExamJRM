import ErrorMessage from "@/components/ErrorMessage";
import GameSetup from "@/components/GameSetup";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  gameSessionApi,
  gameTemplateApi,
  handleApiError,
} from "@/services/api";
import { GameTemplate, StartGameRequest } from "@/types/game";
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
    <Layout
      title="Game Setup - FizzBuzz Game"
      description="Set up your FizzBuzz game session"
      className="min-h-screen bg-gray-100"
    >
      {renderContent()}
    </Layout>
  );
};

export default GameSetupPage;
