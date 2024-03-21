import './App.css'
import Header from './components/header/header'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar/sidebar'
import { useEffect } from 'react';
import { useAccessTokenStore, useUserStore } from './store';

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
        console.log(data);
        if (data.tokens.accessToken) {
          const setAccessToken = useAccessTokenStore.getState().setAccessToken;
          setAccessToken(data.tokens.access_token);
        }
        if (data.user) {
          const setUser = useUserStore.getState().setUser;
          setUser(data.user);
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
