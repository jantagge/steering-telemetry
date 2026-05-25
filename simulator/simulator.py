import asyncio
import json
import time
import math
import random
import websockets

# PID Parameters (will be adjustable from frontend)
KP = 1.2
KI = 0.05
KD = 0.3

class SteeringSimulator:
    def __init__(self):
        self.target_angle = 0.0
        self.actual_angle = 0.0
        self.motor_angle = 0.0
        self.speed = 0.0
        self.acceleration = 0.0
        self.motor_temp = 25.0
        self.pid_integral = 0.0
        self.pid_last_error = 0.0
        self.timestamp = 0

        # PID params
        self.kp = KP
        self.ki = KI
        self.kd = KD

    def update_target(self):
        # Simulate realistic steering inputs (sinusoidal + noise)
        t = self.timestamp * 0.05
        self.target_angle = (
            30 * math.sin(t * 0.3) +
            10 * math.sin(t * 0.7 + 1.2) +
            random.gauss(0, 0.5)
        )
        self.target_angle = max(-45, min(45, self.target_angle))

    def update_speed(self):
        t = self.timestamp * 0.05
        self.speed = max(0, 60 + 30 * math.sin(t * 0.1) + random.gauss(0, 1))
        self.acceleration = 30 * 0.1 * math.cos(t * 0.1) + random.gauss(0, 0.2)

    def update_pid(self):
        error = self.target_angle - self.actual_angle
        self.pid_integral += error * 0.05
        self.pid_integral = max(-50, min(50, self.pid_integral))
        pid_derivative = (error - self.pid_last_error) / 0.05
        self.pid_last_error = error

        output = (
            self.kp * error +
            self.ki * self.pid_integral +
            self.kd * pid_derivative
        )
        output = max(-100, min(100, output))

        # Simulate mechanical response
        self.actual_angle += output * 0.04 + random.gauss(0, 0.1)
        self.actual_angle = max(-45, min(45, self.actual_angle))
        self.motor_angle = self.actual_angle * 10.5 + random.gauss(0, 0.2)

        return error, output

    def update_temperature(self, pid_output):
        # Temperature rises with load, cools slowly
        load = abs(pid_output) / 100
        self.motor_temp += load * 0.08 - 0.02 + random.gauss(0, 0.05)
        self.motor_temp = max(20, min(120, self.motor_temp))

    def step(self):
        self.timestamp += 1
        self.update_target()
        self.update_speed()
        error, pid_output = self.update_pid()
        self.update_temperature(pid_output)

        return {
            "timestamp": self.timestamp,
            "target_angle": round(self.target_angle, 2),
            "actual_angle": round(self.actual_angle, 2),
            "motor_angle": round(self.motor_angle, 2),
            "offset": round(self.target_angle - self.actual_angle, 2),
            "speed": round(self.speed, 2),
            "acceleration": round(self.acceleration, 2),
            "motor_temp": round(self.motor_temp, 2),
            "pid_error": round(error, 2),
            "pid_output": round(pid_output, 2),
            "kp": self.kp,
            "ki": self.ki,
            "kd": self.kd,
        }


simulator = SteeringSimulator()
connected_clients = set()

async def handler(websocket):
    connected_clients.add(websocket)
    print(f"Client connected. Total: {len(connected_clients)}")
    try:
        async for message in websocket:
            # Accept PID parameter updates from frontend
            data = json.loads(message)
            if "kp" in data: simulator.kp = float(data["kp"])
            if "ki" in data: simulator.ki = float(data["ki"])
            if "kd" in data: simulator.kd = float(data["kd"])
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        connected_clients.discard(websocket)
        print(f"Client disconnected. Total: {len(connected_clients)}")

async def broadcast():
    while True:
        data = simulator.step()
        if connected_clients:
            message = json.dumps(data)
            await asyncio.gather(
                *[client.send(message) for client in connected_clients],
                return_exceptions=True
            )
        await asyncio.sleep(0.05)  # 20Hz

async def main():
    print("Simulator starting on ws://localhost:8765")
    async with websockets.serve(handler, "0.0.0.0", 8765):
        await broadcast()

if __name__ == "__main__":
    asyncio.run(main())