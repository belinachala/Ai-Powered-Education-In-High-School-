import React from "react";

interface AlertProps {
  variant?: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  children,
  className = "",
}) => {
  const variants = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <div
      className={`border px-4 py-3 rounded-lg text-sm font-medium ${variants[variant]} ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <p className="mt-1 text-sm">{children}</p>;
};
