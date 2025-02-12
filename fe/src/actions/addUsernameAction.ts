import { useAccessTokenStore, useErrorStore, useUserStore } from "../store";
import SharedService from "../services/sharedService";
import { customFetch } from "./customFetch";

export default async function addUsernameAction({
  request,
}: {
  request: Request;
}) {
  const formData = await request.formData();
  useUserStore.getState().setUser({ displayName: formData.get("displayName") });
  const jsonData = SharedService.formDataToJson<{ displayName: string }>(
    formData,
  );
  const res = await customFetch(`/api/users`, {
    method: "PATCH",
    body: JSON.stringify(jsonData),
  });

  if (!res.ok) {
    useErrorStore
      .getState()
      .pushError({ code: res.status, message: res.statusText });
  }
  return await res.json();
}
