import { customFetch } from "../actions/customFetch";
import { useGlobalLoadingStore } from "../store";

export default async function loadMaterials(url: string) {
  useGlobalLoadingStore.setState({ loading: true });
  try {
    const response = await customFetch(url, {
      method: "GET",
    });
    
    // Check if response is OK before parsing
    if (!response.ok) {
      console.error(`Failed to load materials: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const responseData = await response.json();
    
    // Validate that response is an array
    if (!Array.isArray(responseData)) {
      console.error("Invalid response format: expected array, got", typeof responseData);
      return [];
    }
    
    return responseData;
  } catch (error) {
    console.error("Error loading materials:", error);
    return [];
  } finally {
    useGlobalLoadingStore.setState({ loading: false });
  }
}

export async function getTotalMaterials() {
  try {
    const response = await customFetch("api/materials/total", {
      method: "GET",
    });
    
    // Check if response is OK before parsing
    if (!response.ok) {
      console.error(`Failed to get total materials: ${response.status} ${response.statusText}`);
      return 0;
    }
    
    const responseData = await response.json();
    
    // Validate that response is a number
    if (typeof responseData !== 'number') {
      console.error("Invalid response format: expected number, got", typeof responseData);
      return 0;
    }
    
    return responseData;
  } catch (error) {
    console.error("Error getting total materials:", error);
    return 0;
  }
}
