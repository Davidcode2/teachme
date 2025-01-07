import { redirect } from "react-router-dom";
import { useAccessTokenStore } from "../store";
import SharedService from "../services/sharedService";

export default async function addUsernameAction({
  request,
}: {
  request: Request;
}) {
  const formData = await request.formData();
  const jsonData = SharedService.formDataToJson<{ displayName: string }>(formData);
  await fetch(`/api/users`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  });
  return redirect("/materials/add/success");
}

