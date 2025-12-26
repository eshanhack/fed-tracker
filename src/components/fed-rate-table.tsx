"use client";

import { FedRateDataPoint } from "@/types/fed-rate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FedRateTableProps {
  data: FedRateDataPoint[];
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getActionColor = (action: FedRateDataPoint["action"]) => {
  switch (action) {
    case "Hike":
      return "text-red-400";
    case "Cut":
      return "text-emerald-400";
    case "Pause":
      return "text-zinc-500";
    case "Initial":
      return "text-zinc-600";
  }
};

const getActionBadge = (action: FedRateDataPoint["action"]) => {
  const baseClasses =
    "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded";
  switch (action) {
    case "Hike":
      return `${baseClasses} bg-red-950 text-red-400 border border-red-900`;
    case "Cut":
      return `${baseClasses} bg-emerald-950 text-emerald-400 border border-emerald-900`;
    case "Pause":
      return `${baseClasses} bg-zinc-800 text-zinc-400 border border-zinc-700`;
    case "Initial":
      return `${baseClasses} bg-zinc-900 text-zinc-500 border border-zinc-800`;
  }
};

export function FedRateTable({ data }: FedRateTableProps) {
  // Show data in reverse chronological order, filter to only show changes
  const filteredData = data
    .filter((d) => d.action !== "Pause")
    .slice()
    .reverse();

  return (
    <div className="relative overflow-hidden">
      <div className="overflow-auto max-h-[400px] scrollbar-thin">
        <Table>
          <TableHeader className="sticky top-0 bg-zinc-950 z-10">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 font-semibold text-xs uppercase tracking-wider w-[140px]">
                Date
              </TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs uppercase tracking-wider w-[100px]">
                Action
              </TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs uppercase tracking-wider text-right">
                Rate
              </TableHead>
              <TableHead className="text-zinc-400 font-semibold text-xs uppercase tracking-wider text-right">
                Change
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow
                key={item.date}
                className={`border-zinc-800/50 hover:bg-zinc-900/50 transition-colors ${
                  index === 0 ? "bg-zinc-900/30" : ""
                }`}
              >
                <TableCell className="font-mono text-sm text-zinc-300">
                  {formatDate(item.date)}
                </TableCell>
                <TableCell>
                  <span className={getActionBadge(item.action)}>
                    {item.action === "Hike" && "▲ "}
                    {item.action === "Cut" && "▼ "}
                    {item.action}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-amber-400 font-medium">
                  {item.rate.toFixed(2)}%
                </TableCell>
                <TableCell
                  className={`text-right font-mono text-sm ${getActionColor(item.action)}`}
                >
                  {item.action !== "Initial" && (
                    <>
                      {item.change > 0 ? "+" : ""}
                      {(item.change * 100).toFixed(0)} bps
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


