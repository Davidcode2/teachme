import './App.css'
import Header from './components/header/header'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar/sidebar'
import { useEffect } from 'react';
import { useAccessTokenStore, useGlobalLoadingStore } from './store';
import { UserService } from './services/userService'

function App(): JSX.Element {

  useEffect(() => {
    fetch('/api/auth/refresh', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        useGlobalLoadingStore.setState({ loading: false });
        if (data.tokens.accessToken) {
          const setAccessToken = useAccessTokenStore.getState().setAccessToken;
          setAccessToken(data.tokens.accessToken);
        }
        if (data.user) {
          UserService.setUserAndAvatar(data.user);
        }
      });

  }, []);

  return (
    <div>
      <div>
        <Sidebar></Sidebar>
        <Header></Header>
        <Outlet />
      </div>
    </div>
  )
}

export default App
