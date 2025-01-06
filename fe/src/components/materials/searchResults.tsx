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
  const [searchResults, setSearchResults] = useState<MaterialWithThumbnail[]>(
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

  const setSearchResultsGlobal = (materials: MaterialWithThumbnail[]) => {
    console.log(materials);
    if (materials.length === 0) {
      useSearchState.setState({ searchResults: [] });
      return;
    }
    const hasThumbnail = materials[0].thumbnail;
    let materialsWithoutThumbnails;
    if (hasThumbnail) {
      materialsWithoutThumbnails = materials.map(
        (el: { material: Material; thumbnail: any }) => {
          return el.material;
        },
      );
      useSearchState.setState({ searchResults: materialsWithoutThumbnails });
    } else {
      useSearchState.setState({ searchResults: materials });
    }
    useSearchState.setState({ searchResults: materials });
  };

  useEffect(() => {
    console.log(searchString);
    searchMaterials();
  }, [searchString]);

  if (searchResults.length === 0) {
    return <NoData />;
  }

  return (
    <>
      {searchResults.map((el: MaterialWithThumbnail) => {
        return <Card key={el.material.id} material={el} />;
      })}
    </>
  );
}

export default SearchResults;
