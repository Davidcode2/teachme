import "./App.css";
import Header from "./components/header/header";
import { Outlet } from "react-router";
import Sidebar from "./components/sidebar/sidebar";
import { type JSX } from "react";
import { ErrorOverlay } from "./components/errorOverlay";
import { AuthProvider } from "react-oidc-context";
import { oidcConfig } from "./services/authService";

function App(): JSX.Element {

//  useEffect(() => {
//    const setData = async () => {
//    if (!auth.isLoading) {
//      useGlobalLoadingStore.setState({ loading: false });
//      if (auth.user?.access_token) {
//        const setAccessToken = useAccessTokenStore.getState().setAccessToken;
//        setAccessToken(auth.user?.access_token);
//      }
//      if (auth.user) {
//        await UserService.setUserAndAvatar(auth.user);
//        console.log(auth.user);
//        new CartService().getItems();
//      }
//    }}
//    setData();
//  }, []);

  return (
    <AuthProvider {...oidcConfig}>
      <ErrorOverlay />
      <Sidebar></Sidebar>
      <Header></Header>
      <Outlet />
    </AuthProvider>
  );
}

export default App;
