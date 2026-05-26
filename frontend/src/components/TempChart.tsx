import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { TelemetryData } from "../hooks/useTelemetry";

interface Props {
  history: TelemetryData[];
  latest: TelemetryData | null;
}

export function TempChart({ history, latest }: Props) {
  const temp = latest?.motor_temp ?? 0;
  const tempColor =
    temp > 80 ? "#EF4444" : temp > 60 ? "#F59E0B" : "#10B981";

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-white text-sm font-semibold uppercase tracking-wider">
          Motor Temperature
        </h2>
        <span className="text-2xl font-bold" style={{ color: tempColor }}>
          {temp.toFixed(1)}°C
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200} minHeight={200}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="timestamp" hide />
          <YAxis
            domain={[0, 120]}
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            unit="°C"
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
            labelStyle={{ color: "#9CA3AF" }}
          />
          <ReferenceLine y={60} stroke="#F59E0B" strokeDasharray="4 2" label={{ value: "Warn", fill: "#F59E0B", fontSize: 10 }} />
          <ReferenceLine y={80} stroke="#EF4444" strokeDasharray="4 2" label={{ value: "Crit", fill: "#EF4444", fontSize: 10 }} />
          <Line
            type="monotone"
            dataKey="motor_temp"
            stroke={tempColor}
            dot={false}
            strokeWidth={2}
            name="Temp °C"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}