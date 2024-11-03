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

function SearchResults() {
  const [materials, setMaterials] = useState<MaterialWithThumbnail[]>([]);
  const [searchResults, setSearchResults] = useState<MaterialWithThumbnail[]>([]);
  const searchString = useSearchState((state) => state.searchString);
  const onMinePage = document.location.pathname === "/materials/mine";
  const user = useUserStore(state => state.user);
  const runCount = useRef(0);

  const getUrl = () => {
    if (onMinePage) {
      return `/api/materials/user/${user.id}`;
    }
    return "api/materials";
  }

  const buildLoadMaterialsUrl = () => {
    const baseUrl = getUrl();
    const url = `${baseUrl}?search=${searchString}`;
    return url;
  }

  const searchMaterials = async () => {
    if (runCount.current === 0) return;
    console.log(searchString);
    if (searchString !== "" && !onMinePage) {
      const url = buildLoadMaterialsUrl();
      const json = await loadMaterials(url);
      setSearchResultsGlobal(json);
      const materialsWithNullThumbnail = json.map((el: Material) => { return { material: el, thumbnail: null } });
      setSearchResults(materialsWithNullThumbnail);
      return;
    } else {
      const url = buildLoadMaterialsUrl();
      console.log(url);
      const json = await loadMaterials(url);
      console.log(json);
      setSearchResults([]);
      setMaterials(json);
    }
  };

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

  useEffect(() => {
    searchMaterials();
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
      {
        searchResults.map((el: MaterialWithThumbnail) => {
          return <>hello<Card key={el.material.id} material={el} /></>
        })
      }
    </>
  )
}

export default SearchResults
