import React from "react";

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`bg-white shadow-md rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4 border-b pb-2">{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xl font-bold text-gray-800">{children}</h2>
);

export const CardDescription: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <p className="text-sm text-gray-500 mt-1">{children}</p>;

export const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-4">{children}</div>
);
