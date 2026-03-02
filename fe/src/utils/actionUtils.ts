import { useErrorStore } from "../store";

/**
 * Format price string by removing commas and converting to standard format
 * Handles both comma and period as decimal separators
 */
export function formatPrice(price: FormDataEntryValue | string | number | null): string {
  if (!price) return "0";
  const priceStr = price.toString();
  // Remove any commas (e.g., "1,234.56" -> "1234.56" or "1.234,56" -> "1234.56")
  return priceStr.replace(/,/g, "");
}

/**
 * Parse price from form data and format it for API
 */
export function parsePriceFromFormData(formData: FormData, fieldName: string = "price"): string {
  const price = formData.get(fieldName);
  return formatPrice(price);
}

/**
 * Standardized error handler for actions
 * Pushes error to error store and returns error details
 */
export function handleActionError(error: unknown, defaultMessage: string = "Ein Fehler ist aufgetreten"): { code: number; message: string } {
  const errorDetails = {
    code: 500,
    message: defaultMessage,
  };

  if (error instanceof Response) {
    errorDetails.code = error.status;
    errorDetails.message = error.statusText || defaultMessage;
  } else if (error instanceof Error) {
    errorDetails.message = error.message;
  }

  useErrorStore.getState().pushError(errorDetails);
  return errorDetails;
}

/**
 * Handle API response and return JSON data or throw error
 */
export async function handleApiResponse<T>(response: Response, errorMessage: string = "API request failed"): Promise<T> {
  if (!response.ok) {
    const error = new Error(response.statusText || errorMessage);
    (error as any).status = response.status;
    throw error;
  }

  try {
    return await response.json();
  } catch (e) {
    throw new Error("Failed to parse response JSON");
  }
}

/**
 * Extract form data field as string with null safety
 */
export function getFormField(formData: FormData, fieldName: string): string | null {
  const value = formData.get(fieldName);
  return value ? value.toString() : null;
}

/**
 * Extract form data field and validate it's not null
 */
export function getRequiredFormField(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);
  if (!value) {
    throw new Error(`Required field "${fieldName}" is missing`);
  }
  return value.toString();
}
