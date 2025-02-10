import { customFetch } from "../actions/customFetch";
import { getUser } from "../services/authService";

export default async function loadMyMaterials() {
  const user = getUser();
  if (!user) {
    return [];
  }
  const response = await fetch(`/api/users/${user.profile.sub}/materials`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${user.access_token}`,
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();
  return responseData;
}
