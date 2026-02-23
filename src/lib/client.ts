const API_URL = process.env.API_URL!;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY!;

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
    const url = new URL(`${API_URL}${path}`);

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
        "x-internal-api-key": INTERNAL_API_KEY,
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
