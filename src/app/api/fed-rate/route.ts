import { NextResponse } from "next/server";
import { fetchFedRateData, getDemoData } from "@/services/fred-api";

export async function GET() {
  const apiKey = process.env.FRED_API_KEY;

  if (!apiKey) {
    // Return demo data if no API key is configured
    console.log("No FRED_API_KEY found, returning demo data");
    return NextResponse.json({
      data: getDemoData(),
      isDemo: true,
    });
  }

  try {
    const data = await fetchFedRateData(apiKey);
    return NextResponse.json({
      data,
      isDemo: false,
    });
  } catch (error) {
    console.error("Error fetching FRED data:", error);
    // Fallback to demo data on error
    return NextResponse.json({
      data: getDemoData(),
      isDemo: true,
      error: "Failed to fetch live data, showing demo data",
    });
  }
}


