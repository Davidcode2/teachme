import { useLikelyHumanStore } from "../store";

export default async function verifyCaptcha(value: string) {
  console.log('Recaptcha value:', value);
  if (!value) {
    useLikelyHumanStore.setState({ isLikelyHuman: false });
    return;
  }
  if (Number(value) <= 0.4) {
    console.log('Captcha failed');
    return false;
  }
  useLikelyHumanStore.setState({ isLikelyHuman: true });
}
