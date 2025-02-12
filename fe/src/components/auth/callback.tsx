import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { handleSignIn, parseIdJwt } from "../../services/authService";
import { useAccessTokenStore, useUserStore } from "../../store";
import { customFetch } from "../../actions/customFetch";

export default function AuthCallback() {
  const auth = useAuth();
  const navigate = useNavigate();
  const accessTokenStore = useAccessTokenStore();
  const userStore = useUserStore();

  const getSessionStatus = async () => {
    const session = await auth.querySessionStatus();
    //const jwt = parseIdJwt(session?.sub!);
    console.log(session);
    return session?.sub!;
  };

  const fetchAuthorId = async () => {
    const res = await customFetch(`/api/users/authorId`, {
      method: "GET",
    });
    const user = await res.json();
    return user
  }

  useEffect(() => {
    const handleAuth = async () => {
      const sessionSub = await getSessionStatus();
      if (auth.isAuthenticated) {
        const username = auth?.user?.profile.preferred_username!;
        console.log("access token:", auth.user?.access_token!);
        accessTokenStore.setAccessToken(auth.user?.access_token!);
        const userId = auth?.user?.profile.sub!;
        const { data } = await fetchAuthorId();
        console.log(data);
        userStore.setAuthor(data); 
        console.log(username);
        handleSignIn(userId, username);
      }
      navigate("/materials");
    };
    handleAuth();
  }, [auth.isAuthenticated]);

  return <>...loading</>;
}
