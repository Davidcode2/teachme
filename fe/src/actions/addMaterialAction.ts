import { redirect } from "react-router-dom";
import { useAccessTokenStore, useUserStore } from "../store";

export default async function addMaterialAction({request}: { request: Request }) {
  const formData = await request.formData();
  formData.append('userId', useUserStore.getState().user.id);
  await fetch('/api/materials', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
    },
    body: formData,
  });
  return redirect("/materials");
}

