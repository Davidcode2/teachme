import { redirect } from "react-router";
import { useAccessTokenStore, useErrorStore } from "../store";

export default async function editMaterialAction({
  request,
}: {
  request: Request;
}) {
  console.log(request);
  const formData = await request.formData();
  const price = formData.get("price");
  const id = formData.get("id");
  formData.set("price", price!.toString().replace(/,/g, ""));
  const res = await fetch(`/api/materials/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
    },
    body: formData,
  });
  
  if (!res.ok) {
    useErrorStore.getState().pushError({code: res.status,  message: res.statusText});
  }

  return redirect("/materials");
}
