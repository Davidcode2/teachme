import './App.css'
import Header from './components/header/header'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar'

function App(): JSX.Element {

  return (
    <>
      <div> 
        <Sidebar></Sidebar>
      </div>
      <Header></Header>
      <Outlet />
    </>
  )
}

export default App
