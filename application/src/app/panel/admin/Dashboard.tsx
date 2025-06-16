"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { getStatistics } from "@/services/adminAPI";

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}j ${h}h ${m}m`;
}

const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4 },
};

const ConnectionsChart = React.memo(
  ({
    data,
    isSmallScreen,
  }: {
    data: { time: string; connections: number }[];
    isSmallScreen: boolean;
  }) => {
    console.log("Rendering ConnectionsChart with data length:", data);
    return (
      <ResponsiveContainer width="100%" height={isSmallScreen ? 250 : 350}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 40, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(75, 85, 99, 0.2)" />
          <XAxis
            dataKey="time"
            stroke="#4B5563"
            interval={isSmallScreen ? 5 : 0}
            tick={{ fontSize: 12 }}
            angle={isSmallScreen ? -30 : 0}
            textAnchor={isSmallScreen ? "end" : "middle"}
            height={isSmallScreen ? 60 : 30}
          />
          <YAxis stroke="#4B5563" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255 255 255 / 0.95)",
              borderRadius: 12,
              padding: 12,
            }}
            labelStyle={{ color: "#1e40af", fontWeight: "600" }}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="connections"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            animationDuration={0} 
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
);

export default function Dashboard() {
  const [connectionsToday, setConnectionsToday] = useState(0);
  const [ramUsed, setRamUsed] = useState(0);
  const [ramTotal, setRamTotal] = useState(0);
  const [nodeVersion, setNodeVersion] = useState("");
  const [nodeUptime, setNodeUptime] = useState(0);
  const [chartData, setChartData] = useState<
    { time: string; connections: number }[]
  >([]);

  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      clearTimeout((handleResize as any).timeout);
      (handleResize as any).timeout = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150);
    };

    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout((handleResize as any).timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isChartDataEqual = useCallback(
    (
      a: { time: string; connections: number}[],
      b: { time: string; connections: number }[]
    ) => {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (
          a[i].time !== b[i].time ||
          a[i].connections !== b[i].connections
        ) {
          return false;
        }
      }
      return true;
    },
    []
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchStats() {
      try {
        const data = await getStatistics();

        setConnectionsToday((prev) =>
          prev !== data.connectionsToday ? data.connectionsToday : prev
        );
        setRamUsed((prev) => (prev !== data.ramUsed ? data.ramUsed : prev));
        setRamTotal((prev) => (prev !== data.ramTotal ? data.ramTotal : prev));
        setNodeVersion((prev) =>
          prev !== data.nodeVersion ? data.nodeVersion : prev
        );

        const uptimeSeconds =
          (data.uptime?.hours ?? 0) * 3600 + (data.uptime?.minutes ?? 0) * 60;
        setNodeUptime((prev) => (prev !== uptimeSeconds ? uptimeSeconds : prev));

        if (Array.isArray(data.connectionsByMinute)) {
          const maxPoints = 30;
          const slicedData = data.connectionsByMinute.slice(-maxPoints);

          const newChartData = slicedData.map((point: any) => ({
            time: `${point.hour.padStart(2, "0")}:${point.minute_segment}`,
            connections: point.connections_count,
          }));

          setChartData((prev) =>
            isChartDataEqual(prev, newChartData) ? prev : newChartData
          );
        } else {
          setChartData([]);
        }
      } catch (err) {
        console.error("Erreur fetch stats:", err);
      }
    }

    fetchStats();

    intervalId = setInterval(fetchStats, 60000);

    return () => clearInterval(intervalId);
  }, [isChartDataEqual]);

  const isSmallScreen = windowWidth !== null && windowWidth < 640;

  return (
    <section className="min-h-screen p-4 sm:p-8 font-sans text-gray-900">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: "Connexions aujourd'hui",
            value: connectionsToday,
            color: "text-indigo-600",
            bgGradient:
              "bg-gradient-to-tr from-indigo-300 via-indigo-200 to-indigo-100",
          },
          {
            label: "RAM utilisée",
            value: `${ramUsed.toFixed(2)} Go / ${ramTotal.toFixed(2)} Go`,
            color: "text-purple-600",
            bgGradient:
              "bg-gradient-to-tr from-purple-300 via-purple-200 to-purple-100",
          },
          {
            label: "Node.js version",
            value: nodeVersion,
            color: "text-indigo-700",
            bgGradient:
              "bg-gradient-to-tr from-indigo-300 via-indigo-200 to-indigo-100",
          },
          {
            label: "Uptime serveur",
            value: formatUptime(nodeUptime),
            color: "text-purple-700",
            bgGradient:
              "bg-gradient-to-tr from-purple-300 via-purple-200 to-purple-100",
          },
        ].map(({ label, value, color, bgGradient }) => (
          <motion.div
            key={label}
            className={`rounded-3xl p-5 sm:p-7 shadow-xl backdrop-blur-xl border border-white/30 ${bgGradient} flex flex-col items-center justify-center`}
            {...fadeInUp}
          >
            <h2 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 tracking-wide text-gray-700">
              {label}
            </h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={value}
                className={`text-3xl sm:text-4xl font-extrabold ${color} select-none`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                {value}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="max-w-full overflow-x-auto px-2 sm:px-6 lg:px-8">
        <div className="min-w-[600px] p-6 bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-indigo-900 tracking-wide">
            Connexions aujourd'hui
          </h2>
          {windowWidth !== null && (
            <ConnectionsChart data={chartData} isSmallScreen={isSmallScreen} />
          )}
        </div>
      </div>
    </section>
  );
}