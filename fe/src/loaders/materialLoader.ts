import { useAccessTokenStore, useGlobalLoadingStore } from "../store";

export default async function loadMaterials(url: string) {
  useGlobalLoadingStore.setState({ loading: true });
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
      "Content-Type": "application/json",
    },
  });
  useGlobalLoadingStore.setState({ loading: false });

  const responseData = await response.json();
  return responseData;
}

export async function getTotalMaterials() {
  const response = await fetch("api/materials/total", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${useAccessTokenStore.getState().accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();
  return responseData;
}
