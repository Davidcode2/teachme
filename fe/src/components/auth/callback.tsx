import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { handleSignIn, parseIdJwt } from "../../services/authService";

export default function AuthCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

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
