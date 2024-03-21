import './App.css'
import Header from './components/header/header'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar/sidebar'
import { useEffect } from 'react';
import { useAccessTokenStore } from './store';

function App(): JSX.Element {

  useEffect(() => {
    fetch('api/auth/refresh', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.accessToken) {
          useAccessTokenStore((state) => state.setAccessToken(data.accessToken))
        }
      });
  }, []);

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
