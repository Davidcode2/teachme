import { redirect } from "react-router";
import { useAccessTokenStore, useLikelyHumanStore } from "../store";
import verifyCaptcha from "../services/reCaptchaService";
import { UserService } from "../services/userService";
import CartService from "../services/cart.service";

export default async function handleSubmit({ request }: { request: Request }) {
  if (!checkCaptchaAndResetLikelyHumanStore()) return false;
  const response = await fetchLogin(request);

  if (JSON.stringify(response).includes("accessToken")) {
    const setAccessToken = useAccessTokenStore.getState().setAccessToken;
    setAccessToken(response.tokens.accessToken);
    await UserService.setUserAndAvatar(response.user);
    new CartService().getItems();
    return redirect("/materials");
  }
  return false;
}

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
