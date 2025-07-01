import ErrorMessage from "@/components/ErrorMessage";
import GameTemplateList from "@/components/GameTemplateList";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { gameTemplateApi, handleApiError } from "@/services/api";
import { GameTemplate } from "@/types/game";
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
      <div className="space-y-8">
        {/* Delete Loading Indicator */}
        {deleteLoading && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-scale-in">
            <div className="flex items-center space-x-3">
              <div className="loading-spinner w-5 h-5"></div>
              <span className="text-amber-800 font-medium">
                Deleting template...
              </span>
            </div>
          </div>
        )}

        {/* Templates List */}
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
    <Layout
      title="Manage Templates - FizzBuzz Game"
      description="Manage your custom FizzBuzz game templates. Create, edit, and organize your game variants."
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100"
      showHero={true}
      heroTitle="Manage Templates"
      heroDescription="Create, edit, and organize your custom FizzBuzz game variants"
      heroActions={
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link href="/create-game">
            <button className="btn-primary btn-lg px-8 py-4 text-lg font-semibold">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Template
            </button>
          </Link>
          <Link href="/">
            <button className="btn-secondary btn-lg px-8 py-4 text-lg">
              Back to Home
            </button>
          </Link>
        </div>
      }
    >
      {/* Delete Loading Indicator */}
      {deleteLoading && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-scale-in mb-8">
          <div className="flex items-center space-x-3">
            <div className="loading-spinner w-5 h-5"></div>
            <span className="text-amber-800 font-medium">
              Deleting template...
            </span>
          </div>
        </div>
      )}

      <div className="animate-slide-up">{renderContent()}</div>
    </Layout>
  );
};

export default ManageTemplatesPage;
