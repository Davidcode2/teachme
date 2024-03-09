import { useAccessTokenStore } from '../store';

export default async function loadMyMaterials() {
  const response = await fetch('http://localhost:3000/materials/mine', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const responseData = await response.json();
  return responseData;
}
