import CreateGameForm from "@/components/CreateGameForm";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { gameTemplateApi, handleApiError } from "@/services/api";
import { CreateGameTemplateRequest, GameTemplate } from "@/types/game";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

const EditGamePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<GameTemplate | null>(null);
  const router = useRouter();
  const { gameId } = router.query;

  const loadGameTemplate = useCallback(async (id: number) => {
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
  }, []);

  useEffect(() => {
    if (gameId) {
      loadGameTemplate(parseInt(gameId as string));
    }
  }, [gameId, loadGameTemplate]);

  const handleCancel = () => {
    router.push("/manage-templates");
  };

  const renderContent = () => {
    if (loading) return <LoadingSpinner message="Loading template..." />;
    if (error)
      return (
        <ErrorMessage
          message={error}
          onRetry={() => gameId && loadGameTemplate(parseInt(gameId as string))}
        />
      );
    if (!template) return <ErrorMessage message="Template not found" />;

    // Convert template to form format
    const initialData: CreateGameTemplateRequest = {
      name: template.name,
      author: template.author,
      minRange: template.minRange,
      maxRange: template.maxRange,
      rules: template.rules.map((rule) => ({
        divisor: rule.divisor,
        replacement: rule.replacement,
      })),
    };

    return (
      <CreateGameForm
        onCancel={handleCancel}
        initialData={initialData}
        isEditing={true}
        templateId={template.id}
      />
    );
  };

  return (
    <>
      <Head>
        <title>Edit Game Template - FizzBuzz Game</title>
        <meta
          name="description"
          content="Edit your custom FizzBuzz game template"
        />
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
              <nav className="flex space-x-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/manage-templates"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Manage Templates
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {template ? `Edit "${template.name}"` : "Edit Game Template"}
            </h2>
            <p className="text-gray-600 mt-1">
              Update your custom FizzBuzz game template
            </p>
          </div>

          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default EditGamePage;
