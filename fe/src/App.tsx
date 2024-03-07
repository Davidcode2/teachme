import './App.css'
import Header from './components/header/header'
import { Outlet } from 'react-router-dom'

function App(): JSX.Element {

  return (
    <>
      <Header></Header>
      <Outlet />
    </>
  )
}

export default App
