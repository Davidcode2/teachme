import { customFetch } from "./customFetch";
import { useUserStore } from "../store";
import { handleActionError, getRequiredFormField } from "../utils/actionUtils";

export default async function addUsernameAction({
  request,
}: {
  request: Request;
}) {
  try {
    const formData = await request.formData();
    
    // Get and validate displayName
    const displayName = getRequiredFormField(formData, "displayName");
    const username = JSON.stringify({ displayName });
    
    // Update local store
    useUserStore.getState().setUser(username);
    
    const response = await customFetch(`/api/users`, {
      method: "PATCH",
      body: username,
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw response;
    }

    return response;
  } catch (error) {
    handleActionError(error, "Fehler beim Speichern des Benutzernamens");
    return { error: true };
  }
}
