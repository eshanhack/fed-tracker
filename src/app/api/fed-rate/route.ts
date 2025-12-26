import { NextResponse } from "next/server";
import { fetchFedRateData } from "@/services/fred-api";

export async function GET() {
  const apiKey = process.env.FRED_API_KEY;

  if (!apiKey) {
    console.error("FRED_API_KEY environment variable is not set");
    return NextResponse.json(
      { error: "FRED_API_KEY environment variable is not configured" },
      { status: 500 }
    );
  }

  try {
    const data = await fetchFedRateData(apiKey);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching FRED data:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch data from FRED API" },
      { status: 500 }
    );
  }
}
