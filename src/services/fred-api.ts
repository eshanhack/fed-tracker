import { FedRateDataPoint, FREDApiResponse } from "@/types/fed-rate";

const FRED_BASE_URL = "https://api.stlouisfed.org/fred/series/observations";
const SERIES_ID = "DFEDTARU"; // Federal Funds Target Rate - Upper Limit

export async function fetchFedRateData(
  apiKey: string
): Promise<FedRateDataPoint[]> {
  const params = new URLSearchParams({
    series_id: SERIES_ID,
    api_key: apiKey,
    file_type: "json",
    observation_start: "2015-01-01",
    frequency: "m", // Monthly data
    aggregation_method: "eop", // End of period
  });

  const response = await fetch(`${FRED_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`FRED API error: ${response.status} ${response.statusText}`);
  }

  const data: FREDApiResponse = await response.json();

  return processRateData(data.observations);
}

function processRateData(
  observations: FREDApiResponse["observations"]
): FedRateDataPoint[] {
  const validObservations = observations.filter(
    (obs) => obs.value !== "." && !isNaN(parseFloat(obs.value))
  );

  return validObservations.map((obs, index) => {
    const currentRate = parseFloat(obs.value);
    const previousRate =
      index > 0 ? parseFloat(validObservations[index - 1].value) : currentRate;
    const change = currentRate - previousRate;

    let action: FedRateDataPoint["action"];
    if (index === 0) {
      action = "Initial";
    } else if (change > 0.001) {
      action = "Hike";
    } else if (change < -0.001) {
      action = "Cut";
    } else {
      action = "Pause";
    }

    return {
      date: obs.date,
      rate: currentRate,
      action,
      change: Math.round(change * 100) / 100,
    };
  });
}

// Demo data for when API key is not provided
export function getDemoData(): FedRateDataPoint[] {
  const demoObservations = [
    { date: "2022-01-01", value: "0.25" },
    { date: "2022-02-01", value: "0.25" },
    { date: "2022-03-01", value: "0.50" },
    { date: "2022-04-01", value: "0.50" },
    { date: "2022-05-01", value: "1.00" },
    { date: "2022-06-01", value: "1.75" },
    { date: "2022-07-01", value: "2.50" },
    { date: "2022-08-01", value: "2.50" },
    { date: "2022-09-01", value: "3.25" },
    { date: "2022-10-01", value: "3.25" },
    { date: "2022-11-01", value: "4.00" },
    { date: "2022-12-01", value: "4.50" },
    { date: "2023-01-01", value: "4.50" },
    { date: "2023-02-01", value: "4.75" },
    { date: "2023-03-01", value: "5.00" },
    { date: "2023-04-01", value: "5.00" },
    { date: "2023-05-01", value: "5.25" },
    { date: "2023-06-01", value: "5.25" },
    { date: "2023-07-01", value: "5.50" },
    { date: "2023-08-01", value: "5.50" },
    { date: "2023-09-01", value: "5.50" },
    { date: "2023-10-01", value: "5.50" },
    { date: "2023-11-01", value: "5.50" },
    { date: "2023-12-01", value: "5.50" },
    { date: "2024-01-01", value: "5.50" },
    { date: "2024-02-01", value: "5.50" },
    { date: "2024-03-01", value: "5.50" },
    { date: "2024-04-01", value: "5.50" },
    { date: "2024-05-01", value: "5.50" },
    { date: "2024-06-01", value: "5.50" },
    { date: "2024-07-01", value: "5.50" },
    { date: "2024-08-01", value: "5.50" },
    { date: "2024-09-01", value: "5.00" },
    { date: "2024-10-01", value: "5.00" },
    { date: "2024-11-01", value: "4.75" },
    { date: "2024-12-01", value: "4.50" },
  ];

  return processRateData(demoObservations);
}


