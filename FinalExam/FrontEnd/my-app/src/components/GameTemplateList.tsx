import { GameTemplate } from "@/types/game";
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
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No game templates available</div>
        <p className="text-gray-400 mt-2">
          Create your first game template to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Choose a Game Template
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`
              p-6 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${
                selectedTemplateId === template.id
                  ? "border-primary-500 bg-primary-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-primary-300 hover:shadow-sm"
              }
            `}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {template.name}
                </h3>
                {selectedTemplateId === template.id && (
                  <div className="ml-2 flex-shrink-0">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600">
                By: <span className="font-medium">{template.author}</span>
              </p>

              <div className="text-sm text-gray-500 space-y-1">
                <div>
                  Range: {template.minRange} - {template.maxRange}
                </div>
                <div>
                  Rules: {template.rules.length} custom rule
                  {template.rules.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Rules Preview:
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.rules.slice(0, 3).map((rule, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {rule.divisor} → &quot;{rule.replacement}&quot;
                    </span>
                  ))}
                  {template.rules.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                      +{template.rules.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                Created: {new Date(template.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  className={`
                    flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                    ${
                      selectedTemplateId === template.id
                        ? "bg-primary-600 text-white hover:bg-primary-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template);
                  }}
                >
                  {selectedTemplateId === template.id ? "Selected" : "Select"}
                </button>

                {showActions && (
                  <>
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTemplate?.(template);
                      }}
                      title="Edit Template"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameTemplateList;
