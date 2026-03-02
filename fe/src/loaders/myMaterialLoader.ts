import Material from "../DTOs/material";
import { getUser } from "../services/authService";
import { loadData } from "../utils/loaderUtils";

/**
 * Load materials owned by the current user
 */
export default async function loadMyMaterials(): Promise<Material[]> {
  const user = getUser();
  if (!user) {
    return [];
  }

  return loadData<Material[]>({
    url: `/api/users/${user.profile.sub}/materials`,
    validate: (data): data is Material[] => Array.isArray(data),
    defaultValue: [],
    errorMessage: "Fehler beim Laden meiner Materialien",
  });
}
