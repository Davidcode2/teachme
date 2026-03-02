export default async function sharedPreviewLoader(id: string | undefined) {
  if (!id) {
    return null;
  }
  
  try {
    const response = await fetch(`/api/materials/${id}/preview`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    // Check if response is OK before parsing
    if (!response.ok) {
      console.error(`Failed to load preview: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error loading preview:", error);
    return null;
  }
}
