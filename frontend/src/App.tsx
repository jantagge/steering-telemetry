import { useTelemetry } from "./hooks/useTelemetry";
import { SteeringChart } from "./components/SteeringChart";
import { SpeedChart } from "./components/SpeedChart";
import { TempChart } from "./components/TempChart";
import { PIDChart } from "./components/PIDChart";
import { PIDSliders } from "./components/PIDSliders";
import { AIAnalysis } from "./components/AIAnalysis";

export default function App() {
  //const { history, latest, connected, updatePID } = useTelemetry();
  const { history, latest, connected, updatePID } = useTelemetry();
  //console.log("History length:", history.length, "Latest:", latest); // DEBUG
  console.log("History length:", history.length);
  const testData = history.slice(0, 10).map(d => ({ t: d.timestamp, v: d.target_angle }));
  console.log("Test data:", testData);
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Steering Telemetry Dashboard
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            Formula Student — Electronic Power Steering
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-xs text-gray-400">
            {connected ? "Live" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Live Stats Bar */}
      {latest && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Target Angle", value: `${latest.target_angle.toFixed(1)}°` },
            { label: "Actual Angle", value: `${latest.actual_angle.toFixed(1)}°` },
            { label: "Speed", value: `${latest.speed.toFixed(0)} km/h` },
            { label: "Offset", value: `${latest.offset.toFixed(2)}°`, warning: Math.abs(latest.offset) > 5 },
          ].map(({ label, value, warning }) => (
            <div key={label} className="bg-gray-900 rounded-xl p-3 border border-gray-700">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-2xl font-mono font-bold ${warning ? "text-red-400" : "text-white"}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Main Charts Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <SteeringChart history={history} />
        <PIDChart history={history} />
        <SpeedChart history={history} />
        <TempChart history={history} latest={latest} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4">
        <PIDSliders latest={latest} onUpdate={updatePID} />
        <AIAnalysis history={history} />
      </div>

    </div>
  );
}