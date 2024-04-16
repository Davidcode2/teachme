import { redirect } from 'react-router-dom';

export default async function handleSubmit({ request }: { request: Request }) {
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
