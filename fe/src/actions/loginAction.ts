import { redirect } from 'react-router-dom';
import {
  useAccessTokenStore,
  useUserStore,
  useLikelyHumanStore,
  useAvatarStore,
} from '../store';
import verifyCaptcha from '../services/reCaptchaService';

export default async function handleSubmit({ request }: { request: Request }) {
  if (!checkCaptchaAndResetLikelyHumanStore()) return false;
  const response = await fetchLogin(request);

  if (JSON.stringify(response).includes('accessToken')) {
    const setAccessToken = useAccessTokenStore.getState().setAccessToken;
    setAccessToken(response.tokens.accessToken);
    setUserAndAvatar(response);
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

async function setUserAndAvatar(responseData: any) {
  const setUser = useUserStore.getState().setUser;
  const avatar = await getAvatar(responseData.user.id);
  const setAvatar = useAvatarStore.getState().setAvatar;
  setAvatar(avatar);
  setUser(responseData.user);
} 

async function checkCaptchaAndResetLikelyHumanStore() {
  await verifyCaptcha();
  if (useLikelyHumanStore.getState().isLikelyHuman === false) {
    return false;
  }
  // reset for next verification
  useLikelyHumanStore.setState({ isLikelyHuman: false });
  return true;
}

async function fetchLogin(request: Request) {
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
  return responseData;
}
