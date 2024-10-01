import './App.css'
import Header from './components/header/header'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar/sidebar'
import SpinnerGif from './assets/icons/icons8-spinner.gif'
import { useEffect } from 'react';
import { useAccessTokenStore, useGlobalLoadingStore } from './store';
import { UserService } from './services/userService'

function App(): JSX.Element {
  const loading = useGlobalLoadingStore((state) => state.loading);

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
      {loading &&
        <div className="font-bold fixed h-screen w-screen">
          <div className="flex w-full h-full justify-center items-center">
            <img className="" src={SpinnerGif} alt="" width="60" />
          </div>
        </div>
      }
      <div className={loading ? "blur-sm" : ""}>
          <Sidebar></Sidebar>
          <Header></Header>
          <Outlet />
      </div>
    </div>
  )
}

export default App
