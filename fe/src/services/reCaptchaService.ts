import { useLikelyHumanStore } from '../store';

export default async function verifyCaptcha() {
  const token = await generateRecaptchaToken();
  const riskAnalysis = await checkCaptcha(token);
  return riskAnalysis
}

const generateRecaptchaToken = async (): Promise<string> =>
  new Promise((resolve) => {
    grecaptcha.enterprise.ready(
      () =>
        void (async () => {
          const token = await grecaptcha.enterprise.execute(
            '6LeuYlMqAAAAAAS88977iQmCAxq8coWUbe4Z436W',
            { action: 'LOGIN' },
          );

          resolve(token);
        })(),
    );
  });

async function checkCaptcha(token: string) {
  const riskAnalysis = await verifyCaptchaValue(token);
  riskAnalysis >= 0.7
    ? useLikelyHumanStore.setState({ isLikelyHuman: true })
    : useLikelyHumanStore.setState({ isLikelyHuman: false });
  return riskAnalysis;
}

async function verifyCaptchaValue(value: string) {
  const res = await fetch('/api/auth/recaptcha/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  });
  const response = await res.json();
  return response.riskAnalysis.score;
}
