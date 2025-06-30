import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
      <div className="text-error-600 text-lg font-semibold mb-2">
        ⚠️ Something went wrong
      </div>
      <p className="text-error-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-error-600 text-white px-4 py-2 rounded-lg hover:bg-error-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
