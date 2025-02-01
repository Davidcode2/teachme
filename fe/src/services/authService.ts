import { useAccessTokenStore, useGlobalLoadingStore } from "../store";

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

export const redirectToKeycloakLogin = () => {
  const KEYCLOAK_REALM = "Teachly";
  const KEYCLOAK_CLIENT_ID = "teachly";
  const KEYCLOAK_AUTH_URL = `https://localhost:8443/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth`;
  const REDIRECT_URI = "http://localhost:5173/auth/callback";

  const authorizationUrl = new URL(KEYCLOAK_AUTH_URL);

  authorizationUrl.searchParams.append("client_id", KEYCLOAK_CLIENT_ID);
  authorizationUrl.searchParams.append("redirect_uri", REDIRECT_URI);
  authorizationUrl.searchParams.append("response_type", "code"); // Authorization code flow
  authorizationUrl.searchParams.append("scope", "openid profile email"); // Request scopes (adjust as needed)
  authorizationUrl.searchParams.append("state", generateRandomString()); // Recommended for security (CSRF protection)
  authorizationUrl.searchParams.append("nonce", generateRandomString()); // Recommended for security (replay attack protection)

  window.location.href = authorizationUrl.toString();
};

const generateRandomString = () => {
  const randomArray = new Uint8Array(16);
  window.crypto.getRandomValues(randomArray);
  return Array.from(randomArray, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
};

const handleAuthentication = async (token: string, state: string, userId: string) => {
  fetch("localhost:8443/realms/Teachly/protocol/openid-connect/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code: token,
      redirect_uri: "http://localhost:5173/auth/callback",
      client_id: "teachly",
    }),
  });
  }
}
