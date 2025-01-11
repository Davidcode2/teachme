import { redirect } from "react-router-dom";
import { useAccessTokenStore } from "../store";

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
  await fetch(`/api/materials/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
    },
    body: formData,
  });

  return redirect("/materials");
}
