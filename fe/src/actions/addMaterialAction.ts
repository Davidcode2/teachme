import { redirect } from "react-router-dom";
import { useAccessTokenStore, useUserStore } from "../store";

type User = {
  firstName: string,
  lastName: string,
  email: string,
  signUpDate: Date,
}

export default async function addMaterialAction({request}) {
  const formData = await request.formData();
  const user = useUserStore.getState().user 
  const material = { ...Object.fromEntries(formData) };
  const body = { user, material };
  const response = await fetch('/api/materials', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });
  return redirect("/materials");
}

