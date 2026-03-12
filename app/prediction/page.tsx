"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";


ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

export default function PredictionPage() {
  const [labels, setLabels] = useState<string[]>([]);
  const [actualData, setActualData] = useState<number[]>([]);
  const [predictedData, setPredictedData] = useState<number[]>([]);

  useEffect(() => {
    
    fetch("http://127.0.0.1:8000/history")
      .then((res) => res.json())
      .then((history) => {
        const initialLabels: string[] = [];
        const initialActual: number[] = [];
        const initialPredicted: number[] = [];

        history.forEach((item: any) => {
          initialLabels.push(item.time);
          initialActual.push(item.actual);
          initialPredicted.push(item.predicted);
        });

        setLabels(initialLabels);
        setActualData(initialActual);
        setPredictedData(initialPredicted);
      });


 
    const socket = new WebSocket("ws://127.0.0.1:8000/ws");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const time = data.time;

      setLabels((prev) => {
        const updated = [...prev, time];
        return updated.length > 20 ? updated.slice(-20) : updated;
      });

      setActualData((prev) => {
        const updated = [...prev, data.actual];
        return updated.length > 20 ? updated.slice(-20) : updated;
      });

      setPredictedData((prev) => {
        const updated = [...prev, data.predicted];
        return updated.length > 20 ? updated.slice(-20) : updated;
      });
    };

    return () => socket.close();
  }, []);

  const latestActual = actualData[actualData.length - 1];
  const latestPredicted = predictedData[predictedData.length - 1];
  const difference =
    latestActual && latestPredicted
      ? ((latestPredicted - latestActual) / latestActual) * 100
      : 0;

  const chartData = {
    labels,
    datasets: [
      {
        label: "Actual Price",
        data: actualData,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.3)",
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#22c55e",
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: "Predicted Price",
        data: predictedData,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.3)",
        pointBackgroundColor: "#ef4444",
        pointBorderColor: "#ef4444",
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 2,
        borderDash: [6, 6],
        tension: 0.4
      }
    ]
  };
  
const [currentTime, setCurrentTime] = useState("");

useEffect(() => {
  const updateTime = () => {
    setCurrentTime(new Date().toLocaleTimeString());
  };

  updateTime(); 
  const interval = setInterval(updateTime, 1000);

  return () => clearInterval(interval);
}, []);
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-10">
      <div
        className={`px-4 py-2 rounded-lg font-semibold text-sm ${difference >= 0
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
          }`}
      >
        {difference >= 0 ? "▲" : "▼"} {difference.toFixed(2)}%
      </div>
      <h1 className="text-3xl font-bold mb-6">
        Live Stock Prediction Dashboard
      </h1>

      <div className="w-full max-w-5xl bg-gray-900 p-6 rounded-xl shadow-2xl shadow-green-500/20">
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                labels: {
                  color: "white"
                }
              }
            },
            scales: {
              x: {
                ticks: { color: "white" },
                grid: { color: "rgba(255,255,255,0.1)" }
              },
              y: {
                ticks: { color: "white" },
                grid: { color: "rgba(255,255,255,0.1)" }
              }
            }
          }}
        />
      </div>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <span className="h-3 w-3 bg-green-500 rounded-full animate-ping absolute"></span>
          <span className="h-3 w-3 bg-green-500 rounded-full"></span>
        </div>

        <span className="text-green-400 font-semibold tracking-wide">
          LIVE
        </span>

        <span className="text-gray-400 text-sm">
          {currentTime}
          {/* {typeof window !== "undefined" && new Date().toLocaleTimeString()} */}
        </span>
      </div>
    </div>
  );
}