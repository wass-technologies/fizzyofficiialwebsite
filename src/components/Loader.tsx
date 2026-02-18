"use client";

import { useEffect, useState } from "react";

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-yellow-300 transition-opacity duration-500"
      style={{ opacity: isLoading ? 1 : 0 }}
    >
      <div className="text-center">
        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent mx-auto" />
        <p className="text-xl font-bold text-yellow-900">Loading...</p>
      </div>
    </div>
  );
}
