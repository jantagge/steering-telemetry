import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { TelemetryData } from "../hooks/useTelemetry";

interface Props {
  history: TelemetryData[];
}

export function SteeringChart({ history }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <h2 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
        Steering Angle — Target vs Actual
      </h2>
      <ResponsiveContainer width="100%" height={200} minHeight={200}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="timestamp" hide />
          <YAxis
            domain={[-50, 50]}
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            unit="°"
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
            labelStyle={{ color: "#9CA3AF" }}
          />
          <Legend wrapperStyle={{ color: "#9CA3AF", fontSize: 12 }} />
          <ReferenceLine y={0} stroke="#374151" />
          <Line
            type="monotone"
            dataKey="target_angle"
            stroke="#3B82F6"
            dot={false}
            strokeWidth={2}
            name="Target °"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="actual_angle"
            stroke="#10B981"
            dot={false}
            strokeWidth={2}
            name="Actual °"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="offset"
            stroke="#F59E0B"
            dot={false}
            strokeWidth={1}
            strokeDasharray="4 2"
            name="Offset °"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}