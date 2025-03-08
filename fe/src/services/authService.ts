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
  authority: import.meta.env.VITE_OIDC_AUTHORITY_URL,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URL,
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
    `oidc.user:${import.meta.env.VITE_OIDC_AUTHORITY_URL}:teachly`,
  );
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}
