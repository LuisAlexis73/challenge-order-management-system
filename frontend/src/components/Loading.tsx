import React from "react";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated Loading Spinner */}
      <div className="relative">
        <div
          className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 ${sizeClasses[size]} mb-4`}
        ></div>
        <div
          className={`absolute top-0 left-0 animate-ping rounded-full border-2 border-blue-400 ${sizeClasses[size]} opacity-20`}
        ></div>
      </div>

      {/* Loading Message */}
      <div className="text-center">
        <p className="text-gray-700 font-medium text-lg mb-2">{message}</p>
        <div className="flex items-center justify-center gap-1">
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
