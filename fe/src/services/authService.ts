import { User } from "oidc-client-ts";
import { useAccessTokenStore, useGlobalLoadingStore } from "../store";
import { jwtDecode } from "jwt-decode";
import { AuthProviderProps } from "react-oidc-context";

export default class AuthService {
  refresh = async () => {
    const res = await fetch("/api/auth/refresh", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    useGlobalLoadingStore.setState({ loading: false });
    if (data.accessToken) {
      const setAccessToken = useAccessTokenStore.getState().setAccessToken;
      setAccessToken(data.accessToken);
    }
  };
}

interface CustomTokenPayload {
  iss: string;
  exp: number;
  iat: number;
  aud: string;
  sub: string;
  preferred_username: string;
}

export const parseIdJwt = (idToken: string) => {
  try {
    const decodedToken: CustomTokenPayload = jwtDecode(idToken);
    const userId = decodedToken.sub;
    const preferredUsername = decodedToken.preferred_username;
    return { userId, preferredUsername };
  } catch (error) {
    console.error("Error decoding ID Token:", error);
  }
};

const onSigninCallback = (_user: User | void): void => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

export const oidcConfig: AuthProviderProps = {
  authority: "https://localhost:8443/realms/Teachly/",
  client_id: "teachly",
  redirect_uri: "http://localhost:5173/auth/callback",
  onSigninCallback: onSigninCallback,
};

export const handleSignIn = async (
  userId: string,
  preferredUsername: string,
) => {
  fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      withCredentials: "true",
    },
    body: JSON.stringify({
      userId: userId,
      preferredUsername: preferredUsername,
    }),
  });
};

export const switchUser = async (auth: any) => {
  await auth.signoutSilent();
  await auth.signinRedirect();
};

export function getUser() {
  const oidcStorage = sessionStorage.getItem(
    `oidc.user:https://localhost:8443/realms/Teachly/:teachly`,
  );
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}
