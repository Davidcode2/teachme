import { useLoaderData } from 'react-router-dom'
import { useSearchState } from '../../store';
import Card from '../../components/card/card'
import Material from '../../DTOs/material'
import NoData from './noData';
import { useEffect, useState } from 'react';

type MaterialWithThumbnail = {
  material: Material,
  thumbnail: any
}

function Materials() {
  const [materials, setMaterials] = useState<MaterialWithThumbnail[]>([]);
  let data: MaterialWithThumbnail[] = useLoaderData() as MaterialWithThumbnail[];
  let searchString = useSearchState((state) => state.searchString);

  const searchMaterials = async () => {
    const res = await fetch(`api/materials?search=${searchString}`);
    const json = await res.json();
    useSearchState.setState({ searchResults: json });
    const materialsWithNullThumbnail = json.map((el: Material) => { return { material: el, thumbnail: null } });
    setMaterials(materialsWithNullThumbnail);
    console.log(searchString);
  };

  useEffect(() => {
    if (searchString === '') {
      setMaterials(data);
      return;
    }
    searchMaterials();
  }, [searchString]);

  if (materials.length === 0) {
    return <NoData />
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
