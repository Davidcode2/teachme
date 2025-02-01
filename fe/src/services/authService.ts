import { useAccessTokenStore, useGlobalLoadingStore } from "../store";
import { jwtDecode } from "jwt-decode";

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
  // Add other custom claims here
  preferred_username: string; 
}

export const parseIdJwt = (idToken: string) => {
  try {
    const decodedToken: CustomTokenPayload = jwtDecode(idToken);
    const userId = decodedToken.sub;
    const preferredUsername = decodedToken.preferred_username;
    return { userId, preferredUsername }
  } catch (error) {
    console.error("Error decoding ID Token:", error);
  }
};

export const oidcConfig = {
  authority: "https://localhost:8443/realms/Teachly/",
  client_id: "teachly",
  redirect_uri: "http://localhost:5173/auth/callback",
};

export const handleSignIn = async (userId: string, preferredUsername: string) => {
  fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      withCredentials: "true",
    },
    body: JSON.stringify({ userId: userId, preferredUsername: preferredUsername}),
  });
}

export const switchUser = async (auth: any) => {
  await auth.signoutSilent();
  await auth.signinRedirect();
}
