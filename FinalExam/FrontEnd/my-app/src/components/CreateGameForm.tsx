import { CreateGameTemplateRequest, GameRule } from "@/types/game";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  FileText,
  Hash,
  Info,
  Lightbulb,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { gameTemplateApi, handleApiError } from "@/services/api";
import { useRouter } from "next/router";

interface CreateGameFormProps {
  onCancel: () => void;
  initialData?: CreateGameTemplateRequest;
  isEditing?: boolean;
}

const CreateGameForm: React.FC<CreateGameFormProps> = ({
  onCancel,
  initialData,
  isEditing = false,
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
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

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

    try {
      setApiError(null);
      setLoading(true);
      const newTemplate = await gameTemplateApi.create({
        ...formData,
        rules,
      });
      router.push(`/game-setup?gameId=${newTemplate.id}`);
    } catch (err) {
      setApiError(handleApiError(err));
      // Scroll to API error
      const errorSection = document.querySelector("[data-api-error]");
      if (errorSection) {
        errorSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } finally {
      setLoading(false);
    }
  };

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
              <Plus className="w-8 h-8 text-white" />
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
                <Info className="w-6 h-6 mr-2 text-blue-600" />
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
                <Hash className="w-6 h-6 mr-2 text-purple-600" />
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
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Range Preview</p>
                    <p>
                      Your game will include numbers from{" "}
                      <strong>{formData.minRange}</strong> to{" "}
                      <strong>{formData.maxRange}</strong> ({
                        formData.maxRange - formData.minRange + 1
                      } total numbers)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Rules */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-emerald-600" />
                  Game Rules ({rules.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="btn-secondary btn-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
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
                          <Trash2 className="w-5 h-5" />
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
                  <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
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
              <button
                type="submit"
                disabled={loading || !validateForm()}
                className="btn-primary btn-lg flex-1 sm:flex-none sm:px-12 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner w-5 h-5 mr-2"></div>
                    {isEditing ? "Updating..." : "Creating..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Check className="w-5 h-5 mr-2" />
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

            {/* Error messages below buttons */}
            <div className="mt-6 space-y-4">
              {apiError && (
                <div
                  data-api-error
                  className="mb-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4 animate-scale-in"
                >
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-red-800 font-bold text-base">
                        ❌ Error
                      </p>
                      <p className="text-red-800 font-medium">{apiError}</p>
                    </div>
                  </div>
                </div>
              )}
              {hasSubmitted && !validateForm() && (
                <div
                  data-validation-errors
                  className="bg-red-50 border-2 border-red-200 rounded-xl p-6 animate-scale-in"
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGameForm;
