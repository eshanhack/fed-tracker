export interface FedRateDataPoint {
  date: string;
  rate: number;
  action: "Hike" | "Cut" | "Pause" | "Initial";
  change: number;
}

export interface FREDApiResponse {
  observations: Array<{
    date: string;
    value: string;
  }>;
}


