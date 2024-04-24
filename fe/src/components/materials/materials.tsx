import { useLoaderData } from 'react-router-dom'
import { useSearchStringState } from '../../store';
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
  let searchString = useSearchStringState.subscribe((state) => state.searchString);
  //setMaterials(data as MaterialWithThumbnail[]);

  useSearchStringState.subscribe(async (state) => {
    const searchString = state.searchString;
    const res = await fetch(`api/materials?search=${searchString}`);
    const json = await res.json();
    const materialsWithNullThumbnail = json.map((el: Material) => { return { material: el, thumbnail: null } });
    setMaterials(materialsWithNullThumbnail);
    data = materialsWithNullThumbnail;
    console.log(searchString);
  });

  useEffect(() => {
  }, [searchString]);

  if (data.length === 0) {
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
