const API_URL = process.env.API_URL;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 500;

const getApiBaseUrl = (): string => {
  if (!API_URL) {
    throw new Error("Missing API_URL environment variable.");
  }
  return API_URL;
};

class ApiNotFoundError extends Error {
  constructor(path: string) {
    super(`Resource not found: ${path}`);
    this.name = "ApiNotFoundError";
  }
}

export async function fetchOrNotFound<T>(fn: () => Promise<T>): Promise<T> {
  const { notFound } = await import("next/navigation");
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiNotFoundError) {
      notFound();
    }
    throw error;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & {
    params?: Record<string, string>;
    next?: { revalidate?: number };
  } = {}
): Promise<T> {
  try {
    const baseUrl = getApiBaseUrl();
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    const url = new URL(normalizedPath, normalizedBaseUrl);

    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value);
        }
      });
    }

    const request = () =>
      fetch(url.toString(), {
        ...options,
        headers: {
          ...options.headers,
          ...(INTERNAL_API_KEY && { "x-internal-api-key": INTERNAL_API_KEY }),
        },
        // Default 5-minute cache; callers can override via options.next.
        next: { revalidate: 300, ...options.next },
      });

    // The production build prerenders hundreds of pages against the live
    // API at once; a momentary 5xx there used to abort the whole build
    // (October 2026: /miasta/jarocin). Server errors and dropped
    // connections get a few retries with backoff; 4xx answers are final.
    let res: Response | undefined;
    for (let attempt = 0; ; attempt++) {
      try {
        res = await request();
        if (res.status < 500 || attempt >= MAX_RETRIES) break;
      } catch (error) {
        if (attempt >= MAX_RETRIES) throw error;
      }
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_BASE_MS * 2 ** attempt)
      );
    }

    if (!res.ok) {
      if (res.status === 404) {
        throw new ApiNotFoundError(path);
      }

      const errorBody = await res.text();
      console.error(res.statusText, errorBody);
      throw new Error(`API error ${res.status}: ${errorBody}`);
    }

    return res.json();
  } catch (error) {
    if (error instanceof ApiNotFoundError) {
      throw error;
    }

    console.error(error);
    throw new Error(`Failed to fetch data: ${error}`);
  }
}
