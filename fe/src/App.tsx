import { useState } from 'react'
import './App.css'
import Card from './components/card/card'
import fetcher from './lib/fetcher'
import useSWR from 'swr'
import Material from './DTOs/material'

function App(): JSX.Element {
  const [count, setCount] = useState(0)
  const { data, error, isLoading } = useSWR('http://localhost:3000/materials', fetcher)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  //else return <div>{data}</div>

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

export default App
