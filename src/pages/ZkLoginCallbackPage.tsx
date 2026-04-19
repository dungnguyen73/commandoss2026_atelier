import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useZkLogin } from "../hooks/useZkLogin";
import { Gem, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function ZkLoginCallbackPage() {
  const navigate = useNavigate();
  const { handleCallback } = useZkLogin();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Process the hash fragment provided by Google's implicit OAuth response
    if (!window.location.hash) {
      setError("No authentication data returned from provider.");
      return;
    }

    try {
      handleCallback(window.location.hash);
      // Clean up the URL on success, preventing token leakage in sharing history
      window.history.replaceState(null, "", window.location.pathname);

      // Let the user see the success animation briefly before routing
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (err: any) {
      setError(err.message || "Failed to process authentication");
    }
  }, [handleCallback, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-[var(--shadow-card)] ring-1 ring-slate-100"
      >
        {error ? (
          <div className="flex flex-col items-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-(--color-foreground) mb-2">Authentication Failed</h2>
            <p className="text-sm text-muted-foreground mb-8">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="w-full rounded-xl bg-(--color-surface-low) py-3 text-sm font-semibold text-(--color-foreground) transition-colors hover:bg-slate-200"
            >
              Return Home
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative mb-8 flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 shadow-inner">
                <Gem className="h-6 w-6 text-emerald-600 animate-pulse" />
              </div>
            </div>
            <h2 className="font-display text-2xl font-bold text-(--color-foreground) mb-2">Securing Session</h2>
            <p className="text-sm text-muted-foreground">Deriving your on-chain identity...</p>

            <div className="mt-8 flex gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
