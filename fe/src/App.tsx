import "./App.css";
import Header from "./components/header/header";
import { Outlet } from "react-router";
import Sidebar from "./components/sidebar/sidebar";
import { useEffect, type JSX } from "react";
import { useAccessTokenStore, useGlobalLoadingStore } from "./store";
import { UserService } from "./services/userService";
import CartService from "./services/cart.service";

function App(): JSX.Element {
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/auth/refresh", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      useGlobalLoadingStore.setState({ loading: false });
      if (data.tokens.accessToken) {
        const setAccessToken = useAccessTokenStore.getState().setAccessToken;
        setAccessToken(data.tokens.accessToken);
      }
      if (data.user) {
        await UserService.setUserAndAvatar(data.user);
        new CartService().getItems();
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <Sidebar></Sidebar>
      <Header></Header>
      <Outlet />
    </div>
  );
}

export default App;
