// import { GameTemplate } from "@/types/game";
// import React from "react";

// interface GameTemplateListProps {
//   templates: GameTemplate[];
//   onSelectTemplate: (template: GameTemplate) => void;
//   onEditTemplate?: (template: GameTemplate) => void;
//   onDeleteTemplate?: (templateId: number) => void;
//   selectedTemplateId?: number;
//   showActions?: boolean;
// }

// const GameTemplateList: React.FC<GameTemplateListProps> = ({
//   templates,
//   onSelectTemplate,
//   onEditTemplate,
//   onDeleteTemplate,
//   selectedTemplateId,
//   showActions = false,
// }) => {
//   if (templates.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <div className="text-gray-500 text-lg">No game templates available</div>
//         <p className="text-gray-400 mt-2">
//           Create your first game template to get started!
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <h2 className="text-2xl font-bold text-gray-900 mb-6">
//         Choose a Game Template
//       </h2>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {templates.map((template) => (
//           <div
//             key={template.id}
//             className={`
//               p-6 rounded-lg border-2 cursor-pointer transition-all duration-200
//               ${
//                 selectedTemplateId === template.id
//                   ? "border-primary-500 bg-primary-50 shadow-md"
//                   : "border-gray-200 bg-white hover:border-primary-300 hover:shadow-sm"
//               }
//             `}
//             onClick={() => onSelectTemplate(template)}
//           >
//             <div className="space-y-3">
//               <div className="flex items-start justify-between">
//                 <h3 className="text-lg font-semibold text-gray-900 truncate">
//                   {template.name}
//                 </h3>
//                 {selectedTemplateId === template.id && (
//                   <div className="ml-2 flex-shrink-0">
//                     <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
//                   </div>
//                 )}
//               </div>

//               <p className="text-sm text-gray-600">
//                 By: <span className="font-medium">{template.author}</span>
//               </p>

//               <div className="text-sm text-gray-500 space-y-1">
//                 <div>
//                   Range: {template.minRange} - {template.maxRange}
//                 </div>
//                 <div>
//                   Rules: {template.rules.length} custom rule
//                   {template.rules.length !== 1 ? "s" : ""}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">
//                   Rules Preview:
//                 </div>
//                 <div className="flex flex-wrap gap-1">
//                   {template.rules.slice(0, 3).map((rule, index) => (
//                     <span
//                       key={index}
//                       className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
//                     >
//                       {rule.divisor} → &quot;{rule.replacement}&quot;
//                     </span>
//                   ))}
//                   {template.rules.length > 3 && (
//                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
//                       +{template.rules.length - 3} more
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
//                 Created: {new Date(template.createdAt).toLocaleDateString()}
//               </div>
//             </div>

//             <div className="mt-4 pt-4 border-t border-gray-100">
//               <div className="flex gap-2">
//                 <button
//                   className={`
//                     flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
//                     ${
//                       selectedTemplateId === template.id
//                         ? "bg-primary-600 text-white hover:bg-primary-700"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }
//                   `}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onSelectTemplate(template);
//                   }}
//                 >
//                   {selectedTemplateId === template.id ? "Selected" : "Select"}
//                 </button>

//                 {showActions && (
//                   <>
//                     <button
//                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onEditTemplate?.(template);
//                       }}
//                       title="Edit Template"
//                     >
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                         />
//                       </svg>
//                     </button>
//                     <button
//                       className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         if (
//                           window.confirm(
//                             `Are you sure you want to delete "${template.name}"? This action cannot be undone.`
//                           )
//                         ) {
//                           onDeleteTemplate?.(template.id);
//                         }
//                       }}
//                       title="Delete Template"
//                     >
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                         />
//                       </svg>
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GameTemplateList;

import { GameTemplate } from "@/types/game";
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
            <svg
              className="w-12 h-12 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
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
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
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
                      <svg
                        className="w-5 h-5"
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
                      <svg
                        className="w-5 h-5"
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
            Create New Game
          </Link>
        </div>
      )}
    </div>
  );
};

export default GameTemplateList;
