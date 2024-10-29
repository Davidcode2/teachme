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
  const [isFetching, setIsFetching] = useState(false);
  const [scrollEvent, setScrollEvent] = useState(0);
  const paginator = new PaginationService();
  const searchString = useSearchState((state) => state.searchString);
  const onMinePage = document.location.pathname === "/materials/mine";
  const user = useUserStore(state => state.user);
  const lastMaterialIndex = useRef(0);
  const slidingWindowHead = useRef(0);


  const searchMaterials = async () => {
    const url = buildLoadMaterialsUrl();
    const json = await loadMaterials(url);
    setSearchResults(json);
    if (searchString !== "" && !onMinePage) {
      const materialsWithNullThumbnail = json.map((el: Material) => { return { material: el, thumbnail: null } });
      setMaterials(materialsWithNullThumbnail);
      return;
    }
    setMaterials(json);
    lastMaterialIndex.current = json.length;
    console.log("setting materials", json.length);
    return;
  };

  const buildLoadMaterialsUrl = (offset: number = lastMaterialIndex.current) => {
    const baseUrl = getUrl();
    const url = `${baseUrl}?search=${searchString}&offset=${offset}&limit=${paginator.increment}`;
    return url;
  }

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
      if (materials.length + json.length >= paginator.slidingWindowSize) {
        const shiftedMaterials = paginator.shiftMaterialsRight([...materials, ...json]);
        setMaterials(prevMaterials => [...shiftedMaterials]);
      } else {
        setMaterials(prevMaterials => [...prevMaterials, ...json]);
      }
      slidingWindowHead.current += json.length;
      lastMaterialIndex.current += json.length;
      console.log("setting materials add", json.length);
  }

  const loadPreviousMaterials = async () => {
      if (lastMaterialIndex.current >= paginator.slidingWindowSize) {
        let offset = slidingWindowHead.current - paginator.slidingWindowSize;
        console.log("offset", offset);
        if (offset < paginator.increment && offset > 0 ) {
          offset = 0;
        }
        if (offset < 0) {
          return;
        }
        const url = buildLoadMaterialsUrl(offset > 0 ? offset : 0);
        const json = await loadMaterials(url);
        if (json.length + materials.length >= paginator.slidingWindowSize) {
          console.log("shifting materials left");
          const shiftedMaterials = paginator.shiftMaterialsLeft([...json, ...materials]);
          setMaterials(prevMaterials => [...shiftedMaterials]);
          lastMaterialIndex.current -= json.length;
        } else {
          setMaterials(prevMaterials => [...json, ...prevMaterials]);
        }
        slidingWindowHead.current -= json.length;
      }

  }

  const setSearchResults = (materials: MaterialWithThumbnail[]) => {
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
  }

  const getUrl = () => {
    if (onMinePage) {
      return `/api/materials/user/${user.id}`;
    }
    return "api/materials";
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
    searchMaterials();
    console.log("searching materials");
    const onScroll = paginator.handleScroll(scrollEventSetter);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [searchString]);

  if (materials.length === 0) {
    return (
      <>
        <NoData />
      </>
    );
  }

  return (
    <>
      <div className="flex">
        <div className="relative">
          <div className="p-8 sticky top-20">{materials.length}</div>
        </div>
        <div>
          {
            materials.map((el: MaterialWithThumbnail) => {
              return <Card key={el.material.id} material={el}></Card>
            })
          }
        </div></div>
    </>
  )
}

export default Materials
