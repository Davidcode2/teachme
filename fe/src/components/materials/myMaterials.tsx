import {
  useSearchState,
  useGlobalLoadingStore,
} from "../../store";
import Card from "../../components/card/card";
import Material from "../../DTOs/material";
import NoData from "./noData";
import { useEffect, useRef, useState } from "react";
import loadMaterials from "../../loaders/materialLoader";
import PaginationService from "../../services/paginationService";
import Skeleton from "../card/skeleton";

type MaterialWithThumbnail = {
  material: Material;
  thumbnail: any;
};

function MyMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchResults, setSearchResults] = useState<Material[]>(
    [],
  );
  const loading = useGlobalLoadingStore((state) => state.loading);
  const paginator = new PaginationService();
  const searchString = useSearchState((state) => state.searchString);
  const onMinePage = document.location.pathname === "/materials/mine" || document.location.pathname === "/materials/mine/bought";
  const lastMaterialIndex = useRef(0);
  const runCount = useRef(0);

  const getUrl = () => {
    if (onMinePage) {
      return `/api/materials/own`;
    }
    return "api/materials";
  };

  const buildLoadMaterialsUrl = (
    offset: number = lastMaterialIndex.current,
  ) => {
    const baseUrl = getUrl();
    const url = `${baseUrl}?search=${searchString}&offset=${offset}&limit=${paginator.increment}`;
    return url;
  };

  const setInitialMaterials = async () => {
    const url = buildLoadMaterialsUrl();
    const json = await loadMaterials(url);
    lastMaterialIndex.current = json.length;
    setMaterials(json);
    runCount.current++;
  };

  const searchMaterials = async () => {
    if (runCount.current === 0) return;
    const url = buildLoadMaterialsUrl();
    const json = await loadMaterials(url);
    setSearchResultsGlobal(json);
    if (searchString !== "" && !onMinePage) {
      const materialsWithNullThumbnail = json.map((el: Material) => {
        return { material: el, thumbnail: null };
      });
      setSearchResults(materialsWithNullThumbnail);
      return;
    } else {
      const url = buildLoadMaterialsUrl();
      const json = await loadMaterials(url);
      setMaterials(json);
    }
  };

  const setSearchResultsGlobal = (materials: MaterialWithThumbnail[]) => {
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
    setInitialMaterials();
  }, []);

  useEffect(() => {
    searchMaterials();
  }, [searchString]);

  if (!loading && materials.length === 0) {
    return (
      <>
        <NoData showImage={true} />
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
      {searchResults.length > 0
        ? searchResults.map((el: Material) => {
            return <Card key={el.id} material={el} />;
          })
        : materials.map((el: Material) => {
            return <Card key={el.id} material={el}></Card>;
          })}
    </>
  );
}

export default MyMaterials;
