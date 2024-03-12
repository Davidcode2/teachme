import { redirect } from "react-router-dom";
import { useAccessTokenStore, useUserStore } from '../store';

export default async function handleSubmit({ request }) {
  const formData = await request.formData();
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(formData))
  });

  const responseData = await response.json();
  if (JSON.stringify(responseData).includes("access_token")) {
    const setAccessToken = useAccessTokenStore.getState().setAccessToken;
    setAccessToken(responseData.access_token);
    const setUser = useUserStore.getState().setUser;
    setUser(responseData.user);
    console.log(responseData.user);
    return redirect('/materials');
  }
  return false;
};
