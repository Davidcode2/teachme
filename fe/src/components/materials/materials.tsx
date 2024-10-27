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
  const materialsLength = useRef(0);
  const searchString = useSearchState((state) => state.searchString);
  const onMinePage = document.location.pathname === "/materials/mine";
  const user = useUserStore(state => state.user);


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
    materialsLength.current = json.length;
    console.log("setting materials", json.length);
    return;
  };

  const buildLoadMaterialsUrl = () => {
    const baseUrl = getUrl();
    const url = `${baseUrl}?search=${searchString}&offset=${materialsLength.current}&limit=${paginator.increment}`;
    return url;
  }

  const loadMoreMaterials = async (scrollTopOrBottom: number) => {
    let url = "";
    if (scrollTopOrBottom === -1) {
      url = buildLoadMaterialsUrl();
    const json = await loadMaterials(url);
    setMaterials(prevMaterials => [...prevMaterials, ...json]);
    materialsLength.current += json.length;
    console.log("setting materials add", json.length);
    } else {
    //  const numberOfItemsToShift = paginator.numberOfItemsToShift(materialsLength.current);
    //  setMaterials(prevMaterials => prevMaterials.slice(0, numberOfItemsToShift));
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
    console.log("setting scroll event", x);
    setScrollEvent(x);
  }

  useEffect(() => {
    if (!isFetching && scrollEvent !== 0) {
      setIsFetching(true);
      console.log("got scroll event", scrollEvent);
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
