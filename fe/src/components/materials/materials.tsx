import { useSearchState, useUserStore } from '../../store';
import Card from '../../components/card/card'
import Material from '../../DTOs/material'
import NoData from './noData';
import { useEffect, useRef, useState } from 'react';
import loadMaterials from '../../loaders/materialLoader';

type MaterialWithThumbnail = {
  material: Material,
  thumbnail: any
}

function Materials() {
  const [materials, setMaterials] = useState<MaterialWithThumbnail[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const materialsLength = useRef(0);
  const offset = useRef(0);
  const limit = useRef(0);
  const searchString = useSearchState((state) => state.searchString);
  const onMinePage = document.location.pathname === "/materials/mine";
  const pageSize = 10;
  const user = useUserStore(state => state.user);


  const searchMaterials = async (offset: number, limit: number) => {
    const baseUrl = getUrl();
    const url = `${baseUrl}?search=${searchString}&offset=${offset}&limit=${limit}`;
    const json = await loadMaterials(url);
    setSearchResults(json);
    if (searchString !== "" && !onMinePage) {
      const materialsWithNullThumbnail = json.map((el: Material) => { return { material: el, thumbnail: null } });
      setMaterials(materialsWithNullThumbnail);
      return;
    }
    if (limit === 0) {
      setMaterials(json);
      materialsLength.current = json.length;
      console.log("setting materials", json.length);
      return;
    } else {
      setMaterials(prevMaterials => [...prevMaterials, ...json]);
      materialsLength.current += json.length;
      console.log("setting materials add", json.length);
    }
  };

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

  const storeSizeExceeded = () => {
    const storeSize = pageSize * 3;
    return materials.length >= storeSize;
  }

  const topScrollThreshold = () => {
    return window.scrollY <= 20;
  }

  const bottomScrollThreshold = () => {
    const differenceBottom = document.documentElement.scrollHeight - window.innerHeight;
    const scrollposition = document.documentElement.scrollTop;
    return differenceBottom - scrollposition <= 2;
  }

  useEffect(() => {
    searchMaterials(0,0);
    console.log("searching materials");
    async function handleScroll() {
      if (isFetching) return;
      setIsFetching(true);
        if (bottomScrollThreshold()) {
          limit.current = Math.round(pageSize / 3);
          offset.current = materialsLength.current;
          console.log("scrolling down, offset: ", offset.current, "limit: ", limit.current);
          await searchMaterials(offset.current, limit.current);
        } else if (topScrollThreshold()) {
          console.log("scrolling up");
          const minOffset = pageSize * 2;
          offset.current -= offset.current >= minOffset ? 10 : offset.current;
          //searchMaterials(pageSize);
        }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      <div>
        {
          materials.map((el: MaterialWithThumbnail) => {
            return <Card key={el.material.id} material={el}></Card>
          })
        }
      </div>
    </>
  )
}

export default Materials
