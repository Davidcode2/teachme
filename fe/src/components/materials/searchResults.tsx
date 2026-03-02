import { useSearchState } from "../../store";
import Card from "../../components/card/card";
import Material from "../../DTOs/material";
import NoData from "./noData";
import { useEffect, useState } from "react";
import loadMaterials from "../../loaders/materialLoader";

type MaterialWithThumbnail = {
  material: Material;
  thumbnail: any;
};

function SearchResults() {
  const [searchResults, setSearchResults] = useState<Material[]>(
    [],
  );
  const searchString = useSearchState((state) => state.searchString);
  const onMinePage = document.location.pathname === "/materials/mine";

  const getUrl = () => {
    if (onMinePage) {
      return `/api/materials/own`;
    }
    return "api/materials";
  };

  const buildLoadMaterialsUrl = () => {
    const baseUrl = getUrl();
    const url = `${baseUrl}?search=${searchString}`;
    return url;
  };

  const searchMaterials = async () => {
    if (searchString !== "") {
      const url = buildLoadMaterialsUrl();
      const json = await loadMaterials(url);
      setSearchResultsGlobal(json);
      setSearchResults(json);
      return;
    }
  };

  const setSearchResultsGlobal = (materials: Material[] | MaterialWithThumbnail[]) => {
    if (materials.length === 0) {
      useSearchState.setState({ searchResults: [] });
      return;
    }
    // Check if materials have thumbnail property (MaterialWithThumbnail)
    const firstItem = materials[0];
    if ('thumbnail' in firstItem && 'material' in firstItem) {
      // It's MaterialWithThumbnail[], extract the material
      const materialsWithoutThumbnails = (materials as MaterialWithThumbnail[]).map(
        (el) => el.material,
      );
      useSearchState.setState({ searchResults: materialsWithoutThumbnails });
    } else {
      // It's Material[]
      useSearchState.setState({ searchResults: materials as Material[] });
    }
  };

  useEffect(() => {
    searchMaterials();
  }, [searchString]);

  if (searchResults.length === 0) {
    return <NoData />;
  }

  return (
    <>
      {searchResults.map((el: Material) => {
        return <Card key={el.id} material={el} />;
      })}
    </>
  );
}

export default SearchResults;
