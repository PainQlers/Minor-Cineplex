import {
  ApplySnapshotsRequest,
  ApplySnapshotsResponse,
  CompareRunsResponse,
  ScrapeRun,
} from "@/types/scraper-admin";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

async function fetchScraperAdmin<T>(
  path: string,
  apiKey: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is undefined");
  }

  if (!apiKey.trim()) {
    throw new Error("API key is required");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getScrapeRuns(apiKey: string, limit = 20) {
  return fetchScraperAdmin<ScrapeRun[]>(
    `/scraper/runs?limit=${encodeURIComponent(String(limit))}`,
    apiKey,
  );
}

export async function getMovieScrapeCompare(
  apiKey: string,
  params: {
    runId: string;
    status?: string;
    q?: string;
    page?: number;
    pageSize?: number;
  },
) {
  const query = new URLSearchParams({
    status: params.status ?? "all",
    q: params.q ?? "",
    page: String(params.page ?? 1),
    pageSize: String(params.pageSize ?? 50),
  });

  return fetchScraperAdmin<CompareRunsResponse>(
    `/scraper/runs/${params.runId}/compare?${query}`,
    apiKey,
  );
}

export async function applyMovieScrapeSnapshots(
  apiKey: string,
  runId: string,
  body: ApplySnapshotsRequest,
) {
  return fetchScraperAdmin<ApplySnapshotsResponse>(
    `/scraper/runs/${runId}/apply`,
    apiKey,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
}
