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
    const userId = decodedToken.sub; // Assuming 'sub' claim contains user ID
    const preferredUsername = decodedToken.preferred_username;
    console.log(Object.entries(decodedToken));
    console.log(decodedToken.preferred_username);

    // Use the decoded user information
    console.log("User ID:", userId);
    return { userId, preferredUsername }
  } catch (error) {
    console.error("Error decoding ID Token:", error);
  }
};

export const oidcConfig = {
  authority: "https://localhost:8443/realms/Teachly/",
  client_id: "teachly",
  redirect_uri: "http://localhost:5173",
};
