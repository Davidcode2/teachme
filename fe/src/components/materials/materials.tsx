import Card from '../../components/card/card'
import useSWR from 'swr'
import Material from '../../DTOs/material'
import { useAccessTokenStore } from '../../store'
import fetchWithToken from '../../lib/fetchWithToken'

function Materials() {
  const accessToken = useAccessTokenStore((state) => state.accessToken);
  const { data, error, isLoading } = useSWR(['http://localhost:3000/materials', accessToken], ([url, accessToken]) => fetchWithToken(url, accessToken))

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  else if (!JSON.stringify(data).includes('401')) {
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
