import { redirect } from "react-router";
import { useLikelyHumanStore } from "../store";
import verifyCaptcha from "../services/reCaptchaService";

export default async function handleSubmit({ request }: { request: Request }) {
  if (!checkCaptchaAndResetLikelyHumanStore()) return false;
  await fetchLogin(request);
  return redirect(redirectToKeycloakLogin().toString());
}

function redirectToKeycloakLogin() {
  // Configuration (replace with your actual values)
  const KEYCLOAK_CLIENT_ID = "teachly";
  const KEYCLOAK_AUTH_URL = `https://localhost:8443/realms/Teachly/protocol/openid-connect/auth`;
  const REDIRECT_URI = "http://localhost:5173/auth/callback"; // Your callback URL

  const authorizationUrl = new URL(KEYCLOAK_AUTH_URL);

  authorizationUrl.searchParams.append("client_id", KEYCLOAK_CLIENT_ID);
  authorizationUrl.searchParams.append("redirect_uri", REDIRECT_URI);
  authorizationUrl.searchParams.append("response_type", "code"); // Authorization code flow
  authorizationUrl.searchParams.append("scope", "openid profile email"); // Request scopes (adjust as needed)
  authorizationUrl.searchParams.append("state", generateRandomState()); // Recommended for security (CSRF protection)
  authorizationUrl.searchParams.append("nonce", generateRandomNonce()); // Recommended for security (replay attack protection)

  // Redirect the user to Keycloak
  //window.location.href = authorizationUrl.toString();
  return authorizationUrl;
}

// Helper function to generate a random state (CSRF protection)
const generateRandomState = () => {
  const randomArray = new Uint8Array(16);
  window.crypto.getRandomValues(randomArray);
  return Array.from(randomArray, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
};

// Helper function to generate a random nonce (replay attack protection)
const generateRandomNonce = () => {
  const randomArray = new Uint8Array(16);
  window.crypto.getRandomValues(randomArray);
  return Array.from(randomArray, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
};

async function checkCaptchaAndResetLikelyHumanStore() {
  await verifyCaptcha();
  if (useLikelyHumanStore.getState().isLikelyHuman === false) {
    return false;
  }
  // reset for next verification
  useLikelyHumanStore.setState({ isLikelyHuman: false });
  return true;
}

async function fetchLogin(request: Request) {
  const formData = await request.formData();
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      withCredentials: "true",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  const responseData = await response.json();
  return responseData;
}
