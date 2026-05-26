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

export function PIDChart({ history }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <h2 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
        PID Performance
      </h2>
      <ResponsiveContainer width="100%" height={200} minHeight={200}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="timestamp" hide />
          <YAxis
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
            labelStyle={{ color: "#9CA3AF" }}
          />
          <Legend wrapperStyle={{ color: "#9CA3AF", fontSize: 12 }} />
          <ReferenceLine y={0} stroke="#4B5563" />
          <Line
            type="monotone"
            dataKey="pid_error"
            stroke="#F87171"
            dot={false}
            strokeWidth={2}
            name="PID Error"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="pid_output"
            stroke="#A78BFA"
            dot={false}
            strokeWidth={2}
            name="PID Output"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}