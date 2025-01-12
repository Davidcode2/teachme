import { useGlobalLoadingStore } from "../../store";
import Card from "../../components/card/card";
import Material from "../../DTOs/material";
import NoData from "./noData";
import { useEffect, useState } from "react";
import loadMaterials, { getTotalMaterials } from "../../loaders/materialLoader";
import Skeleton from "../card/skeleton";
import Paginator from "../paginator";

type MaterialWithThumbnail = {
  material: Material;
  thumbnail: any;
};

function Materials() {
  const [materials, setMaterials] = useState<MaterialWithThumbnail[]>([]);
  const loading = useGlobalLoadingStore((state) => state.loading);
  const onMinePage = document.location.pathname === "/materials/mine";
  const [page, setPage] = useState(0);
  const pageSize = 2;
  const [totalPages, setTotalPages] = useState(0);

  const getUrl = () => {
    if (onMinePage) {
      return `/api/materials/own`;
    }
    return "api/materials";
  };

  const getTotalPages = async () => {
    const totalMaterialsCount = await getTotalMaterials();
    const totalPages = Math.ceil(totalMaterialsCount / pageSize);
    setTotalPages(totalPages);
  };

  const buildPaginatedMaterialsUrl = (page: number = 0, pageSize: number) => {
    const baseUrl = getUrl();
    const url = `${baseUrl}/?page=${page}&pageSize=${pageSize}`;
    return url;
  };

  const setPaginatedMaterials = async (page: number, pageSize: number) => {
    const url = buildPaginatedMaterialsUrl(page, pageSize);
    const json = await loadMaterials(url);
    setMaterials(json);
  };

  useEffect(() => {
    setPaginatedMaterials(page, pageSize);
  }, [page, pageSize]);

  useEffect(() => {
    getTotalPages();
  }, []);

  if (!loading && materials.length === 0) {
    return (
      <>
        <NoData />
      </>
    );
  }

  return (
    <>
      {loading && (
        <div className="mx-10 mt-4 flex flex-col gap-10">
          <Skeleton id={crypto.randomUUID()} />
          <Skeleton id={crypto.randomUUID()} />
        </div>
      )}
      {materials.map((el: MaterialWithThumbnail) => {
        return <Card key={el.material.id} material={el}></Card>;
      })}
      <Paginator setPage={setPage} page={page} totalPages={totalPages} />
    </>
  );
}

export default Materials;
