import { getUser } from "../services/authService";

export default async function loadMyMaterials() {
  const user = getUser();
  if (!user) {
    return [];
  }
  
  try {
    const response = await fetch(`/api/users/${user.profile.sub}/materials`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.access_token}`,
        "Content-Type": "application/json",
      },
    });
    
    // Check if response is OK before parsing
    if (!response.ok) {
      console.error(`Failed to load my materials: ${response.status} ${response.statusText}`);
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
    console.error("Error loading my materials:", error);
    return [];
  }
}
