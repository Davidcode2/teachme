import { redirect } from "react-router";
import { customFetch } from "./customFetch";
import { formatPrice, handleActionError } from "../utils/actionUtils";

export default async function addMaterialAction({
  request,
}: {
  request: Request;
}) {
  try {
    const formData = await request.formData();
    
    // Format price before sending to API
    const price = formData.get("price");
    formData.set("price", formatPrice(price));
    
    const response = await customFetch("/api/materials", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw response;
    }

    return redirect("/materials/add/success");
  } catch (error) {
    handleActionError(error, "Fehler beim Erstellen des Materials");
    return { error: true };
  }
}
