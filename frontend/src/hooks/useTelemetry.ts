import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

// Typ-Definition für einen Telemetrie-Datenpunkt
export type TelemetryData = {
  timestamp: number;
  target_angle: number;
  actual_angle: number;
  motor_angle: number;
  offset: number;
  speed: number;
  acceleration: number;
  motor_temp: number;
  pid_error: number;
  pid_output: number;
  kp: number;
  ki: number;
  kd: number;
}

const HISTORY_LENGTH = 50; // Wie viele Datenpunkte wir im Chart anzeigen

export function useTelemetry() {
  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [latest, setLatest] = useState<TelemetryData | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Verbindung zum Node.js Backend aufbauen
    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to backend");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from backend");
      setConnected(false);
    });

    // Telemetrie-Daten empfangen und in History speichern
    socket.on("telemetry", (data: TelemetryData) => {
      setLatest(data);
      setHistory((prev) => {
        const updated = [...prev, { ...data }];
        if (updated.length > HISTORY_LENGTH) {
          return updated.slice(-HISTORY_LENGTH);
        }
        return updated;
      });
    });

    // Cleanup wenn Komponente unmounted wird
    return () => {
      socket.disconnect();
    };
  }, []);

  // PID Parameter ans Backend schicken → weiter an Simulator
  const updatePID = (params: { kp?: number; ki?: number; kd?: number }) => {
    socketRef.current?.emit("pid_update", params);
  };

  return { history, latest, connected, updatePID };
}