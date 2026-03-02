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
  const loading = useGlobalLoadingStore((state) => state.loading);
  const paginator = new PaginationService();
  const searchString = useSearchState((state) => state.searchString);
  const searchResults = useSearchState((state) => state.searchResults);
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
    try {
      const url = buildLoadMaterialsUrl();
      const json = await loadMaterials(url);
      
      // Ensure json is an array
      const safeJson = Array.isArray(json) ? json : [];
      lastMaterialIndex.current = safeJson.length;
      setMaterials(safeJson);
      runCount.current++;
    } catch (error) {
      console.error("Failed to load initial materials:", error);
      setMaterials([]);
    }
  };

  const searchMaterials = async () => {
    if (runCount.current === 0) return;
    try {
      const url = buildLoadMaterialsUrl();
      const json = await loadMaterials(url);
      
      // Ensure json is an array
      const safeJson = Array.isArray(json) ? json : [];
      setSearchResultsGlobal(safeJson);
      setMaterials(safeJson);
    } catch (error) {
      console.error("Failed to search materials:", error);
      setMaterials([]);
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
    setInitialMaterials();
  }, []);

  useEffect(() => {
    searchMaterials();
  }, [searchString]);

  // Ensure materials is always an array
  const safeMaterials = Array.isArray(materials) ? materials : [];
  const safeSearchResults = Array.isArray(searchResults) ? searchResults : [];

  // Helper to get material from either Material or MaterialWithThumbnail
  const getMaterial = (el: any): Material => {
    return el.material || el;
  };

  if (!loading && safeMaterials.length === 0 && safeSearchResults.length === 0) {
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
      {safeSearchResults.length > 0
        ? safeSearchResults.map((el: any) => {
            const material = getMaterial(el);
            return <Card key={material.id} material={material} />;
          })
        : safeMaterials.map((el: Material) => {
            return <Card key={el.id} material={el}></Card>;
          })}
    </>
  );
}

export default MyMaterials;
