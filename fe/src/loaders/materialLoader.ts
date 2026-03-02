import Material from "../DTOs/material";
import { createArrayLoader, loadData } from "../utils/loaderUtils";

/**
 * Load materials from API
 */
export const loadMaterials = createArrayLoader<Material>(
  "Fehler beim Laden der Materialien"
);

/**
 * Get total count of materials
 */
export async function getTotalMaterials(): Promise<number> {
  return loadData<number>({
    url: "api/materials/total",
    validate: (data): data is number => typeof data === "number",
    defaultValue: 0,
    errorMessage: "Fehler beim Laden der Gesamtzahl",
  });
}

export default loadMaterials;
