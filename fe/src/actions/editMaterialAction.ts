import { redirect } from "react-router";
import { useErrorStore } from "../store";
import { customFetch } from "./customFetch";

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
  const res = await customFetch(`/api/materials/${id}`, {
    method: "PATCH",
    body: formData,
  });
  
  if (!res.ok) {
    useErrorStore.getState().pushError({code: res.status,  message: res.statusText});
  }

  return redirect("/materials");
}
