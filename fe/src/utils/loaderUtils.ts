import { customFetch } from "../actions/customFetch";
import { useGlobalLoadingStore } from "../store";

export interface LoaderOptions<T> {
  url: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: BodyInit | null;
  validate?: (data: unknown) => data is T;
  defaultValue: T;
  errorMessage: string;
  setLoading?: boolean;
}

/**
 * Generic loader function with error handling and validation
 */
export async function loadData<T>({
  url,
  method = "GET",
  headers = {},
  body = null,
  validate,
  defaultValue,
  errorMessage,
  setLoading = true,
}: LoaderOptions<T>): Promise<T> {
  if (setLoading) {
    useGlobalLoadingStore.setState({ loading: true });
  }

  try {
    const response = await customFetch(url, {
      method,
      headers,
      body,
    });

    if (!response.ok) {
      console.error(`${errorMessage}: ${response.status} ${response.statusText}`);
      return defaultValue;
    }

    const responseData = await response.json();

    if (validate && !validate(responseData)) {
      console.error(`Invalid response format for ${url}`);
      return defaultValue;
    }

    return responseData as T;
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return defaultValue;
  } finally {
    if (setLoading) {
      useGlobalLoadingStore.setState({ loading: false });
    }
  }
}

/**
 * Create a typed array loader
 */
export function createArrayLoader<T>(errorMessage: string) {
  return async (url: string): Promise<T[]> => {
    return loadData<T[]>({
      url,
      validate: (data): data is T[] => Array.isArray(data),
      defaultValue: [],
      errorMessage,
    });
  };
}

/**
 * Create a typed object loader
 */
export function createObjectLoader<T>(errorMessage: string) {
  return async (url: string): Promise<T | null> => {
    return loadData<T | null>({
      url,
      validate: (data): data is T => data !== null && typeof data === "object",
      defaultValue: null,
      errorMessage,
    });
  };
}

/**
 * Create a number loader
 */
export function createNumberLoader(errorMessage: string) {
  return async (url: string): Promise<number> => {
    return loadData<number>({
      url,
      validate: (data): data is number => typeof data === "number",
      defaultValue: 0,
      errorMessage,
    });
  };
}

/**
 * Create a loader with authentication
 */
export function createAuthLoader<T>(errorMessage: string, getAuthToken: () => string | null) {
  return async (url: string): Promise<T[]> => {
    const token = getAuthToken();
    return loadData<T[]>({
      url,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      validate: (data): data is T[] => Array.isArray(data),
      defaultValue: [],
      errorMessage,
    });
  };
}
