import React from "react";
import { cn } from "@/utils/cn";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
  text = "Loading...",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-gray-200 border-t-primary-600",
          sizeClasses[size]
        )}
        role="status"
        aria-label={text}
      />
      {text && <p className="mt-2 text-sm text-gray-600 text-center">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
