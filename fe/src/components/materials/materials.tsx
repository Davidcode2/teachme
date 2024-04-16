import { useLoaderData } from 'react-router-dom'
import Card from '../../components/card/card'
import Material from '../../DTOs/material'
import NoData from './noData';

function Materials() {
  let data: any = useLoaderData();

  if (data.length === 0) {
    return <NoData/>
  }

  return (
    <>
      <div>
        {
          data.map((el: { material: Material, thumbnail: any }) => {
            return <Card key={el.material.id} material={el}></Card>
          })
        }
      </div>
    </>
  )
}

export default Materials
