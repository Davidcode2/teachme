import { redirect } from "react-router-dom";
import { useAccessTokenStore, useUserStore } from "../store";

export default async function addUsernameAction({
  request,
}: {
  request: Request;
}) {
  const formData = await request.formData();
  const userId = useUserStore.getState().user!.id;
  const jsonData = formDataToJson<{ displayName: string }>(formData);
  await fetch(`/api/users/${userId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  });
  return redirect("/materials/add/success");
}

function formDataToJson<T extends Record<string, any>>(formData: FormData): T {
  const obj: Record<string, any> = {};
  formData.forEach((value, key) => {
    if (obj[key]) {
      // If the key already exists, convert it to an array or push the value
      obj[key] = Array.isArray(obj[key]) ? [...obj[key], value] : [obj[key], value];
    } else {
      obj[key] = value;
    }
  });
  return obj as T;
}
