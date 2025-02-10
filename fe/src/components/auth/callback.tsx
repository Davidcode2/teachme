import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { handleSignIn, parseIdJwt } from "../../services/authService";
import { useAccessTokenStore } from "../../store";

export default function AuthCallback() {
  const auth = useAuth();
  const navigate = useNavigate();
  const accessTokenStore = useAccessTokenStore();

  const getSessionStatus = async () => {
    const session = await auth.querySessionStatus();
    //const jwt = parseIdJwt(session?.sub!);
    console.log(session);
    return session?.sub!;
  };

  useEffect(() => {
    const handleAuth = async () => {
      const sessionSub = await getSessionStatus();
      if (auth.isAuthenticated) {
        const username = auth?.user?.profile.preferred_username!;
        console.log("access token:", auth.user?.access_token!);
        accessTokenStore.setAccessToken(auth.user?.access_token!);
        const userId = auth?.user?.profile.sub!;
        console.log(username);
        handleSignIn(userId, username);
      }
      navigate("/materials");
    };
    handleAuth();
  }, [auth.isAuthenticated]);

  return <>...loading</>;
}
