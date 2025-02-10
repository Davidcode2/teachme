import { customFetch } from "../actions/customFetch";
import { getUser } from "../services/authService";
import { useGlobalLoadingStore } from "../store";

export default async function loadMaterials(url: string) {
  useGlobalLoadingStore.setState({ loading: true });
  const user = getUser();
  console.log("user", user);
  const response = await customFetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${user?.access_token}`,
      "Content-Type": "application/json",
    },
  });
  useGlobalLoadingStore.setState({ loading: false });

  const responseData = await response.json();
  return responseData;
}

export async function getTotalMaterials() {
  const user = getUser();
  const response = await customFetch("api/materials/total", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${user?.access_token}`,
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();
  return responseData;
}
