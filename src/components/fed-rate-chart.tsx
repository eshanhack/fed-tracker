"use client";

import { FedRateDataPoint } from "@/types/fed-rate";
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

interface FedRateChartProps {
  data: FedRateDataPoint[];
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: FedRateDataPoint }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 border border-zinc-700 px-4 py-3 shadow-xl">
        <p className="text-zinc-400 text-xs mb-1">
          {new Date(label!).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-amber-400 font-mono text-lg font-semibold">
          {data.rate.toFixed(2)}%
        </p>
        <p
          className={`text-xs mt-1 font-medium ${
            data.action === "Hike"
              ? "text-red-400"
              : data.action === "Cut"
                ? "text-emerald-400"
                : "text-zinc-500"
          }`}
        >
          {data.action}
          {data.change !== 0 && data.action !== "Initial" && (
            <span className="ml-1">
              ({data.change > 0 ? "+" : ""}
              {(data.change * 100).toFixed(0)} bps)
            </span>
          )}
        </p>
      </div>
    );
  }
  return null;
};

export function FedRateChart({ data }: FedRateChartProps) {
  const maxRate = Math.max(...data.map((d) => d.rate));
  const minRate = Math.min(...data.map((d) => d.rate));
  const padding = (maxRate - minRate) * 0.1;

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#52525b"
            tick={{ fill: "#71717a", fontSize: 11 }}
            tickLine={{ stroke: "#3f3f46" }}
            axisLine={{ stroke: "#3f3f46" }}
            interval="preserveStartEnd"
            minTickGap={50}
          />
          <YAxis
            domain={[
              Math.max(0, minRate - padding),
              Math.ceil(maxRate + padding),
            ]}
            tickFormatter={(value) => `${value}%`}
            stroke="#52525b"
            tick={{ fill: "#71717a", fontSize: 11 }}
            tickLine={{ stroke: "#3f3f46" }}
            axisLine={{ stroke: "#3f3f46" }}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={data[data.length - 1]?.rate}
            stroke="#f59e0b"
            strokeDasharray="5 5"
            strokeOpacity={0.5}
          />
          <Line
            type="stepAfter"
            dataKey="rate"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 6,
              fill: "#f59e0b",
              stroke: "#000",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


