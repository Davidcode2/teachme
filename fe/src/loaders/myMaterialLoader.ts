import { useAccessTokenStore } from '../store';
import { useUserStore } from '../store';

export default async function loadMyMaterials() {
  const user = useUserStore.getState().user;
  console.log(user);
  const response = await fetch(`/api/users/${user.id}/materials`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const responseData = await response.json();
  console.log(responseData);
  return responseData;
}
