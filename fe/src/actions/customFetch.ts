import { useErrorStore } from "../store";
import { getUser } from "../services/authService";

export async function customFetch(
  url: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
): ReturnType<typeof fetch> {
  const user = getUser();
  init!.headers = { ...init!.headers, Authorization: `Bearer ${user?.access_token}` };
  const res = await fetch(url, init);
  if (res.status === 401) {
    const res = await fetch("/api/auth/refresh", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    init!.headers = { ...init!.headers, Authorization: `Bearer ${data.accessToken}` };
    return fetch(url, init);
  } else if (res.status.toString().startsWith("5")) {
    useErrorStore.getState().pushError({
      message: "Serverfehler. Bitte versuchen Sie es später erneut",
      code: res.status,
    });
  }

  return fetch(url, init);
}
