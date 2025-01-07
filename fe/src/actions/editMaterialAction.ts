import SharedService from "../services/sharedService";
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
  const jsonData = SharedService.formDataToJson(formData);
  console.log(jsonData);
  const res = await fetch(`/api/materials/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  });
  return res
}
