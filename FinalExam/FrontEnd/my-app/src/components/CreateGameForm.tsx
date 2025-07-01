import { CreateGameTemplateRequest, GameRule } from "@/types/game";
import React, { useEffect, useState } from "react";

interface CreateGameFormProps {
  onSubmit: (request: CreateGameTemplateRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: CreateGameTemplateRequest;
  isEditing?: boolean;
  error?: string | null;
}

const CreateGameForm: React.FC<CreateGameFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialData,
  isEditing = false,
  error,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    author: initialData?.author || "",
    minRange: initialData?.minRange || 1,
    maxRange: initialData?.maxRange || 100,
  });
  const [rules, setRules] = useState<GameRule[]>(
    initialData?.rules || [{ divisor: 3, replacement: "Fizz" }]
  );

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        author: initialData.author,
        minRange: initialData.minRange,
        maxRange: initialData.maxRange,
      });
      setRules(initialData.rules);
    }
  }, [initialData]);

  const handleAddRule = () => {
    setRules([...rules, { divisor: 2, replacement: "" }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (
    index: number,
    field: keyof GameRule,
    value: string | number
  ) => {
    const updatedRules = [...rules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setRules(updatedRules);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the validation error section
      const errorSection = document.querySelector("[data-validation-errors]");
      if (errorSection) {
        errorSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    onSubmit({
      ...formData,
      rules,
    });
  };

  // Auto-scroll to API error when it appears
  useEffect(() => {
    if (error) {
      const errorSection = document.querySelector("[data-api-error]");
      if (errorSection) {
        errorSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [error]);

  const validateForm = () => {
    return (
      formData.name.trim() &&
      formData.author.trim() &&
      formData.minRange > 0 &&
      formData.maxRange > formData.minRange &&
      rules.length > 0 &&
      rules.every((rule) => rule.divisor >= 2 && rule.replacement.trim()) &&
      rules.every(
        (rule) =>
          rule.divisor >= formData.minRange && rule.divisor <= formData.maxRange
      )
    );
  };

  const getValidationErrors = () => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push("Game name is required");
    }

    if (!formData.author.trim()) {
      errors.push("Author name is required");
    }

    if (formData.maxRange <= formData.minRange) {
      errors.push("Maximum number must be greater than minimum");
    }

    if (rules.length === 0) {
      errors.push("At least one rule is required");
    }

    if (rules.some((rule) => rule.divisor < 2 || !rule.replacement.trim())) {
      errors.push("All rules need a divisor ≥ 2 and replacement word");
    }

    if (
      rules.some(
        (rule) =>
          rule.divisor < formData.minRange || rule.divisor > formData.maxRange
      )
    ) {
      errors.push("Rule divisors must be within the number range");
    }

    return errors;
  };

  return (
    <div className="min-h-screen lg:py-8 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-elevated animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
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
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {isEditing ? "Edit Game Template" : "Create New Game"}
            </h2>
            <p className="text-lg text-slate-600">
              {isEditing
                ? "Update your game template settings"
                : "Design your own custom FizzBuzz variant"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="game-name"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Game Name *
                  </label>
                  <input
                    id="game-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`input-field ${
                      !formData.name.trim() && formData.name !== ""
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : ""
                    }`}
                    placeholder="e.g., Super FizzBuzz, Math Master"
                  />
                  {!formData.name.trim() && formData.name !== "" && (
                    <p className="text-xs text-red-600 font-medium">
                      Game name is required
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="author-name"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Author Name *
                  </label>
                  <input
                    id="author-name"
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className={`input-field ${
                      !formData.author.trim() && formData.author !== ""
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : ""
                    }`}
                    placeholder="Your name"
                  />
                  {!formData.author.trim() && formData.author !== "" && (
                    <p className="text-xs text-red-600 font-medium">
                      Author name is required
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Number Range */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
                Number Range
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="min-range"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Minimum Number *
                  </label>
                  <input
                    id="min-range"
                    type="number"
                    required
                    min="1"
                    value={formData.minRange}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minRange: parseInt(e.target.value) || 1,
                      })
                    }
                    className="input-field"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="max-range"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Maximum Number *
                  </label>
                  <input
                    id="max-range"
                    type="number"
                    required
                    min={formData.minRange + 1}
                    value={formData.maxRange}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxRange: parseInt(e.target.value) || 100,
                      })
                    }
                    className={`input-field ${
                      formData.maxRange <= formData.minRange
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  {formData.maxRange <= formData.minRange && (
                    <p className="text-xs text-red-600 font-medium">
                      Maximum must be greater than minimum ({formData.minRange})
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Range Preview</p>
                    <p>
                      Your game will include numbers from{" "}
                      <strong>{formData.minRange}</strong> to{" "}
                      <strong>{formData.maxRange}</strong> (
                      {formData.maxRange - formData.minRange + 1} total numbers)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Rules */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Game Rules ({rules.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="btn-secondary btn-sm flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
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
                  Add Rule
                </button>
              </div>

              <div className="space-y-4">
                {rules.map((rule, index) => (
                  <div
                    key={index}
                    className="card bg-slate-50 border-slate-200 animate-scale-in"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-slate-800">
                        Rule {index + 1}
                      </h4>
                      {rules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRule(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove rule"
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
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Divisor *
                        </label>
                        <input
                          type="number"
                          required
                          min="2"
                          value={rule.divisor}
                          onChange={(e) =>
                            handleRuleChange(
                              index,
                              "divisor",
                              parseInt(e.target.value) || 2
                            )
                          }
                          className={`input-field ${
                            rule.divisor < formData.minRange ||
                            rule.divisor > formData.maxRange
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : ""
                          }`}
                          placeholder="e.g., 3, 5, 7"
                        />
                        <p className="text-xs text-slate-500">
                          Numbers divisible by this value will be replaced
                        </p>
                        {(rule.divisor < formData.minRange ||
                          rule.divisor > formData.maxRange) && (
                          <p className="text-xs text-red-600 font-medium">
                            Divisor must be between {formData.minRange} and{" "}
                            {formData.maxRange}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Replacement Word *
                        </label>
                        <input
                          type="text"
                          required
                          value={rule.replacement}
                          onChange={(e) =>
                            handleRuleChange(
                              index,
                              "replacement",
                              e.target.value
                            )
                          }
                          className={`input-field ${
                            !rule.replacement.trim() && rule.replacement !== ""
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : ""
                          }`}
                          placeholder="e.g., Fizz, Buzz, Boom"
                        />
                        <p className="text-xs text-slate-500">
                          The word to show instead of the number
                        </p>
                        {!rule.replacement.trim() &&
                          rule.replacement !== "" && (
                            <p className="text-xs text-red-600 font-medium">
                              Replacement word is required
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Rule Preview */}
                    {rule.divisor >= 2 && rule.replacement.trim() && (
                      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-sm text-emerald-800">
                          <span className="font-medium">Preview:</span> Numbers
                          like {rule.divisor}, {rule.divisor * 2},{" "}
                          {rule.divisor * 3}... will show as &quot;
                          <span className="font-semibold">
                            {rule.replacement}
                          </span>
                          &quot;
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Rules Help */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">How Rules Work</p>
                    <ul className="space-y-1 text-amber-700">
                      <li>
                        When a number is divisible by multiple rules, all
                        replacement words are combined
                      </li>
                      <li>
                        Example: If 15 is divisible by both 3 (Fizz) and 5
                        (Buzz), it becomes &quot;FizzBuzz&quot;
                      </li>
                      <li> Rules are applied in the order you create them</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200">
              {/* API Error Message */}
              {error && (
                <div
                  data-api-error
                  className="mb-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4 animate-scale-in"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-red-800 font-bold text-base">
                        ❌ Error
                      </p>
                      <p className="text-red-800 font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !validateForm()}
                className="btn-primary btn-lg flex-1 sm:flex-none sm:px-12 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="loading-spinner w-5 h-5 mr-2"></div>
                    {isEditing ? "Updating..." : "Creating..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {isEditing ? "Update Game" : "Create Game"}
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary btn-lg flex-1 sm:flex-none sm:px-12"
              >
                Cancel
              </button>
            </div>

            {/* Form Validation Help */}
            {!validateForm() && (
              <div
                data-validation-errors
                className="bg-red-50 border-2 border-red-200 rounded-xl p-6 animate-scale-in"
              >
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-red-800">
                    <p className="font-bold text-base mb-3">
                      ⚠️ Please fix the following issues before creating your
                      game:
                    </p>
                    <ul className="space-y-2">
                      {getValidationErrors().map((errorMsg, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-red-600 font-bold">•</span>
                          <span className="font-medium">{errorMsg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGameForm;
