import type { TelemetryData } from "../hooks/useTelemetry";

interface Props {
  latest: TelemetryData | null;
  onUpdate: (params: { kp?: number; ki?: number; kd?: number }) => void;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  onChange: (val: number) => void;
}

function Slider({ label, value, min, max, step, color, onChange }: SliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        <span className="text-gray-400 text-xs uppercase tracking-wider">{label}</span>
        <span className="text-white text-xs font-mono">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-500 cursor-pointer"
        style={{ accentColor: color }}
      />
      <div className="flex justify-between text-gray-600 text-xs">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export function PIDSliders({ latest, onUpdate }: Props) {
  const kp = latest?.kp ?? 1.2;
  const ki = latest?.ki ?? 0.05;
  const kd = latest?.kd ?? 0.3;

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <h2 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
        PID Parameters
      </h2>
      <div className="flex flex-col gap-5">
        <Slider
          label="Kp — Proportional"
          value={kp}
          min={0}
          max={5}
          step={0.01}
          color="#3B82F6"
          onChange={(val) => onUpdate({ kp: val })}
        />
        <Slider
          label="Ki — Integral"
          value={ki}
          min={0}
          max={1}
          step={0.01}
          color="#10B981"
          onChange={(val) => onUpdate({ ki: val })}
        />
        <Slider
          label="Kd — Derivative"
          value={kd}
          min={0}
          max={2}
          step={0.01}
          color="#F59E0B"
          onChange={(val) => onUpdate({ kd: val })}
        />
      </div>
    </div>
  );
}