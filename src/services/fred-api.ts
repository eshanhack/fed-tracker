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
