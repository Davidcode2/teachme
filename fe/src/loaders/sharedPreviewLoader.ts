export default async function sharedPreviewLoader(id: string | undefined) {
  const response = await fetch(`/api/materials/${id}/preview`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();
  return responseData;
}
