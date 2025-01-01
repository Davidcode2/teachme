import { useUserStore, useGlobalLoadingStore } from "../../store";
import Card from "../../components/card/card";
import Material from "../../DTOs/material";
import NoData from "./noData";
import { useEffect, useRef, useState } from "react";
import loadMaterials from "../../loaders/materialLoader";
import PaginationService from "../../services/paginationService";
import Skeleton from "../card/skeleton";
import useDebouncedValue from "../../hooks/useDebouncedValue";

type MaterialWithThumbnail = {
  material: Material;
  thumbnail: any;
};

function Materials() {
  const [materials, setMaterials] = useState<MaterialWithThumbnail[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [scrollEvent, setScrollEvent] = useState(0);
  const loading = useGlobalLoadingStore((state) => state.loading);
  const paginator = new PaginationService();
  const onMinePage = document.location.pathname === "/materials/mine";
  const user = useUserStore((state) => state.user);
  const lastMaterialIndex = useRef(0);
  const slidingWindowHead = useRef(0);
  const runCount = useRef(0);
  const debouncedScrollEvent = useDebouncedValue(scrollEvent, 100);

  const getUrl = () => {
    if (onMinePage) {
      return `/api/materials/user/${user.id}`;
    }
    return "api/materials";
  };

  const buildLoadMaterialsUrl = (
    offset: number = lastMaterialIndex.current,
  ) => {
    const baseUrl = getUrl();
    const url = `${baseUrl}?offset=${offset}&limit=${paginator.increment}`;
    return url;
  };

  const setInitialMaterials = async () => {
    const url = buildLoadMaterialsUrl();
    const json = await loadMaterials(url);
    lastMaterialIndex.current = json.length;
    setMaterials(json);
    runCount.current++;
  };

  const loadMoreMaterials = async (scrollPosition: number) => {
    if (scrollPosition === -1) {
      loadNextMaterials();
    } else if (scrollPosition === 1) {
      loadPreviousMaterials();
    }
  };

  const loadNextMaterials = async () => {
    const url = buildLoadMaterialsUrl();
    const json = await loadMaterials(url);
    const currentMaterialsLength = materials.length + json.length;
    if (currentMaterialsLength >= paginator.slidingWindowSize) {
      const shiftedMaterials = paginator.shiftMaterialsRight([
        ...materials,
        ...json,
      ]);
      setMaterials((_) => [...shiftedMaterials]);
    } else {
      setMaterials((prevMaterials) => [...prevMaterials, ...json]);
    }
    slidingWindowHead.current += json.length;
    lastMaterialIndex.current += json.length;
  };

  const loadPreviousMaterials = async () => {
    if (lastMaterialIndex.current >= paginator.slidingWindowSize) {
      let offset = slidingWindowHead.current - paginator.slidingWindowSize;
      offset = offset < paginator.increment && offset > 0 ? 0 : offset;
      if (offset < 0) return;
      const url = buildLoadMaterialsUrl(offset > 0 ? offset : 0);
      const json = await loadMaterials(url);
      const currentMaterialsLength = materials.length + json.length;
      if (currentMaterialsLength >= paginator.slidingWindowSize) {
        const shiftedMaterials = paginator.shiftMaterialsLeft([
          ...json,
          ...materials,
        ]);
        setMaterials((_) => [...shiftedMaterials]);
        lastMaterialIndex.current -= json.length;
      } else {
        setMaterials((prevMaterials) => [...json, ...prevMaterials]);
      }
      slidingWindowHead.current -= json.length;
    }
  };

  const scrollEventSetter = (x: number) => {
    setScrollEvent(x);
  };

  useEffect(() => {
    const execute = async () => {
      if (!isFetching && debouncedScrollEvent !== 0) {
        setIsFetching(true);
        await loadMoreMaterials(debouncedScrollEvent);
        setIsFetching(false);
      }
    };
    execute();
  }, [debouncedScrollEvent]);

  useEffect(() => {
    setInitialMaterials();
  }, []);

  useEffect(() => {
    const onScroll = paginator.handleScroll(scrollEventSetter);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
    </>
  );
}

export default Materials;
