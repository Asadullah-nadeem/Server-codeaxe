
/**
 * Safe fetch utility to handle JSON parsing and common API errors.
 * Prevents "Unexpected token <" errors by checking response types.
 */
export async function safeFetch<T>(url: string, options: RequestInit = {}, fallback: T): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      console.warn(`[safeFetch] Request to ${url} failed with status: ${response.status}`);
      return fallback;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error(`[safeFetch] Expected JSON from ${url} but received: ${text.substring(0, 100)}...`);
      return fallback;
    }

    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch (parseError) {
      console.error(`[safeFetch] Failed to parse JSON from ${url}:`, parseError);
      return fallback;
    }
  } catch (error) {
    console.error(`[safeFetch] Network error fetching ${url}:`, error);
    return fallback;
  }
}
