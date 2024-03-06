import { useState } from 'react'
import './App.css'
import Card from './components/card/card'
import fetcher from './lib/fetcher'
import useSWR from 'swr'

function App() {
  const [count, setCount] = useState(0)
  const { data, error, isLoading } = useSWR('http://localhost:3000', fetcher)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  //else return <div>{data}</div>

  return (
    <>
      <div>{data.message}</div>
      <Card></Card>
    </>
  )
}

export default App
