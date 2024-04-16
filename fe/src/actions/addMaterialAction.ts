import { redirect } from "react-router-dom";
import { useAccessTokenStore } from "../store";

export default async function addMaterialAction({request}: { request: Request }) {
  const formData = await request.formData();
  await fetch('/api/materials', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
    },
    body: formData,
  });
  return redirect("/materials");
}

