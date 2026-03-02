import { redirect } from "react-router";
import { customFetch } from "./customFetch";
import { formatPrice, handleActionError, getRequiredFormField } from "../utils/actionUtils";

export default async function editMaterialAction({
  request,
}: {
  request: Request;
}) {
  try {
    const formData = await request.formData();
    
    // Get required fields
    const id = getRequiredFormField(formData, "id");
    
    // Format price before sending to API
    const price = formData.get("price");
    formData.set("price", formatPrice(price));
    
    const response = await customFetch(`/api/materials/${id}`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      throw response;
    }

    return redirect("/materials");
  } catch (error) {
    handleActionError(error, "Fehler beim Aktualisieren des Materials");
    return { error: true };
  }
}
