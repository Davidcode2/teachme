import { useLoaderData } from 'react-router-dom'
import Card from '../../components/card/card'
import Material from '../../DTOs/material'

function Materials() {
  let data = useLoaderData();

  if (!JSON.stringify(data).includes('401')) {
    return (
      <>
        <div>
          {
            data.map((el: Material) => {
              return <Card key={el.id} material={el}></Card>
            })
          }
        </div>
      </>
    )
  } 
}

export default Materials
