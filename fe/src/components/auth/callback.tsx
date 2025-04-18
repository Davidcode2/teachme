import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { handleSignIn } from "../../services/authService";
import { useAccessTokenStore, useUserStore } from "../../store";
import { customFetch } from "../../actions/customFetch";
import Spinnkreis from "../../assets/icons/icons8-spinnkreis.gif";

export default function AuthCallback() {
  const auth = useAuth();
  const navigate = useNavigate();
  const accessTokenStore = useAccessTokenStore();
  const userStore = useUserStore();

  const fetchAuthorId = async () => {
    const res = await customFetch(`/api/users/authorId`, {
      method: "GET",
    });
    const user = await res.json();
    return user;
  };

  const getSessionStatus = async () => {
    const session = await auth.querySessionStatus();
    return session?.sub!;
  };

  useEffect(() => {
    const handleAuth = async () => {
      await getSessionStatus();
      if (auth.isAuthenticated) {
        const username = auth?.user?.profile.preferred_username!;
        accessTokenStore.setAccessToken(auth.user?.access_token!);
        const userId = auth?.user?.profile.sub!;
        const { data } = await fetchAuthorId();
        sessionStorage.setItem("authorId", data);
        userStore.setAuthor(data);
        handleSignIn(userId, username);
      }
      navigate("/materials");
    };
    handleAuth();
  }, [auth.isAuthenticated]);

  return (
    <div className="flex h-96 w-screen justify-center items-center">
      <img src={Spinnkreis} alt="loading" className="w-10 h-10" />
    </div>
  );
}
