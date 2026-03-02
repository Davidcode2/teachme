import { useErrorStore } from "../store";
import { getUser } from "../services/authService";

export async function customFetch(
  url: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
): ReturnType<typeof fetch> {
  const user = getUser();
  if (!init) {
    init = {};
  }
  
  // Check if user exists and has a valid access token
  if (user?.access_token) {
    init!.headers = { ...init!.headers, Authorization: `Bearer ${user.access_token}` };
  }
  
  const res = await fetch(url, init);
  
  // Handle 401 Unauthorized - session expired
  if (res.status === 401) {
    useErrorStore.getState().pushError({
      message: "Sitzung abgelaufen. Bitte melden Sie sich erneut an.",
      code: 401,
    });
    // Redirect to login after a short delay
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
    throw new Error("Session expired");
  }
  
  // Handle 403 Forbidden
  if (res.status === 403) {
    useErrorStore.getState().pushError({
      message: "Zugriff verweigert. Sie haben nicht die erforderlichen Berechtigungen.",
      code: 403,
    });
    throw new Error("Access forbidden");
  }
  
  // Handle server errors (5xx)
  if (res.status >= 500) {
    useErrorStore.getState().pushError({
      message: "Serverfehler. Bitte versuchen Sie es später erneut",
      code: res.status,
    });
    throw new Error(`Server error: ${res.status}`);
  }
  
  return res;
}
