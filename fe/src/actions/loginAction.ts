import { redirect } from 'react-router-dom';
import {
  useAccessTokenStore,
  useUserStore,
  useLikelyHumanStore,
  useAvatarStore,
} from '../store';
import verifyCaptcha from '../services/reCaptchaService';

export default async function handleSubmit({ request }: { request: Request }) {
  await verifyCaptcha();
  if (useLikelyHumanStore.getState().isLikelyHuman === false) {
    return false;
  }
  useLikelyHumanStore.setState({ isLikelyHuman: false });
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
    const avatar = getAvatar(responseData.user.id);
    const setAvatar = useAvatarStore.getState().setAvatar;
    setAvatar(avatar);
    setUser(responseData.user);
    return redirect('/materials');
  }
  return false;
}

async function getAvatar(userId: string) {
  const response = await fetch(`/api/users/avatar/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return response.blob();
}
