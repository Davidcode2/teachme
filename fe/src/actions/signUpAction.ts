import { redirect } from "react-router";
import {
  useAccessTokenStore,
  useLikelyHumanStore,
} from "../store";
import verifyCaptcha from "../services/reCaptchaService";
import { UserService } from "../services/userService";
import { customFetch } from "./customFetch";
import { handleActionError } from "../utils/actionUtils";

export default async function handleSubmit({ request }: { request: Request }) {
  await verifyCaptcha();
  if (useLikelyHumanStore.getState().isLikelyHuman === false) {
    return false;
  }

  try {
    const formData = await request.formData();
    
    const response = await customFetch("api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    const responseData = await response.json();
    
    if (JSON.stringify(responseData).includes("accessToken")) {
      const setAccessToken = useAccessTokenStore.getState().setAccessToken;
      setAccessToken(responseData.tokens.accessToken);
      await UserService.setUserAndAvatar(responseData.user);
      return redirect("/materials");
    }
    
    // If no access token, treat as error
    throw new Error(responseData.message || "Signup failed");
  } catch (error) {
    if (error instanceof Error && error.message) {
      handleActionError(error, error.message);
    } else {
      handleActionError(error, "Fehler bei der Registrierung");
    }
    return null;
  }
}
