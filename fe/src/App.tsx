import './App.css'
import Header from './components/header/header'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar/sidebar'
import SpinnerGif from './assets/icons/icons8-spinner.gif'
import { useEffect, useState } from 'react';
import { useAccessTokenStore, useUserStore, useGlobalLoadingStore, useSidebarStore } from './store';
import { gsap } from 'gsap';

function App(): JSX.Element {
  let loading = useGlobalLoadingStore((state) => state.loading);
  let sidebarShown = useSidebarStore((state) => state.isShown);

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
          const setUser = useUserStore.getState().setUser;
          setUser(data.user);
        }
      });

  }, []);

  useSidebarStore.subscribe(() => {
    gsap.set('.sidebar', { x: 300 });
    gsap.to('.sidebar', { x: 0, duration: 1 });
  });

  return (
    <div>
      <div className="text-5xl font-bold fixed top-1/2 left-1/2">
        {loading ? <div><img src={SpinnerGif} alt="" width="60" /></div> : <></>}
      </div>
      <div className={loading ? "blur-sm" : ""}>
        <div className="sidebar">
          {sidebarShown ?
            <Sidebar></Sidebar>
            : <></>}
        </div>
        <Header></Header>
        <Outlet />
      </div>
    </div>
  )
}

export default App
