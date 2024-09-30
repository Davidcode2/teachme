import { redirect } from 'react-router-dom';
import {
  useAccessTokenStore,
  useUserStore,
  useLikelyHumanStore,
} from '../store';
import verifyCaptcha from '../services/reCaptchaService';

export default async function handleSubmit({ request }: { request: Request }) {
  await verifyCaptcha();
  if (useLikelyHumanStore.getState().isLikelyHuman === false) {
    return false;
  }
  const formData = await request.formData();
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      withCredentials: 'true',
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const responseData = await response.json();
  if (JSON.stringify(responseData).includes('accessToken')) {
    const setAccessToken = useAccessTokenStore.getState().setAccessToken;
    setAccessToken(responseData.tokens.accessToken);
    const setUser = useUserStore.getState().setUser;
    setUser(responseData.user);
    return redirect('/materials');
  }
  return false;
}
