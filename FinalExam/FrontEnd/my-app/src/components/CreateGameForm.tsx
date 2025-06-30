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
    onSubmit({
      ...formData,
      rules,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditing ? "Edit Game" : "Create New Game"}
      </h2>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Game Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Super FizzBuzz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Name
            </label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Range
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.minRange}
              onChange={(e) =>
                setFormData({ ...formData, minRange: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Range
            </label>
            <input
              type="number"
              required
              min="2"
              value={formData.maxRange}
              onChange={(e) =>
                setFormData({ ...formData, maxRange: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Game Rules
          </label>
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    required
                    min="2"
                    value={rule.divisor}
                    onChange={(e) =>
                      handleRuleChange(
                        index,
                        "divisor",
                        parseInt(e.target.value)
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Divisor"
                  />
                  <input
                    type="text"
                    required
                    value={rule.replacement}
                    onChange={(e) =>
                      handleRuleChange(index, "replacement", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Replacement word"
                  />
                </div>
                {rules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRule(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddRule}
            className="mt-3 px-4 py-2 text-primary-600 hover:text-primary-800 transition-colors"
          >
            + Add Rule
          </button>
        </div>

        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update Game"
              : "Create Game"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGameForm;
