import { redirect } from "react-router";
import { getUser } from "../services/authService";

export default async function addMaterialAction({
  request,
}: {
  request: Request;
}) {
  const user = getUser();
  const formData = await request.formData();
  const price = formData.get("price");
  formData.set("price", price!.toString().replace(/,/g, ""));
  await fetch("/api/materials", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user?.access_token}`,
    },
    body: formData,
  });
  return redirect("/materials/add/success");
}

