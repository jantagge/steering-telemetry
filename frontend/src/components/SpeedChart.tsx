import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TelemetryData } from "../hooks/useTelemetry";

interface Props {
  history: TelemetryData[];
}

export function SpeedChart({ history }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <h2 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
        Vehicle Speed & Acceleration
      </h2>
      <ResponsiveContainer width="100%" height={200} minHeight={200}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="timestamp" hide />
          <YAxis
            yAxisId="speed"
            domain={[0, 150]}
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            unit=" km/h"
            width={60}
          />
          <YAxis
            yAxisId="accel"
            orientation="right"
            domain={[-10, 10]}
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            unit=" m/s²"
            width={60}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
            labelStyle={{ color: "#9CA3AF" }}
          />
          <Legend wrapperStyle={{ color: "#9CA3AF", fontSize: 12 }} />
          <Line
            yAxisId="speed"
            type="monotone"
            dataKey="speed"
            stroke="#6366F1"
            dot={false}
            strokeWidth={2}
            name="Speed km/h"
            isAnimationActive={false}
          />
          <Line
            yAxisId="accel"
            type="monotone"
            dataKey="acceleration"
            stroke="#EC4899"
            dot={false}
            strokeWidth={2}
            name="Accel m/s²"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}