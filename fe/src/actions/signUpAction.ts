import { redirect } from 'react-router-dom';

export async function handleSubmit({ request }) {
  const formData = await request.formData();
  const response = await fetch('http://localhost:3000/auth/signup', {
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
