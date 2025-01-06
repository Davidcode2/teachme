import {
  useSearchState,
  useGlobalLoadingStore,
} from "../../store";
import Card from "../../components/card/card";
import Material from "../../DTOs/material";
import NoData from "../materials/noData";
import { useEffect, useState } from "react";
import loadMaterials from "../../loaders/materialLoader";
import Skeleton from "../card/skeleton";

type MaterialWithThumbnail = {
  material: Material;
  thumbnail: any;
};

export default function Workspace() {
  const [materials, setMaterials] = useState<MaterialWithThumbnail[]>([]);
  const searchString = useSearchState((state) => state.searchString);
  const loading = useGlobalLoadingStore((state) => state.loading);

  const searchMaterials = async () => {
    const baseUrl = getUrl();
    const url = `${baseUrl}?search=${searchString}`;
    const json = await loadMaterials(url);
    setSearchResults(json);
    if (searchString !== "") {
      const materialsWithNullThumbnail = json.map((el: Material) => {
        return { material: el, thumbnail: null };
      });
      setMaterials(materialsWithNullThumbnail);
      return;
    }
    setMaterials(json);
  };

  const setSearchResults = (materials: any) => {
    if (materials.length === 0) {
      useSearchState.setState({ searchResults: [] });
      return;
    }
    const hasThumbnail = materials[0].thumbnail;
    if (hasThumbnail) {
      materials = materials.map(
        (el: { material: Material; thumbnail: any }) => {
          return el.material;
        },
      );
      useSearchState.setState({ searchResults: materials });
    } else {
      useSearchState.setState({ searchResults: materials });
    }
  };

  const getUrl = () => {
    return `/api/materials/by-user`;
  };

  useEffect(() => {
    searchMaterials();
  }, [searchString]);

  if (!loading && materials.length === 0) {
    return (
      <>
        <NoData message="Werde Autor!" />
      </>
    );
  }

  return (
    <>
      {loading && (
        <div className="m-4 flex flex-col gap-10 md:mx-10 md:mb-10">
          <Skeleton id={crypto.randomUUID()} />
          <Skeleton id={crypto.randomUUID()} />
        </div>
      )}
      <div>
        {materials.map((el: MaterialWithThumbnail) => {
          return <Card key={el.material.id} material={el}></Card>;
        })}
      </div>
    </>
  );
}
