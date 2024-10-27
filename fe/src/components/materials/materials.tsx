import { useSearchState, useUserStore } from '../../store';
import Card from '../../components/card/card'
import Material from '../../DTOs/material'
import NoData from './noData';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import loadMaterials from '../../loaders/materialLoader';

type MaterialWithThumbnail = {
  material: Material,
  thumbnail: any
}

function Materials() {
  const [materials, setMaterials] = useState<MaterialWithThumbnail[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const offset = useRef(0);
  const searchString = useSearchState((state) => state.searchString);
  const onMinePage = document.location.pathname === "/materials/mine";
  const user = useUserStore(state => state.user);


  const searchMaterials = async () => {
    const baseUrl = getUrl();
    const url = `${baseUrl}?search=${searchString}&offset=${offset.current}`;
    const json = await loadMaterials(url);
    setSearchResults(json);
    if (searchString !== "" && !onMinePage) {
      const materialsWithNullThumbnail = json.map((el: Material) => { return { material: el, thumbnail: null } });
      setMaterials(materialsWithNullThumbnail);
      return;
    }
    setMaterials(json);
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

  useEffect(() => {
    searchMaterials();
    function handleScroll() {
      setTimeout(() => {
        console.log(window.scrollY);
        const differenceTop = window.innerHeight - document.documentElement.scrollHeight;
        const differenceBottom = document.documentElement.scrollHeight - window.innerHeight;
        const scrollposition = document.documentElement.scrollTop;
        if (differenceBottom - scrollposition <= 2) {
          offset.current += 10;
          searchMaterials();
        } else if (window.scrollY <= 20) {
          console.log("scrolling up");
          offset.current -= offset.current >= 20 ? 10 : offset.current;
          searchMaterials();
        }
      }, 1000);
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
