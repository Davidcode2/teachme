import { useAccessTokenStore } from '../store';

export default async function loadMaterials() {
  const response = await fetch('http://localhost:3000/materials', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const responseData = await response.json();
  return responseData;
}
