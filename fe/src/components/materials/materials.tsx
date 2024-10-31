import { useSearchState, useUserStore } from '../../store';
import Card from '../../components/card/card'
import Material from '../../DTOs/material'
import NoData from './noData';
import { useEffect, useRef, useState } from 'react';
import loadMaterials from '../../loaders/materialLoader';
import PaginationService from '../../services/paginationService';

type MaterialWithThumbnail = {
  material: Material,
  thumbnail: any
}

function Materials() {
  const [materials, setMaterials] = useState<MaterialWithThumbnail[]>([]);
  const [searchResults, setSearchResults] = useState<MaterialWithThumbnail[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [scrollEvent, setScrollEvent] = useState(0);
  const paginator = new PaginationService();
  const searchString = useSearchState((state) => state.searchString);
  const onMinePage = document.location.pathname === "/materials/mine";
  const user = useUserStore(state => state.user);
  const lastMaterialIndex = useRef(0);
  const slidingWindowHead = useRef(0);
  const runCount = useRef(0);

  const getUrl = () => {
    if (onMinePage) {
      return `/api/materials/user/${user.id}`;
    }
    return "api/materials";
  }

  const buildLoadMaterialsUrl = (offset: number = lastMaterialIndex.current) => {
    const baseUrl = getUrl();
    const url = `${baseUrl}?search=${searchString}&offset=${offset}&limit=${paginator.increment}`;
    return url;
  }

  const setInitialMaterials = async () => {
    const url = buildLoadMaterialsUrl();
    const json = await loadMaterials(url);
    lastMaterialIndex.current = json.length;
    setMaterials(json);
    runCount.current++;
  }

  const searchMaterials = async () => {
    if (runCount.current === 0) return;
    const url = buildLoadMaterialsUrl();
    const json = await loadMaterials(url);
    setSearchResults(json);
    setSearchResultsGlobal(json);
    if (searchString !== "" && !onMinePage) {
      const materialsWithNullThumbnail = json.map((el: Material) => { return { material: el, thumbnail: null } });
      setSearchResults(materialsWithNullThumbnail);
      return;
    }
  };

  const loadMoreMaterials = async (scrollPosition: number) => {
    if (scrollPosition === -1) {
      loadNextMaterials();
    } else if (scrollPosition === 1) {
      loadPreviousMaterials();
    }
  }

  const loadNextMaterials = async () => {
    const url = buildLoadMaterialsUrl();
    const json = await loadMaterials(url);
    const currentMaterialsLength = materials.length + json.length;
    if (currentMaterialsLength >= paginator.slidingWindowSize) {
      const shiftedMaterials = paginator.shiftMaterialsRight([...materials, ...json]);
      setMaterials(prevMaterials => [...shiftedMaterials]);
    } else {
      setMaterials(prevMaterials => [...prevMaterials, ...json]);
    }
    slidingWindowHead.current += json.length;
    lastMaterialIndex.current += json.length;
  }

  const loadPreviousMaterials = async () => {
    if (lastMaterialIndex.current >= paginator.slidingWindowSize) {
      let offset = slidingWindowHead.current - paginator.slidingWindowSize;
      offset = offset < paginator.increment && offset > 0 ? 0 : offset;
      if (offset < 0) return;
      const url = buildLoadMaterialsUrl(offset > 0 ? offset : 0);
      const json = await loadMaterials(url);
      const currentMaterialsLength = materials.length + json.length;
      if (currentMaterialsLength >= paginator.slidingWindowSize) {
        const shiftedMaterials = paginator.shiftMaterialsLeft([...json, ...materials]);
        setMaterials(prevMaterials => [...shiftedMaterials]);
        lastMaterialIndex.current -= json.length;
      } else {
        setMaterials(prevMaterials => [...json, ...prevMaterials]);
      }
      slidingWindowHead.current -= json.length;
    }
  }

  const setSearchResultsGlobal = (materials: MaterialWithThumbnail[]) => {
    console.log(materials);
    if (materials.length === 0) {
      useSearchState.setState({ searchResults: [] });
      return;
    }
    const hasThumbnail = materials[0].thumbnail;
    let materialsWithoutThumbnails;
    if (hasThumbnail) {
      materialsWithoutThumbnails = materials.map((el: { material: Material, thumbnail: any }) => { return el.material; });
      useSearchState.setState({ searchResults: materialsWithoutThumbnails });
    } else {
      useSearchState.setState({ searchResults: materials });
    }
    useSearchState.setState({ searchResults: materials });
  }

  const scrollEventSetter = (x: number) => {
    setScrollEvent(x);
  }

  useEffect(() => {
    if (!isFetching && scrollEvent !== 0) {
      setIsFetching(true);
      loadMoreMaterials(scrollEvent);
      setIsFetching(false);
    }
  }, [scrollEvent]);

  useEffect(() => {
    setInitialMaterials();
  }, []);

  useEffect(() => {
    searchMaterials();
  }, [searchString]);

  useEffect(() => {
    const onScroll = paginator.handleScroll(scrollEventSetter);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (materials.length === 0) {
    return (
      <>
        <NoData />
      </>
    );
  }

  return (
    <>
      {
        searchResults.length > 0 ?
          searchResults.map((el: MaterialWithThumbnail) => {
            return <Card key={el.material.id} material={el} />
          })
          :
          materials.map((el: MaterialWithThumbnail) => {
            return <Card key={el.material.id} material={el}></Card>
          })
      }
    </>
  )
}

export default Materials
