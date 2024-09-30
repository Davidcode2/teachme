import { redirect } from 'react-router-dom';
import { useLikelyHumanStore } from '../store';
import verifyCaptcha from '../services/reCaptchaService';

export default async function handleSubmit({ request }: { request: Request }) {
  await verifyCaptcha();
  if (useLikelyHumanStore.getState().isLikelyHuman === false) {
    return false;
  }
  const formData = await request.formData();
  const response = await fetch('api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(formData))
  });

  const responseData = await response.json();
  if (responseData === true) {
    return redirect('/login');
  }
  return false;
};
