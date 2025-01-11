import { redirect } from "react-router";
import { useAccessTokenStore } from "../store";

export default async function addMaterialAction({
  request,
}: {
  request: Request;
}) {
  const formData = await request.formData();
  const price = formData.get("price");
  formData.set("price", price!.toString().replace(/,/g, ""));
  await fetch("/api/materials", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
    },
    body: formData,
  });
  return redirect("/materials/add/success");
}
