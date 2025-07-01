import { GameTemplate } from "@/types/game";
import { Edit, Folder, Play, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

interface GameTemplateListProps {
  templates: GameTemplate[];
  onSelectTemplate: (template: GameTemplate) => void;
  onEditTemplate?: (template: GameTemplate) => void;
  onDeleteTemplate?: (templateId: number) => void;
  selectedTemplateId?: number;
  showActions?: boolean;
}

const GameTemplateList: React.FC<GameTemplateListProps> = ({
  templates,
  onSelectTemplate,
  onEditTemplate,
  onDeleteTemplate,
  selectedTemplateId,
  showActions = false,
}) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center">
            <Folder className="w-12 h-12 text-slate-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-600">
              No Games Available
            </h3>
            <p className="text-slate-500">
              Create your first game template to get started!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Game Templates
        </h2>
        <p className="text-lg text-slate-600">
          Choose from {templates.length} available game
          {templates.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`group relative overflow-hidden transition-all duration-300 ${
              selectedTemplateId === template.id
                ? "template-card-selected transform scale-105"
                : "template-card hover:scale-105"
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            {/* Selection Indicator */}
            {selectedTemplateId === template.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Play className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Card Content */}
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                  {template.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    By{" "}
                    <span className="font-medium text-slate-700">
                      {template.author}
                    </span>
                  </span>
                  <span className="badge badge-info">
                    {template.rules.length} rule
                    {template.rules.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Game Info */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Number Range</span>
                  <span className="font-medium text-slate-800">
                    {template.minRange} - {template.maxRange}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <span className="text-sm text-slate-600 block mb-2">
                    Game Rules
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {template.rules.slice(0, 3).map((rule, index) => (
                      <div key={index} className="rule-chip">
                        <span className="font-medium">{rule.divisor}</span>
                        <span className="mx-1">→</span>
                        <span className="text-blue-600">
                          &quot;{rule.replacement}&quot;
                        </span>
                      </div>
                    ))}
                    {template.rules.length > 3 && (
                      <div className="rule-chip bg-slate-200 text-slate-600">
                        +{template.rules.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="text-xs text-slate-400 border-t border-slate-100 pt-4">
                Created{" "}
                {new Date(template.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    selectedTemplateId === template.id
                      ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template);
                  }}
                >
                  {selectedTemplateId === template.id
                    ? "✓ Selected"
                    : "Select Game"}
                </button>

                {showActions && (
                  <div className="flex gap-2">
                    <button
                      className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTemplate?.(template);
                      }}
                      title="Edit Template"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            `Are you sure you want to delete "${template.name}"? This action cannot be undone.`
                          )
                        ) {
                          onDeleteTemplate?.(template.id);
                        }
                      }}
                      title="Delete Template"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      {!showActions && templates.length > 0 && (
        <div className="text-center pt-8">
          <p className="text-slate-600 mb-4">
            Want to create your own game variant?
          </p>
          <Link
            href="/create-game"
            className="btn-secondary inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Game
          </Link>
        </div>
      )}
    </div>
  );
};

export default GameTemplateList;
