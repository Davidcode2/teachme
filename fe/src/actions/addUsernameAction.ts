import { useErrorStore, useUserStore } from "../store";
import { customFetch } from "./customFetch";

export default async function addUsernameAction({
  request,
}: {
  request: Request;
}) {
  const formData = await request.formData();
  const username = JSON.stringify({ displayName: formData.get("displayName") });
  useUserStore.getState().setUser(username);
  const res = await customFetch(`/api/users`, {
    method: "PATCH",
    body: username 
  });

  if (!res.ok) {
    useErrorStore
      .getState()
      .pushError({ code: res.status, message: res.statusText });
  }
}
