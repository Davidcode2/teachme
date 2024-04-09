import './App.css'
import Header from './components/header/header'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar/sidebar'
import { useEffect, useState } from 'react';
import { useAccessTokenStore, useUserStore } from './store';

function App(): JSX.Element {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('api/auth/refresh', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        if (data.tokens.accessToken) {
          const setAccessToken = useAccessTokenStore.getState().setAccessToken;
          setAccessToken(data.tokens.accessToken);
        }
        if (data.user) {
          const setUser = useUserStore.getState().setUser;
          setUser(data.user);
        }
      });

  }, []);

  return (
    <div>
      <div className="text-5xl font-bold fixed top-1/2 left-1/2">
        {loading ? <div>Lädt...</div> : <></>}
        </div>
        <div className={loading ? "blur-sm" : ""}>
          <div>
            <Sidebar></Sidebar>
          </div>
          <Header></Header>
          <Outlet />
        </div>
      </div>
  )
}

export default App
