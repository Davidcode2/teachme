import { customFetch } from "../actions/customFetch";
import { useGlobalLoadingStore } from "../store";

export default async function loadMaterials(url: string) {
  useGlobalLoadingStore.setState({ loading: true });
  const response = await customFetch(url, {
    method: "GET",
  });
  useGlobalLoadingStore.setState({ loading: false });

  const responseData = await response.json();
  return responseData;
}

export async function getTotalMaterials() {
  const response = await customFetch("api/materials/total", {
    method: "GET",
  });

  const responseData = await response.json();
  return responseData;
}
