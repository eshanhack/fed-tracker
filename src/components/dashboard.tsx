"use client";

import { useEffect, useState } from "react";
import { FedRateDataPoint } from "@/types/fed-rate";
import { FedRateChart } from "./fed-rate-chart";
import { FedRateTable } from "./fed-rate-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Dashboard() {
  const [data, setData] = useState<FedRateDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/fed-rate");
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch data");
        }
        
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const currentRate = data.length > 0 ? data[data.length - 1] : null;
  const previousRate = data.length > 1 ? data[data.length - 2] : null;
  const rateChange = currentRate && previousRate 
    ? currentRate.rate - previousRate.rate 
    : 0;

  const hikeCount = data.filter((d) => d.action === "Hike").length;
  const cutCount = data.filter((d) => d.action === "Cut").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading Fed Rate data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="max-w-md p-6 bg-red-950/50 border border-red-900 rounded-lg text-center">
          <h2 className="text-red-400 text-lg font-semibold mb-2">Failed to Load Data</h2>
          <p className="text-red-300 text-sm mb-4">{error}</p>
          <p className="text-zinc-500 text-xs">
            Make sure the FRED_API_KEY environment variable is set correctly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-amber-500 rounded-full" />
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">
                  US Fed Rate Tracker
                </h1>
                <p className="text-xs text-zinc-500">
                  Federal Funds Target Rate (Upper Limit)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {currentRate && (
                <div className="text-right">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Current Rate
                  </p>
                  <p className="text-2xl font-mono font-bold text-amber-400">
                    {currentRate.rate.toFixed(2)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Current Rate"
            value={currentRate ? `${currentRate.rate.toFixed(2)}%` : "—"}
            highlight
          />
          <StatCard
            label="Last Change"
            value={
              rateChange !== 0
                ? `${rateChange > 0 ? "+" : ""}${(rateChange * 100).toFixed(0)} bps`
                : "No Change"
            }
            trend={rateChange > 0 ? "up" : rateChange < 0 ? "down" : "neutral"}
          />
          <StatCard label="Total Hikes" value={hikeCount.toString()} trend="up" />
          <StatCard label="Total Cuts" value={cutCount.toString()} trend="down" />
        </div>

        {/* Chart Section */}
        <Card className="mb-8 bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <span className="w-3 h-3 bg-amber-500 rounded-full" />
              Federal Funds Rate History
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <FedRateChart data={data} />
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-zinc-500 rounded-full" />
              Rate Decision History
              <span className="text-zinc-600 font-normal">
                (Hikes & Cuts only)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <FedRateTable data={data} />
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
            <p>
              Data source:{" "}
              <a
                href="https://fred.stlouisfed.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-400 transition-colors"
              >
                Federal Reserve Economic Data (FRED)
              </a>
            </p>
            <p>
              Series: DFEDTARU (Federal Funds Target Rate - Upper Limit)
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  highlight,
}: {
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        highlight
          ? "bg-amber-950/20 border-amber-900/50"
          : "bg-zinc-900/50 border-zinc-800"
      }`}
    >
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={`text-xl font-mono font-semibold ${
          highlight
            ? "text-amber-400"
            : trend === "up"
              ? "text-red-400"
              : trend === "down"
                ? "text-emerald-400"
                : "text-zinc-300"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
