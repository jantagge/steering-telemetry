import { useState } from "react";
import type { TelemetryData } from "../hooks/useTelemetry";

interface Props {
  history: TelemetryData[];
}

export function AIAnalysis({ history }: Props) {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setAnalysis("");
    try {
      const response = await fetch("http://localhost:3001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telemetryHistory: history.slice(-50),
        }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch {
      setAnalysis("Analysis failed – is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-white text-sm font-semibold uppercase tracking-wider">
          AI Analysis
        </h2>
        <button
          onClick={analyze}
          disabled={loading || history.length < 10}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
      <div className="min-h-16">
        {analysis ? (
          <p className="text-gray-300 text-sm leading-relaxed">{analysis}</p>
        ) : (
          <p className="text-gray-600 text-sm italic">
            Click Analyze to get an AI insight on the current telemetry data.
          </p>
        )}
      </div>
    </div>
  );
}