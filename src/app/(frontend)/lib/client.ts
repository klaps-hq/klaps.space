const API_URL = process.env.API_URL;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

const getApiBaseUrl = (): string => {
  if (!API_URL) {
    throw new Error("Missing API_URL environment variable.");
  }
  return API_URL;
};

export class ApiNotFoundError extends Error {
  constructor(path: string) {
    super(`Resource not found: ${path}`);
    this.name = "ApiNotFoundError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { params?: Record<string, string> } = {}
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

    const res = await fetch(url.toString(), {
      ...options,
      headers: {
        ...options.headers,
        ...(INTERNAL_API_KEY && { "x-internal-api-key": INTERNAL_API_KEY }),
      },
      next: { revalidate: 300 },
    });

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
