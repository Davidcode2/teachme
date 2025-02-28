import { redirect } from "react-router";
import {
  useAccessTokenStore,
  useLikelyHumanStore,
  useErrorStore,
} from "../store";
import verifyCaptcha from "../services/reCaptchaService";
import { UserService } from "../services/userService";

export default async function handleSubmit({ request }: { request: Request }) {
  await verifyCaptcha();
  if (useLikelyHumanStore.getState().isLikelyHuman === false) {
    return false;
  }
  const formData = await request.formData();
  const response = await fetch("api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const contentType = response.headers.get("Content-Type") || "";
  if (!contentType.includes("application/json")) {
    const pushError = useErrorStore.getState().pushError;
    pushError({ message: "Response is not JSON", code: 500 });
    return null;
  }
  const responseData = await response.json();
  if (JSON.stringify(responseData).includes("accessToken")) {
    const setAccessToken = useAccessTokenStore.getState().setAccessToken;
    setAccessToken(responseData.tokens.accessToken);
    await UserService.setUserAndAvatar(responseData.user);
    //new CartService().getItems();
    return redirect("/materials");
  }
  const pushError = useErrorStore.getState().pushError;
  pushError(responseData.message);
  return null;
}
