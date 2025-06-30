import ErrorMessage from "@/components/ErrorMessage";
import GameTemplateList from "@/components/GameTemplateList";
import LoadingSpinner from "@/components/LoadingSpinner";
import { gameTemplateApi, handleApiError } from "@/services/api";
import { GameTemplate } from "@/types/game";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

const ManageTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<GameTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const router = useRouter();

  const loadGameTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const templatesData = await gameTemplateApi.getAll();
      setTemplates(templatesData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGameTemplates();
  }, [loadGameTemplates]);

  const handleSelectTemplate = (template: GameTemplate) => {
    router.push(`/game-setup?gameId=${template.id}`);
  };

  const handleEditTemplate = (template: GameTemplate) => {
    router.push(`/edit-game?gameId=${template.id}`);
  };

  const handleDeleteTemplate = async (templateId: number) => {
    try {
      setDeleteLoading(templateId);
      await gameTemplateApi.delete(templateId);
      setTemplates(templates.filter((t) => t.id !== templateId));
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setDeleteLoading(null);
    }
  };

  const renderContent = () => {
    if (loading) return <LoadingSpinner message="Loading templates..." />;
    if (error)
      return <ErrorMessage message={error} onRetry={loadGameTemplates} />;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Manage Game Templates
            </h2>
            <p className="text-gray-600 mt-1">
              Create, edit, and delete your custom game templates
            </p>
          </div>
          <Link href="/create-game">
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
              Create New Template
            </button>
          </Link>
        </div>

        {deleteLoading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
              <span className="text-yellow-800">Deleting template...</span>
            </div>
          </div>
        )}

        <GameTemplateList
          templates={templates}
          onSelectTemplate={handleSelectTemplate}
          onEditTemplate={handleEditTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          showActions={true}
        />
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Manage Templates - FizzBuzz Game</title>
        <meta
          name="description"
          content="Manage your custom FizzBuzz game templates"
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
                  href="/history"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  History
                </Link>
                <Link
                  href="/stats"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Statistics
                </Link>
              </nav>
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

export default ManageTemplatesPage;
