import { useLikelyHumanStore } from "../store";

export default async function verifyCaptcha(value: string) {
  console.log('Recaptcha value:', value);
  if (!value) {
    useLikelyHumanStore.setState({ isLikelyHuman: false });
    return;
  }
  const success = await verifyCaptchaValue(value);
  success === true
    ? useLikelyHumanStore.setState({ isLikelyHuman: true }) 
    : useLikelyHumanStore.setState({ isLikelyHuman: false });
  console.log('Recaptcha success:', success);
}

async function verifyCaptchaValue(value: string) {
  const res = await fetch("/api/auth/recaptcha/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });
  const success = await res.json();
  return success;
}
