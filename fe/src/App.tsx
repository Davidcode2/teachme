import { useState } from 'react'
import './App.css'
import Card from './components/card/card'
import fetcher from './lib/fetcher'
import useSWR from 'swr'
import Material from './DTOs/material'
import Header from './components/header/header'
import { Outlet } from 'react-router-dom'

function App(): JSX.Element {
  const { data, error, isLoading } = useSWR('http://localhost:3000/materials', fetcher)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  //else return <div>{data}</div>

  return (
    <>
    <Outlet/>
      <Header></Header>
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
