import { redirect } from "react-router";
import { useAccessTokenStore, useErrorStore, useUserStore } from "../store";
import SharedService from "../services/sharedService";

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
  const res = await fetch(`/api/users`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  });

  if (!res.ok) {
    useErrorStore
      .getState()
      .pushError({ code: res.status, message: res.statusText });
  }
  return await res.json();
}
