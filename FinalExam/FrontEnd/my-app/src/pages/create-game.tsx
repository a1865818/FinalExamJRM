import CreateGameForm from "@/components/CreateGameForm";
import Layout from "@/components/Layout";
import { gameTemplateApi, handleApiError } from "@/services/api";
import { CreateGameTemplateRequest } from "@/types/game";
import { useRouter } from "next/router";
import React, { useState } from "react";

const CreateGamePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateGameTemplate = async (
    request: CreateGameTemplateRequest
  ) => {
    try {
      setLoading(true);
      setError(null);
      const newTemplate = await gameTemplateApi.create(request);
      router.push(`/game-setup?gameId=${newTemplate.id}`);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <Layout
      title="Create New Game - FizzBuzz Game"
      description="Create your own custom FizzBuzz game variant"
      className="min-h-screen bg-gray-100"
    >
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <CreateGameForm
        onSubmit={handleCreateGameTemplate}
        onCancel={handleCancel}
        isSubmitting={loading}
      />
    </Layout>
  );
};

export default CreateGamePage;
