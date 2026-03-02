import { createObjectLoader } from "../utils/loaderUtils";

export default async function sharedPreviewLoader(id: string | undefined) {
  if (!id) {
    return null;
  }

  const loader = createObjectLoader<unknown>("Fehler beim Laden der Vorschau");
  return loader(`/api/materials/${id}/preview`);
}
